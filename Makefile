## 依赖Claude Code，自动生成 commit message 并提交到远程仓库
.PHONY: up
up:
	@if git diff --quiet HEAD && git diff --cached --quiet && [ -z "$$(git ls-files --others --exclude-standard)" ]; then \
		echo "没有需要提交的改动"; \
		exit 0; \
	fi
	@git add -A
	@echo "正在通过 AI 分析改动并生成 commit message..."
	@MSG=$$(git diff --cached --stat && echo "---" && git diff --cached | head -2000 | \
		claude -p "分析以上git diff，生成一个简洁的commit message（一行，不超过72字符，小写为主，不要加引号等）。只输出 commit message 本身，不要有其他内容。" \
		--model haiku 2>/dev/null) && \
	COMMIT_MSG=$$(echo "$$MSG" | tail -1) && \
	echo "Commit: $$COMMIT_MSG" && \
	git commit -m "$$COMMIT_MSG" && \
	git push origin
	
.PHONY: build
build:
	yarn run build
