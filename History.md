
2.1.0 / 2014-09-27
==================

 * index: only create one BLOCKQUOTE element in `execute()`
 * test: add nested multiple P blocks test

2.0.2 / 2014-09-26
==================

 * package: update "debug" to v2.0.0

2.0.1 / 2014-09-26
==================

 * index: add debug() call
 * index: implement multi-block selection logic for execute()
 * index: use `dom-iteratore` for queryState()
 * test: add true `queryState()` tests
 * test: add quick `queryEnabled()` tests

2.0.0 / 2014-09-08
==================

 * remove `native-command.d.ts`
 * index: implement `Command` interface directly
 * index: refactor to use a manual implementation
 * test: enabled Travis-CI + Sauce Labs testing
 * test: add Selection boundary assertions
 * test: add H2 block element test
 * test: use `assert.equal()` to compare strings
 * package: update "current-range" to v1.1.0
 * package: add "zuul" as a dev dependency

1.0.0/ 2014-08-28
==================

 * index: remove the "style" attr on nested BLOCKQUOTE elements
 * initial commit
