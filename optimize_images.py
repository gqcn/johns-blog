#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片优化脚本
用于优化博客中的图片资源，减小文件大小，提高加载速度

功能：
1. 限制图片最大尺寸为 1000x1000 像素
2. 压缩图片质量，保持视觉质量的同时减小文件大小
3. 支持 PNG, JPG, JPEG, WEBP 格式
4. 备份原始图片到 .backup 目录
5. 支持同时优化多个目录（默认：blog 和 docs）

使用方法：
  python3 optimize_images.py              # 优化默认目录（blog 和 docs）
  python3 optimize_images.py blog         # 只优化 blog 目录
  python3 optimize_images.py blog docs    # 优化 blog 和 docs 目录
  python3 optimize_images.py /path/to/dir # 优化指定目录
"""

import os
import sys
from pathlib import Path
from PIL import Image
import shutil
from datetime import datetime

# 配置参数
MAX_SIZE = 1000  # 最大宽度或高度（像素）
JPEG_QUALITY = 85  # JPEG 质量（1-100）
PNG_OPTIMIZE = True  # PNG 优化
WEBP_QUALITY = 85  # WebP 质量（1-100）
BACKUP_DIR = ".backup"  # 备份目录名

# 支持的图片格式
SUPPORTED_FORMATS = {'.png', '.jpg', '.jpeg', '.webp'}

def get_image_size_mb(file_path):
    """获取图片文件大小（MB）"""
    size_bytes = os.path.getsize(file_path)
    return size_bytes / (1024 * 1024)

def should_optimize_image(image_path):
    """判断图片是否需要优化"""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            # 如果尺寸超过限制，需要优化
            if width > MAX_SIZE or height > MAX_SIZE:
                return True
            # 如果文件较大（超过500KB），也尝试优化
            if os.path.getsize(image_path) > 500 * 1024:
                return True
    except Exception as e:
        print(f"检查图片失败 {image_path}: {e}")
    return False

def optimize_image(image_path, backup_dir):
    """
    优化单个图片
    
    Args:
        image_path: 图片路径
        backup_dir: 备份目录
    
    Returns:
        tuple: (成功标志, 原始大小MB, 优化后大小MB)
    """
    try:
        original_size = get_image_size_mb(image_path)
        
        # 打开图片
        with Image.open(image_path) as img:
            # 获取原始尺寸
            original_width, original_height = img.size
            
            # 转换 RGBA 图片为 RGB（如果需要保存为 JPEG）
            if img.mode == 'RGBA' and image_path.lower().endswith(('.jpg', '.jpeg')):
                # 创建白色背景
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])  # 使用 alpha 通道作为遮罩
                img = background
            
            # 计算新尺寸
            if original_width > MAX_SIZE or original_height > MAX_SIZE:
                ratio = min(MAX_SIZE / original_width, MAX_SIZE / original_height)
                new_width = int(original_width * ratio)
                new_height = int(original_height * ratio)
                
                # 使用高质量重采样
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                print(f"  调整尺寸: {original_width}x{original_height} -> {new_width}x{new_height}")
            
            # 备份原始文件
            backup_path = Path(backup_dir) / Path(image_path).relative_to(Path(image_path).parent.parent)
            backup_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(image_path, backup_path)
            
            # 根据格式保存优化后的图片
            ext = Path(image_path).suffix.lower()
            
            if ext in ['.jpg', '.jpeg']:
                img.save(image_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
            elif ext == '.png':
                img.save(image_path, 'PNG', optimize=PNG_OPTIMIZE)
            elif ext == '.webp':
                img.save(image_path, 'WEBP', quality=WEBP_QUALITY)
            
            optimized_size = get_image_size_mb(image_path)
            return True, original_size, optimized_size
            
    except Exception as e:
        print(f"  ❌ 优化失败: {e}")
        return False, 0, 0

def main():
    """主函数"""
    target_dirs = []
    
    if len(sys.argv) > 1:
        # 使用命令行参数指定的目录
        target_dirs = [Path(arg) for arg in sys.argv[1:]]
    else:
        # 默认使用 blog 和 docs 目录
        script_dir = Path(__file__).parent
        target_dirs = [
            script_dir / 'blog',
            script_dir / 'docs',
        ]
    
    print("🖼️  博客图片优化工具")
    print(f"⏰ 开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📂 待优化目录数: {len(target_dirs)}")
    
    # 汇总统计
    total_all_images = 0
    total_all_optimized = 0
    total_all_skipped = 0
    total_all_original_size = 0
    total_all_optimized_size = 0
    
    for idx, target_dir in enumerate(target_dirs, 1):
        print(f"\n{'=' * 80}")
        print(f"📁 [{idx}/{len(target_dirs)}] 处理目录: {target_dir}")
        print(f"{'=' * 80}")
        
        if not target_dir.exists():
            print(f"⚠️  跳过：目录不存在 - {target_dir}")
            continue
        
        # 为每个目录创建独立的备份目录
        backup_dir = target_dir / BACKUP_DIR
        backup_dir.mkdir(exist_ok=True)
        
        # 统计信息
        dir_total_images = 0
        dir_optimized_images = 0
        dir_total_original_size = 0
        dir_total_optimized_size = 0
        dir_skipped_images = 0
        
        print(f"\n🔍 扫描目录: {target_dir}")
        print(f"📦 备份目录: {backup_dir}")
        print(f"📐 最大尺寸: {MAX_SIZE}x{MAX_SIZE} 像素")
        print(f"🎨 JPEG 质量: {JPEG_QUALITY}")
        print("=" * 80)
        
        # 遍历所有图片文件
        for image_file in target_dir.rglob('*'):
            # 跳过备份目录
            if BACKUP_DIR in image_file.parts:
                continue
                
            if image_file.suffix.lower() in SUPPORTED_FORMATS and image_file.is_file():
                dir_total_images += 1
                print(f"\n[{dir_total_images}] 处理: {image_file.name}")
                print(f"  路径: {image_file.relative_to(target_dir)}")
                
                # 检查是否需要优化
                if not should_optimize_image(image_file):
                    print(f"  ✅ 跳过：图片已经是最优状态")
                    dir_skipped_images += 1
                    continue
                
                # 优化图片
                success, original_size, optimized_size = optimize_image(
                    str(image_file), 
                    str(backup_dir)
                )
                
                if success:
                    dir_optimized_images += 1
                    dir_total_original_size += original_size
                    dir_total_optimized_size += optimized_size
                    
                    size_reduction = original_size - optimized_size
                    reduction_percent = (size_reduction / original_size * 100) if original_size > 0 else 0
                    
                    print(f"  ✅ 优化成功:")
                    print(f"     原始大小: {original_size:.2f} MB")
                    print(f"     优化后: {optimized_size:.2f} MB")
                    print(f"     节省: {size_reduction:.2f} MB ({reduction_percent:.1f}%)")
        
        # 输出本目录汇总信息
        print("\n" + "=" * 80)
        print(f"📊 [{target_dir.name}] 目录优化汇总:")
        print(f"  总图片数: {dir_total_images}")
        print(f"  已优化: {dir_optimized_images}")
        print(f"  已跳过: {dir_skipped_images}")
        print(f"  失败: {dir_total_images - dir_optimized_images - dir_skipped_images}")
        
        if dir_optimized_images > 0:
            dir_reduction = dir_total_original_size - dir_total_optimized_size
            dir_percent = (dir_reduction / dir_total_original_size * 100) if dir_total_original_size > 0 else 0
            print(f"\n💾 空间节省:")
            print(f"  原始总大小: {dir_total_original_size:.2f} MB")
            print(f"  优化后总大小: {dir_total_optimized_size:.2f} MB")
            print(f"  总共节省: {dir_reduction:.2f} MB ({dir_percent:.1f}%)")
        
        print(f"\n📁 原始文件已备份到: {backup_dir}")
        
        # 累加到总统计
        total_all_images += dir_total_images
        total_all_optimized += dir_optimized_images
        total_all_skipped += dir_skipped_images
        total_all_original_size += dir_total_original_size
        total_all_optimized_size += dir_total_optimized_size
    
    # 输出总体汇总
    print("\n" + "=" * 80)
    print("🎉 全部目录优化完成！")
    print("=" * 80)
    print(f"📊 总体统计:")
    print(f"  处理目录数: {len(target_dirs)}")
    print(f"  总图片数: {total_all_images}")
    print(f"  已优化: {total_all_optimized}")
    print(f"  已跳过: {total_all_skipped}")
    print(f"  失败: {total_all_images - total_all_optimized - total_all_skipped}")
    
    if total_all_optimized > 0:
        total_reduction = total_all_original_size - total_all_optimized_size
        total_percent = (total_reduction / total_all_original_size * 100) if total_all_original_size > 0 else 0
        print(f"\n💾 总空间节省:")
        print(f"  原始总大小: {total_all_original_size:.2f} MB")
        print(f"  优化后总大小: {total_all_optimized_size:.2f} MB")
        print(f"  总共节省: {total_reduction:.2f} MB ({total_percent:.1f}%)")
    
    print(f"\n⏰ 完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("✨ 所有优化完成！")

if __name__ == '__main__':
    main()
