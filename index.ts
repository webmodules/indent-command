/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import Command = require('command');

/**
 * JavaScript dependencies.
 */

var closest = require('component-closest');
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

    var block: HTMLElement = closest(range.commonAncestorContainer, blockSel, true);
    debug('closest "block" node: %o', block);
    if (!block) return;

    var fr = new FrozenRange(range, block);

    var blockquote: HTMLElement = this.document.createElement('blockquote');

    // add BLOCKQUOTE element to the DOM
    block.parentNode.insertBefore(blockquote, block);

    blockquote.appendChild(block);

    fr.thaw(block, range);

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
