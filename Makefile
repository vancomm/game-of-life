install:
	npm ci

build:
	npx webpack --mode=production --node-env=production

serve:
	npx fastify start server.cjs