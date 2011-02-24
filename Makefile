EXPRESSO = support/expresso/bin/expresso -I lib

TESTS = tests/*.test.js

test:
	@$(EXPRESSO) $(TESTS) $(TEST_FLAGS)

test-cov:
	@$(MAKE) TEST_FLAGS=--cov test

.PHONY: test test-cov
