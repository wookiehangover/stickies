relase:
	@grunt build:web
	@cp -r dist/* .

.PHONY: relase
