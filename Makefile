install:
	npm ci && npm link

build:
	npx webpack --mode=production --node-env=production

serve:
	node ./bin/server.js

git-add:
	git add . && git status