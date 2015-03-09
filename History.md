
3.0.2 / 2015-03-09
==================

  * fix failing test case
  * update to "range-iterator" v2.0.0 API
  * package: allow any "zuul" v2
  * test: add a failing test case
  * test: make HTML string more readable
  * types: remove "frozen-range" type def

3.0.1 / 2015-02-23
==================

  * refactor to handle `collapsed` Ranges explicitly

3.0.0 / 2015-02-19
==================

  * store and restore range
  * add type declaration for node-contains
  * add filter and sanity check to constrain command to root element
  * remove "frozen-range" usage
  * remove unused "dom-iterator" and "node-contains" modules
  * fix iteration
  * use "range-iterator" for `_execute()`
  * use "range-iterator" for `_queryState()`
  * types: even more accurate "dom-iterator" type definition
  * index: update jsdoc description
  * package: update "typescript" to v1.4.1
  * package: allow any "zuul" v1
  * package.json: add "node-contains" dep
  * types: more correct "dom-iterator" definition
  * test: add another test case
  * test: add another `queryState()` test case
  * refactor to extend `AbstractCommand` base class

2.1.1 / 2014-10-29
==================

  * index: use "node-contains"
  * index: add missing require() calls
  * index: add support for backwards Selections
  * index: use better TypeScript array syntax
  * package: allow any debug v2
  * test: fix global `sel` variable leak
  * test: remove redundant `var sel` variables

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
