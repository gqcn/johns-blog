.PHONY: up
up:
	git add -A
	git commit -m "doc update"
	git push origin main
	
.PHONY: build
build:
	yarn run build

