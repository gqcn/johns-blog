#!/usr/bin/env python3
"""
清理构建目录中未被使用的图片文件
扫描所有 HTML 文件，找出实际引用的图片，删除未引用的图片
"""
import os
import re
import glob
from pathlib import Path
from urllib.parse import unquote

# 切换到项目根目录（脚本所在目录的父目录）
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
os.chdir(PROJECT_ROOT)

def find_referenced_images(build_dir='build'):
    """扫描所有 HTML 文件，找出所有引用的图片"""
    html_files = glob.glob(f'{build_dir}/**/*.html', recursive=True)
    
    # 用于存储引用的图片路径
    assets_images = set()  # /assets/images/ 下的图片
    attachments = set()    # /attachments/ 下的图片
    
    print(f"📊 扫描 {len(html_files)} 个 HTML 文件...")
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 匹配 /assets/images/ 路径
            # 匹配多种格式：
            # 1. src="/assets/images/xxx" 或 src='/assets/images/xxx' (有引号)
            # 2. src=/assets/images/xxx (无引号)
            # 3. srcset="/assets/images/xxx" 等
            
            # 匹配有引号的格式
            assets_matches = re.findall(r'["\'](?:/assets/images/|assets/images/)([^"\']+)["\']', content)
            for match in assets_matches:
                decoded = unquote(match)
                assets_images.add(decoded)
            
            # 匹配无引号的格式: src=/assets/images/xxx
            assets_matches_no_quotes = re.findall(r'(?:src|srcset)=/assets/images/([^\s>]+)', content)
            for match in assets_matches_no_quotes:
                decoded = unquote(match)
                assets_images.add(decoded)
            
            # 匹配 /attachments/ 路径
            # 匹配有引号的格式
            attachments_matches = re.findall(r'["\'](?:/attachments/|attachments/)([^"\']+)["\']', content)
            for match in attachments_matches:
                decoded = unquote(match)
                attachments.add(decoded)
            
            # 匹配无引号的格式: src=/attachments/xxx
            attachments_matches_no_quotes = re.findall(r'(?:src|srcset)=/attachments/([^\s>]+)', content)
            for match in attachments_matches_no_quotes:
                decoded = unquote(match)
                attachments.add(decoded)
            
            # 匹配 require('@site/static/attachments/xxx') 格式（Docusaurus 代码示例）
            attachments_matches_require = re.findall(r'require\(["\']@site/static/attachments/([^"\']+)["\']\)', content)
            for match in attachments_matches_require:
                decoded = unquote(match)
                attachments.add(decoded)
            
            # 匹配 Markdown 语法在 code 标签内的格式: ![](/attachments/xxx.png)
            attachments_matches_markdown = re.findall(r'!\[\]\(/attachments/([^)]+)\)', content)
            for match in attachments_matches_markdown:
                decoded = unquote(match)
                attachments.add(decoded)
                
        except Exception as e:
            print(f"⚠️  读取文件失败 {html_file}: {e}")
    
    return assets_images, attachments

def clean_directory(directory, referenced_files, dir_type):
    """清理目录中未被引用的文件"""
    if not os.path.exists(directory):
        print(f"⚠️  目录不存在: {directory}")
        return 0, 0
    
    all_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            # 跳过非图片文件
            if not file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp')):
                continue
            full_path = os.path.join(root, file)
            # 获取相对路径
            rel_path = os.path.relpath(full_path, directory)
            all_files.append((full_path, rel_path))
    
    total_count = len(all_files)
    removed_count = 0
    removed_size = 0
    
    print(f"\n🔍 检查 {dir_type}: {total_count} 个图片文件")
    
    for full_path, rel_path in all_files:
        # 检查是否被引用
        is_referenced = False
        
        # 尝试多种路径格式匹配
        file_name = os.path.basename(full_path)
        
        if file_name in referenced_files:
            is_referenced = True
        elif rel_path in referenced_files:
            is_referenced = True
        elif rel_path.replace('\\', '/') in referenced_files:
            is_referenced = True
        else:
            # 尝试匹配任何包含该文件名的引用
            for ref in referenced_files:
                if file_name in ref or rel_path in ref:
                    is_referenced = True
                    break
        
        if not is_referenced:
            try:
                file_size = os.path.getsize(full_path)
                os.remove(full_path)
                removed_count += 1
                removed_size += file_size
                print(f"  ❌ 删除: {rel_path} ({file_size / 1024:.1f} KB)")
            except Exception as e:
                print(f"  ⚠️  删除失败 {rel_path}: {e}")
    
    return total_count, removed_count, removed_size

def main():
    build_dir = 'build'
    
    if not os.path.exists(build_dir):
        print(f"❌ 构建目录不存在: {build_dir}")
        print("请先执行 'make build' 生成构建文件")
        return
    
    print("🧹 开始清理未使用的图片文件...\n")
    
    # 扫描 HTML 文件找出引用的图片
    assets_images, attachments = find_referenced_images(build_dir)
    
    print(f"\n📈 统计结果:")
    print(f"  - /assets/images/ 引用: {len(assets_images)} 个")
    print(f"  - /attachments/ 引用: {len(attachments)} 个")
    
    # 清理 build/assets/images
    assets_dir = os.path.join(build_dir, 'assets', 'images')
    total_assets, removed_assets, size_assets = clean_directory(
        assets_dir, assets_images, "build/assets/images"
    )
    
    # 清理 build/attachments
    attachments_dir = os.path.join(build_dir, 'attachments')
    total_attachments, removed_attachments, size_attachments = clean_directory(
        attachments_dir, attachments, "build/attachments"
    )
    
    # 总结
    print(f"\n✨ 清理完成！")
    print(f"\n📊 build/assets/images:")
    print(f"  - 总文件数: {total_assets}")
    print(f"  - 删除文件数: {removed_assets}")
    print(f"  - 保留文件数: {total_assets - removed_assets}")
    print(f"  - 清理空间: {size_assets / 1024 / 1024:.2f} MB")
    
    print(f"\n📊 build/attachments:")
    print(f"  - 总文件数: {total_attachments}")
    print(f"  - 删除文件数: {removed_attachments}")
    print(f"  - 保留文件数: {total_attachments - removed_attachments}")
    print(f"  - 清理空间: {size_attachments / 1024 / 1024:.2f} MB")
    
    total_removed = removed_assets + removed_attachments
    total_size = (size_assets + size_attachments) / 1024 / 1024
    print(f"\n🎉 总计删除 {total_removed} 个未使用的图片，释放 {total_size:.2f} MB 空间")

if __name__ == '__main__':
    main()
