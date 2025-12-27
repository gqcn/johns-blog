.PHONY: up
up:
	git add -A
	git commit -m "doc update"
	git push origin main
	
.PHONY: collect-attachments
collect-attachments:
	@echo "📦 收集 attachments 图片到 static 目录..."
	@python3 collect_attachments.py

.PHONY: collect-attachments-preview
collect-attachments-preview:
	@echo "🔍 预览 attachments 图片收集（不实际复制）..."
	@python3 collect_attachments.py --dry-run
	
.PHONY: build
build:
	@echo "🏗️  开始构建博客..."
	@echo "📦 步骤1: 收集 attachments 图片..."
	@python3 collect_attachments.py || true
	@echo ""
	@echo "🔄 步骤2: 转换图片为 ideal-image 组件..."
	@python3 convert_images_for_build.py
	@echo ""
	@echo "🔨 步骤3: 执行构建..."
	@yarn run build
	@echo ""
	@echo "♻️  步骤4: 恢复原始文件..."
	@python3 convert_images_for_build.py --revert
	@echo ""
	@echo "✨ 构建完成！"

.PHONY: build-simple
build-simple:
	@echo "🏗️  简单构建（不转换图片）..."
	@yarn run build




