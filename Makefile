.PHONY: up
up:
	git add -A
	git commit -m "doc update"
	git push origin main
	
.PHONY: build
build:
	@echo "🏗️  开始构建博客..."
	@echo "� 步骤1: 转换图片为 ideal-image 组件..."
	@python3 convert_images_for_build.py
	@echo "📦 步骤2: 执行构建..."
	@yarn run build
	@echo "♻️  步骤3: 恢复原始文件..."
	@python3 convert_images_for_build.py --revert
	@echo "✨ 构建完成！"

.PHONY: build-simple
build-simple:
	@echo "🏗️  简单构建（不转换图片）..."
	@yarn run build

.PHONY: images-blog
images-blog:
	@echo "🖼️  开始优化图片（blog目录）..."
	@if ! command -v python3 &> /dev/null; then \
		echo "❌ 错误: 未找到 python3，请先安装 Python 3"; \
		exit 1; \
	fi
	@python3 -c "import PIL" 2>/dev/null || (echo "❌ 错误: 未安装 Pillow 库，正在安装..." && pip3 install Pillow)
	@python3 optimize_images.py
	@echo "✨ 图片优化完成！"


