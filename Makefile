.PHONY: up
up:
	git add -A
	git commit -m "doc update"
	git push origin main
	
.PHONY: build
build:
	yarn run build

.PHONY: optimize-images
optimize-images:
	@echo "🖼️  开始优化图片（blog + docs 目录）..."
	@if ! command -v python3 &> /dev/null; then \
		echo "❌ 错误: 未找到 python3，请先安装 Python 3"; \
		exit 1; \
	fi
	@python3 -c "import PIL" 2>/dev/null || (echo "❌ 错误: 未安装 Pillow 库，正在安装..." && pip3 install Pillow)
	@python3 optimize_images.py
	@echo "✨ 图片优化完成！"


