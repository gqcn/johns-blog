#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Markdown 图片引用转换脚本
在构建前将普通 Markdown 图片语法转换为 ideal-image 组件

功能：
1. 扫描所有 Markdown 文件，转换为 MDX 格式
2. 查找 ![alt](image.png) 格式的图片引用
3. 转换为 <Image img={require('image.png')} alt="alt" /> 格式
4. 自动添加 Image 组件导入语句
5. 利用 Docusaurus ideal-image 插件自动生成响应式图片

使用方法：
  python3 convert_images_for_build.py          # 转换所有目录
  python3 convert_images_for_build.py blog     # 只转换 blog 目录
  python3 convert_images_for_build.py --revert # 恢复原始文件
"""

import os
import re
import sys
import shutil
from pathlib import Path
from datetime import datetime
from urllib.parse import unquote

# 切换到项目根目录（脚本所在目录的父目录）
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
os.chdir(PROJECT_ROOT)

# 备份目录
BACKUP_DIR = ".build-backup"
# Image 组件导入语句
IMAGE_IMPORT = "import Image from '@theme/IdealImage';\n\n"

def convert_image_syntax(md_content, md_file_path):
    """
    转换 Markdown 中的图片语法为 ideal-image 组件
    
    ![alt](image.png) -> <Image img={require('./image.png')} alt="alt" />
    
    特殊处理：
    - ./attachments/ 或 /attachments/ 路径 -> 映射到 /static/attachments/
    """
    conversions = 0
    has_images = False
    
    # 匹配 Markdown 图片语法: ![alt](path) 或 ![alt](<path>)
    # 支持带角括号的路径（Markdown 处理空格路径的标准语法）
    # 使用 .+? 非贪婪匹配直到找到图片扩展名，支持路径中的括号、&等特殊字符
    pattern = r'!\[([^\]]*)\]\(<?(.*?\.(?:png|jpg|jpeg|webp|gif))>?\)'
    
    def replace_image(match):
        nonlocal conversions, has_images
        alt_text = match.group(1)
        image_path = match.group(2).strip()
        
        has_images = True
        conversions += 1
        
        # URL 解码路径（处理 %20 等编码字符）
        image_path = unquote(image_path)
        
        # 特殊处理 attachments 路径
        if 'attachments/' in image_path:
            # 移除路径前的 ./ 或 /
            clean_path = image_path.lstrip('./')
            # 使用 @site 别名引用 static 目录
            return f"<Image img={{require('@site/static/{clean_path}')}} alt=\"{alt_text}\" />"
        
        # 普通相对路径处理
        # 移除开头的 /（避免 .// 双斜杠）
        image_path = image_path.lstrip('/')
        
        # 转换为 ideal-image 组件语法
        # 处理路径中的特殊字符
        escaped_path = image_path.replace("'", "\\'")
        
        # 添加 ./ 前缀（require 需要相对路径）
        if not escaped_path.startswith('./'):
            escaped_path = './' + escaped_path
        
        return f"<Image img={{require('{escaped_path}')}} alt=\"{alt_text}\" />"
    
    new_content = re.sub(pattern, replace_image, md_content)
    
    # 如果有图片转换，需要添加 import 语句
    if has_images and conversions > 0:
        # 检查是否已经有 import 语句
        if IMAGE_IMPORT.strip() not in new_content:
            # 在文件开头添加 import（在 frontmatter 之后）
            # 检查是否有 frontmatter
            if new_content.startswith('---'):
                # 找到第二个 ---
                parts = new_content.split('---', 2)
                if len(parts) >= 3:
                    new_content = f"---{parts[1]}---\n{IMAGE_IMPORT}{parts[2]}"
                else:
                    new_content = IMAGE_IMPORT + new_content
            else:
                new_content = IMAGE_IMPORT + new_content
    
    return new_content, conversions

def backup_file(file_path, backup_dir):
    """备份文件"""
    # 将文件路径转为绝对路径，并尝试获取相对于当前工作目录的路径
    abs_file_path = Path(file_path).resolve()
    cwd = Path.cwd()
    
    try:
        rel_path = abs_file_path.relative_to(cwd)
    except ValueError:
        # 如果文件不在当前工作目录下，使用文件名
        rel_path = abs_file_path.name
    
    backup_path = Path(backup_dir) / rel_path
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(file_path, backup_path)

def safe_relative_path(file_path, base_path):
    """安全地获取相对路径，如果失败则返回文件名"""
    try:
        return Path(file_path).relative_to(base_path)
    except ValueError:
        return Path(file_path).name

def convert_referencing_files(target_dirs, renamed_files, backup_root, iteration=1):
    """
    转换那些引用了被重命名文件的 .md 文件
    这些文件本身可能没有图片，但因为引用了被转换的文件，链接会失效
    所以也需要将它们转换为 .mdx 并更新链接
    返回：新转换的文件列表 [(old_path, new_path), ...]
    """
    if not renamed_files:
        return []
    
    if iteration == 1:
        print("\n🔗 处理引用了被转换文件的其他文档...")
        print("=" * 80)
    else:
        print(f"\n🔗 第 {iteration} 轮：处理新的引用关系...")
        print("=" * 80)
    
    # 创建被重命名文件的映射：文件名 -> 新文件名
    rename_map = {}
    for old_path, new_path in renamed_files:
        old_name = old_path.name
        new_name = new_path.name
        rename_map[old_name] = new_name
    
    converted_count = 0
    link_pattern = r'\[([^\]]+)\]\(([^)]+\.md)\)'
    newly_renamed = []  # 新转换的文件列表
    
    # 扫描所有剩余的 .md 文件和已存在的 .mdx 文件
    for target_dir in target_dirs:
        if not target_dir.exists():
            continue
        
        # 处理 .md 文件
        for file_path in target_dir.rglob('*.md'):
            # 跳过备份目录
            if BACKUP_DIR in file_path.parts or '.backup' in file_path.parts:
                continue
            if 'hidden' in file_path.parts:
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 检查是否引用了被重命名的文件
                has_reference = False
                for match in re.finditer(link_pattern, content):
                    link_path = match.group(2)
                    from urllib.parse import unquote
                    decoded_path = unquote(link_path)
                    file_name = Path(decoded_path).name
                    
                    if file_name in rename_map:
                        has_reference = True
                        break
                
                # 如果引用了被转换的文件，将此文件也转换为 .mdx
                if has_reference:
                    # 备份原始文件
                    backup_file(file_path, backup_root)
                    
                    # 重命名为 .mdx
                    mdx_file = file_path.with_suffix('.mdx')
                    
                    # 更新链接
                    def replace_link(match):
                        link_text = match.group(1)
                        link_path = match.group(2)
                        from urllib.parse import unquote
                        decoded_path = unquote(link_path)
                        file_name = Path(decoded_path).name
                        
                        if file_name in rename_map:
                            new_path = link_path.replace('.md', '.mdx')
                            return f'[{link_text}]({new_path})'
                        return match.group(0)
                    
                    updated_content = re.sub(link_pattern, replace_link, content)
                    
                    # 写入新文件
                    with open(mdx_file, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    
                    # 删除原 .md 文件
                    file_path.unlink()
                    
                    newly_renamed.append((file_path, mdx_file))  # 记录新转换的文件
                    converted_count += 1
                    # print(f"  ✅ {safe_relative_path(file_path, target_dir)} → {mdx_file.name}: 已更新链接")
            
            except Exception as e:
                print(f"  ❌ 处理失败 {file_path.name}: {e}")
    
    if converted_count > 0:
        print(f"\n📊 额外转换: {converted_count} 个文件因引用关系被转换")
        print("=" * 80)
    
    return newly_renamed

def update_markdown_links(target_dirs, renamed_files):
    """
    更新其他文档中指向已重命名文件的链接
    将 .md 链接更新为 .mdx 链接
    """
    if not renamed_files:
        return
    
    print("\n🔗 更新文档链接...")
    print("=" * 80)
    
    # 创建重命名映射字典：相对路径 -> 新扩展名
    rename_map = {}
    for old_path, new_path in renamed_files:
        # 使用文件名作为键（因为链接通常是相对路径）
        old_name = old_path.name
        new_name = new_path.name
        rename_map[old_name] = new_name
    
    updated_files = 0
    updated_links = 0
    
    # 只扫描 MDX 文件（已转换的文件），不修改源 .md 文件
    for target_dir in target_dirs:
        if not target_dir.exists():
            continue
        
        for file_path in target_dir.rglob('*.mdx'):
            # 跳过备份目录
            if BACKUP_DIR in file_path.parts or '.backup' in file_path.parts:
                continue
            if 'hidden' in file_path.parts:
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                file_updated = False
                
                # 查找所有 Markdown 链接：[text](path)
                # 匹配 .md 文件链接
                link_pattern = r'\[([^\]]+)\]\(([^)]+\.md)\)'
                
                def replace_link(match):
                    nonlocal file_updated, updated_links
                    link_text = match.group(1)
                    link_path = match.group(2)
                    
                    # 提取文件名
                    from urllib.parse import unquote
                    decoded_path = unquote(link_path)
                    file_name = Path(decoded_path).name
                    
                    # 检查是否在重命名映射中
                    if file_name in rename_map:
                        # 替换扩展名
                        new_path = link_path.replace('.md', '.mdx')
                        file_updated = True
                        updated_links += 1
                        return f'[{link_text}]({new_path})'
                    
                    return match.group(0)
                
                # 执行替换
                content = re.sub(link_pattern, replace_link, content)
                
                # 如果有更新，写回文件
                if file_updated:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    updated_files += 1
                    # print(f"  ✅ {safe_relative_path(file_path, target_dir)}: 更新了 {content.count('.mdx') - original_content.count('.mdx')} 个链接")
            
            except Exception as e:
                print(f"  ❌ 更新失败 {file_path.name}: {e}")
    
    print(f"\n📊 链接更新汇总:")
    print(f"  已更新文件: {updated_files}")
    print(f"  已更新链接: {updated_links}")
    print("=" * 80)

def convert_markdown_files(target_dirs, backup_root):
    """转换指定目录下的所有 Markdown 文件为 MDX 格式"""
    total_files = 0
    converted_files = 0
    total_images = 0
    renamed_files = []
    
    print("🔄 开始转换 Markdown 图片引用为 ideal-image 组件...")
    print(f"📦 备份目录: {backup_root}")
    print("=" * 80)
    
    for target_dir in target_dirs:
        if not target_dir.exists():
            print(f"⚠️  跳过：目录不存在 - {target_dir}")
            continue
        
        print(f"\n📁 处理目录: {target_dir}")
        
        # 遍历所有 Markdown 文件（包括 .md 和 .mdx）
        for md_file in list(target_dir.rglob('*.md')) + list(target_dir.rglob('*.mdx')):
            # 跳过备份目录
            if BACKUP_DIR in md_file.parts or '.backup' in md_file.parts:
                continue
            
            # 跳过 hidden 目录（与 docusaurus.config.ts 的 ignorePatterns 一致）
            if 'hidden' in md_file.parts:
                continue
            
            total_files += 1
            
            try:
                # 读取文件
                with open(md_file, 'r', encoding='utf-8') as f:
                    original_content = f.read()
                
                # 转换图片语法
                new_content, conversions = convert_image_syntax(original_content, md_file)
                
                if conversions > 0:
                    # 备份原始文件
                    backup_file(md_file, backup_root)
                    
                    # 如果是 .md 文件，重命名为 .mdx
                    if md_file.suffix == '.md':
                        mdx_file = md_file.with_suffix('.mdx')
                        renamed_files.append((md_file, mdx_file))
                        
                        # 写入新内容到 .mdx 文件
                        with open(mdx_file, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        
                        # 删除原 .md 文件
                        md_file.unlink()
                        
                        converted_files += 1
                        total_images += conversions
                        # print(f"  ✅ {safe_relative_path(md_file, target_dir)} → {mdx_file.name}: {conversions} 张图片已转换")
                    else:
                        # 已经是 .mdx 文件，直接覆盖
                        with open(md_file, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        
                        converted_files += 1
                        total_images += conversions
                        # print(f"  ✅ {safe_relative_path(md_file, target_dir)}: {conversions} 张图片已转换")
            
            except Exception as e:
                print(f"  ❌ 处理失败 {md_file.name}: {e}")
    
    print("\n" + "=" * 80)
    print("📊 转换汇总:")
    print(f"  扫描文件数: {total_files}")
    print(f"  已转换文件: {converted_files}")
    print(f"  已转换图片: {total_images}")
    print(f"  .md → .mdx: {len(renamed_files)}")
    print(f"  未转换文件: {total_files - converted_files}")
    print("=" * 80)
    
    # 处理引用了被转换文件的其他 .md 文件
    # 需要迭代处理，因为可能存在链式引用关系
    if renamed_files:
        all_newly_renamed = []
        iteration = 1
        while True:
            newly_renamed = convert_referencing_files(target_dirs, renamed_files, backup_root, iteration)
            if not newly_renamed:
                break  # 没有新的文件被转换，停止迭代
            
            all_newly_renamed.extend(newly_renamed)
            renamed_files.extend(newly_renamed)  # 将新转换的文件加入列表，供下一轮使用
            iteration += 1
        
        converted_files += len(all_newly_renamed)
        
        # 更新所有 .mdx 文件中的链接
        update_markdown_links(target_dirs, renamed_files)
    
    return converted_files > 0

def revert_files(backup_root):
    """从备份恢复原始文件"""
    if not backup_root.exists():
        print("⚠️  没有找到备份目录，无需恢复")
        return
    
    print("🔄 开始恢复原始文件...")
    print(f"📦 备份目录: {backup_root}")
    print("=" * 80)
    
    restored_count = 0
    mdx_deleted_count = 0
    
    # 首先删除所有 .mdx 文件（这些是转换生成的）
    for target_dir in [Path.cwd() / 'blog', Path.cwd() / 'docs']:
        if target_dir.exists():
            for mdx_file in target_dir.rglob('*.mdx'):
                if BACKUP_DIR not in mdx_file.parts and '.backup' not in mdx_file.parts:
                    # 检查是否有对应的备份 .md 文件
                    md_file = mdx_file.with_suffix('.md')
                    backup_md = backup_root / md_file.relative_to(Path.cwd())
                    
                    if backup_md.exists():
                        try:
                            mdx_file.unlink()
                            mdx_deleted_count += 1
                            print(f"  🗑️  已删除转换文件: {safe_relative_path(mdx_file, Path.cwd())}")
                        except Exception as e:
                            print(f"  ❌ 删除失败 {mdx_file.name}: {e}")
    
    # 遍历备份目录，恢复所有文件
    for backup_file_path in backup_root.rglob('*'):
        if backup_file_path.is_file():
            # 计算原始文件路径
            relative_path = backup_file_path.relative_to(backup_root)
            original_file = Path.cwd() / relative_path
            
            try:
                # 确保目标目录存在
                original_file.parent.mkdir(parents=True, exist_ok=True)
                
                # 恢复文件
                shutil.copy2(backup_file_path, original_file)
                restored_count += 1
                # print(f"  ✅ 已恢复: {relative_path}")
            except Exception as e:
                print(f"  ❌ 恢复失败 {relative_path}: {e}")
    
    # 删除备份目录
    try:
        shutil.rmtree(backup_root)
        print(f"\n✅ 已删除备份目录: {backup_root}")
    except Exception as e:
        print(f"\n⚠️  删除备份目录失败: {e}")
    
    print("\n" + "=" * 80)
    print(f"📊 恢复汇总:")
    print(f"  已恢复 .md 文件: {restored_count}")
    print(f"  已删除 .mdx 文件: {mdx_deleted_count}")
    print("=" * 80)

def main():
    """主函数"""
    # 使用项目根目录而非脚本目录
    backup_root = Path(BACKUP_DIR)
    
    # 检查是否是恢复模式
    if '--revert' in sys.argv or '-r' in sys.argv:
        revert_files(backup_root)
        return
    
    # 确定要处理的目录
    if len(sys.argv) > 1 and not sys.argv[1].startswith('--'):
        target_dirs = [Path(arg) for arg in sys.argv[1:] if not arg.startswith('--')]
    else:
        target_dirs = [
            Path('blog'),
            Path('docs'),
        ]
    
    print("🖼️  Markdown 图片引用转换工具（ideal-image 模式）")
    print(f"⏰ 开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📂 待处理目录数: {len(target_dirs)}")
    
    # 转换文件
    has_changes = convert_markdown_files(target_dirs, backup_root)
    
    if has_changes:
        print("\n💡 提示:")
        print("  - 原始 .md 文件已备份到:", backup_root)
        print("  - 已将包含图片的文件转换为 .mdx 格式")
        print("  - ideal-image 插件会自动生成响应式图片")
        print("  - 构建完成后运行以下命令恢复原始文件:")
        print(f"    python3 {Path(__file__).name} --revert")
        print("\n📝 配置说明:")
        print("  - 可在 docusaurus.config.ts 中调整 ideal-image 插件配置")
        print("  - quality: 图片质量 (1-100)")
        print("  - max: PC端最大宽度")
        print("  - min: 移动端最小宽度")
        print("  - steps: 生成的尺寸版本数量")
    else:
        print("\n💡 没有找到需要转换的图片")
    
    print(f"\n⏰ 完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == '__main__':
    main()
