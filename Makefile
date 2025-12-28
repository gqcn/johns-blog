.PHONY: up
up:
	git add -A
	git commit -m "doc update"
	git push origin main
	
.PHONY: build
build:
	@echo "🏗️  开始构建博客..."
	@echo "📦 步骤1: 收集 attachments 图片..."
	@python3 .scripts/collect_attachments.py || true
	@echo ""
	@echo "🔄 步骤2: 转换图片为 ideal-image 组件..."
	@python3 .scripts/convert_images_for_build.py
	@echo ""
	@echo "🔨 步骤3: 执行构建..."
	@yarn run build
	@echo ""
	@echo "♻️  步骤4: 恢复原始文件..."
	@python3 .scripts/convert_images_for_build.py --revert
	@echo ""
	@echo "🧹 步骤5: 清理未使用的图片..."
	@python3 .scripts/clean_unused_images.py
	@echo ""
	@echo "✨ 构建完成！"

.PHONY: build-simple
build-simple:
	@echo "🏗️  简单构建（不转换图片）..."
	@yarn run build




