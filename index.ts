/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import Command = require('command');

/**
 * JavaScript dependencies.
 */

var closest = require('component-closest');
var query = require('component-query');
var currentRange = require('current-range');
var currentSelection = require('current-selection');
var blockSel = require('block-elements').join(', ');
var domIterator = require('dom-iterator');
var FrozenRange = require('frozen-range');
var debug = require('debug')('indent-command');

/**
 * `IndentCommand` class is a wrapper around the `indent` native command.
 * It applies cross-browser normalization logic, for example, removing any
 * inline "style" attributes from the created BLOCKQUOTE element.
 *
 * ``` js
 * var indent = new IndentCommand();
 * if (indent.queryEnabled()) {
 *   indent.execute();
 * }
 * ```
 *
 * @public
 */

class IndentCommand implements Command {
  public document: Document;

  constructor(doc: Document = document) {
    this.document = doc;
    debug('created IndentCommand: document %o', this.document);
  }

  execute(range?: Range, value?: any): void {
    var hasRange: boolean = !!(range && range instanceof Range);
    var selection: Selection;

    if (!hasRange) {
      selection = currentSelection(this.document);
      range = currentRange(selection);
    }

    // array to ensure that we only process a particular block node once
    // (in the instance that it has multiple text node children)
    var blocks: Array<HTMLElement> = [];

    var common = range.commonAncestorContainer;
    var fr = new FrozenRange(range, common);

    var next = range.startContainer;
    var end = range.endContainer;
    var iterator = domIterator(next).revisit(false);

    while (next) {
      var block: HTMLElement = closest(next, blockSel, true);
      debug('closest "block" node: %o', block);

      if (block && -1 === blocks.indexOf(block)) {
        blocks.push(block);

        var blockquote: HTMLElement = this.document.createElement('blockquote');

        // add BLOCKQUOTE element to the DOM
        block.parentNode.insertBefore(blockquote, block);

        blockquote.appendChild(block);
      }

      // TODO: move to `node-contains` polyfill module:
      // See: http://compatibility.shwups-cms.ch/en/polyfills/?&id=1
      if (next === end || !!(end.compareDocumentPosition(next) & 16)) break;
      //if (end.contains(next)) break;
      next = iterator.next(3 /* Node.TEXT_NODE */);
    }

    var b = common.nodeType !== 3 && query('blockquote', common);
    if (b) {
      // XXX: basically since we know that the selection must be within a
      // <blockquote> now, so the selection is one layer deeper now. We insert
      // a new `0` entry at index `1` of both start and end path arrays. The
      // only thing that seems fragile here is the hard-coded `1` index, which
      // could be problematic.
      fr.startPath.splice(1, 0, 0);
      fr.endPath.splice(1, 0, 0);
    }

    fr.thaw(common, range);

    if (!hasRange) {
      // when no Range was passed in then we must reset the document's Selection
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  queryEnabled(range?: Range): boolean {
    if (!range) range = currentRange(this.document);
    return !! range;
  }

  queryState(range?: Range): boolean {
    if (!range) range = currentRange(this.document);
    if (!range) return false;

    var next = range.startContainer;
    var end = range.endContainer;
    var iterator = domIterator(next).revisit(false);

    while (next) {
      var blockquote: HTMLElement = closest(next, 'blockquote', true);
      if (!blockquote) {
        return false;
      }
      // TODO: move to `node-contains` polyfill module:
      // See: http://compatibility.shwups-cms.ch/en/polyfills/?&id=1
      if (next === end || !!(end.compareDocumentPosition(next) & 16)) break;
      //if (end.contains(next)) break;
      next = iterator.next(3 /* Node.TEXT_NODE */);
    }

    return true;
  }
}

export = IndentCommand;
