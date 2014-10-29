/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import Command = require('command');

/**
 * JavaScript dependencies.
 */

var setRange = require('selection-set-range');
var isBackward = require('selection-is-backward');
var closest = require('component-closest');
var query = require('component-query');
var contains = require('node-contains');
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
    var backward: boolean;
    var selection: Selection;

    if (!hasRange) {
      selection = currentSelection(this.document);
      backward = isBackward(selection);
      range = currentRange(selection);
    }

    // array to ensure that we only process a particular block node once
    // (in the instance that it has multiple text node children)
    var blocks: HTMLElement[] = [];

    var common = range.commonAncestorContainer;
    var fr = new FrozenRange(range, common);

    var next = range.startContainer;
    var end = range.endContainer;
    var iterator = domIterator(next).revisit(false);

    var blockquote: HTMLElement = this.document.createElement('blockquote');

    while (next) {
      var block: HTMLElement = closest(next, blockSel, true);
      debug('closest "block" node: %o', block);

      if (block && -1 === blocks.indexOf(block)) {
        blocks.push(block);

        // add BLOCKQUOTE element to the DOM, only once
        if (!blockquote.parentNode) {
          block.parentNode.insertBefore(blockquote, block);
        }

        blockquote.appendChild(block);
      }

      if (contains(end, next)) break;
      next = iterator.next(3 /* Node.TEXT_NODE */);
    }

    var b = common.nodeType !== 3 /* Node.TEXT_NODE */ && query('blockquote', common);
    if (b) {
      // XXX: since we know that the selection must be within a <blockquote> now,
      // an easy was to handle it is to "rebase" the frozen range onto the
      // BLOCKQUOTE element. The tricky part is that we need to adjust the
      // startPath and endPath first entries to be relative to the BLOCKQUOTE
      // instead of the original parent.
      var min = Math.min(fr.startPath[0], fr.endPath[0]);
      debug('subtracting %o from startPath[0] and endPath[0]', min);
      fr.startPath[0] -= min;
      fr.endPath[0] -= min;
      common = blockquote;
    }

    fr.thaw(common, range);

    if (!hasRange) {
      // when no Range was passed in then we must reset the document's Selection
      setRange(selection, range, backward);
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
      if (contains(end, next)) break;
      next = iterator.next(3 /* Node.TEXT_NODE */);
    }

    return true;
  }
}

export = IndentCommand;
