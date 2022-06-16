install:
	npm ci

build:
	npx webpack --mode=production --node-env=production

serve:
	node server.cjs