#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
收集 attachments 图片到 static 目录

功能：
1. 扫描所有 Markdown 文件，查找 attachments 图片引用
2. 尝试从引用路径的相对位置查找实际图片文件
3. 复制图片到 /static/attachments/ 对应位置

使用方法：
  python3 collect_attachments.py              # 收集所有 attachments 图片
  python3 collect_attachments.py --dry-run    # 预览将要执行的操作（不实际复制）
"""

import os
import re
import sys
import shutil
from pathlib import Path
from urllib.parse import unquote

# 切换到项目根目录（脚本所在目录的父目录）
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
os.chdir(PROJECT_ROOT)

def find_attachment_references():
    """查找所有 attachments 图片引用"""
    references = {}
    
    for root_dir in [Path('blog'), Path('docs')]:
        if not root_dir.exists():
            continue
            
        for md_file in root_dir.rglob('*.md'):
            # 跳过备份目录
            if '.backup' in md_file.parts or '.build-backup' in md_file.parts:
                continue
            # 跳过 hidden 目录
            if 'hidden' in md_file.parts:
                continue
                
            try:
                content = md_file.read_text(encoding='utf-8')
                
                # 匹配图片引用
                pattern = r'!\[.*?\]\(<?([^)>]*?attachments/[^)>]+?)>?\)'
                matches = re.findall(pattern, content)
                
                for match in matches:
                    # URL 解码
                    image_path = unquote(match.strip())
                    
                    if image_path not in references:
                        references[image_path] = []
                    references[image_path].append(md_file)
                    
            except Exception as e:
                print(f"⚠️  读取文件失败 {md_file}: {e}")
    
    return references

def find_actual_image(ref_path, md_file):
    """尝试找到实际的图片文件"""
    # 清理路径
    clean_path = ref_path.lstrip('./')
    
    # 可能的位置
    candidates = [
        md_file.parent / ref_path,        # 相对于 MD 文件的相对路径
        md_file.parent / clean_path,      # 相对于 MD 文件的清理路径
        Path('static') / clean_path,      # 已经在 static 目录
        Path('blog') / clean_path,        # blog 根目录
        Path('docs') / clean_path,        # docs 根目录
    ]
    
    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return candidate
    
    return None

def collect_attachments(dry_run=False):
    """收集所有 attachments 图片到 static 目录"""
    print("🔍 扫描 attachments 图片引用...")
    
    references = find_attachment_references()
    
    if not references:
        print("✅ 没有找到 attachments 图片引用")
        return True
    
    print(f"📊 找到 {len(references)} 个不同的图片引用")
    print("=" * 80)
    
    static_dir = Path('static')
    if not dry_run:
        static_dir.mkdir(exist_ok=True)
    
    found_count = 0
    missing_count = 0
    copied_count = 0
    
    for ref_path, md_files in references.items():
        clean_path = ref_path.lstrip('./')
        target_path = static_dir / clean_path
        
        # 如果目标已存在，跳过
        if target_path.exists():
            found_count += 1
            print(f"  ⏭️  已存在: {clean_path}")
            continue
        
        # 尝试找到实际文件
        actual_file = None
        for md_file in md_files:
            actual_file = find_actual_image(ref_path, md_file)
            if actual_file:
                break
        
        if actual_file:
            if dry_run:
                print(f"  [预览] 将复制: {actual_file} -> {target_path}")
                copied_count += 1
            else:
                # 复制到 static 目录
                target_path.parent.mkdir(parents=True, exist_ok=True)
                try:
                    shutil.copy2(actual_file, target_path)
                    copied_count += 1
                    print(f"  ✅ 已复制: {actual_file.relative_to(Path.cwd())} -> {target_path.relative_to(Path.cwd())}")
                except Exception as e:
                    print(f"  ❌ 复制失败: {e}")
                    missing_count += 1
        else:
            missing_count += 1
            print(f"  ❌ 未找到: {clean_path}")
            print(f"     引用位置: {', '.join([str(f.relative_to(Path.cwd())) for f in md_files[:3]])}")
            if len(md_files) > 3:
                print(f"     ... 和其他 {len(md_files) - 3} 个文件")
    
    print("\n" + "=" * 80)
    print("📊 收集汇总:")
    print(f"  图片引用总数: {len(references)}")
    print(f"  已存在文件: {found_count}")
    print(f"  {'将要' if dry_run else '成功'}复制: {copied_count}")
    print(f"  未找到文件: {missing_count}")
    print("=" * 80)
    
    if missing_count > 0:
        print(f"\n⚠️  注意: 有 {missing_count} 个图片文件未找到")
        print("   这些图片可能需要：")
        print("   1. 手动查找并复制到 static/attachments/ 对应位置")
        print("   2. 或者从原始资料中恢复")
        print("   3. 或者更新 Markdown 文件删除这些引用")
        return False
    
    if dry_run:
        print("\n💡 预览完成，使用不带 --dry-run 参数执行实际复制")
    else:
        print(f"\n✨ 收集完成！共复制 {copied_count} 个图片文件")
    
    return True

def main():
    dry_run = '--dry-run' in sys.argv
    
    if dry_run:
        print("🔍 预览模式 - 不会实际复制文件\n")
    
    success = collect_attachments(dry_run)
    
    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())
