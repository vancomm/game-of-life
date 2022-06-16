install:
	npm ci

build: install
	npx webpack --mode=production --node-env=production

serve: build
	npx fastify start server.cjs