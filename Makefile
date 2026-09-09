.PHONY: test lint

# Thin wrappers to existing npm scripts to satisfy Harness schema
# and avoid breaking current infrastructure.

test:
	@npm run test

lint:
	@npm run lint
