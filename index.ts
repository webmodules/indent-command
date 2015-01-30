/// <reference path='types.d.ts' />

/**
 * TypeScript dependencies.
 */

import AbstractCommand = require('abstract-command');
import closest = require('component-closest');
import DomIterator = require('dom-iterator');
import RangeIterator = require('range-iterator');
import query = require('component-query');
import contains = require('node-contains');
import blockElements = require('block-elements');
import FrozenRange = require('frozen-range');
import DEBUG = require('debug');

var debug = DEBUG('indent-command');
var blockSel = blockElements.join(', ');

/**
 * `IndentCommand` class wraps a BLOCKQUOTE element around the given `Range`.
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

class IndentCommand extends AbstractCommand {

  constructor(doc: Document = document) {
    super(doc);
    debug('created IndentCommand: document %o', this.document);
  }

  protected _execute(range: Range, value?: any): void {

    // array to ensure that we only process a particular block node once
    // (in the instance that it has multiple text node children)
    var blocks: HTMLElement[] = [];

    var common = range.commonAncestorContainer;
    var fr = new FrozenRange(range, common);

    var next = range.startContainer;
    var end = range.endContainer;
    var iterator = new DomIterator(next).revisit(false);

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

    var b = common.nodeType !== 3 /* Node.TEXT_NODE */ && query('blockquote', <HTMLElement>common);
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
  }

  protected _queryState(range: Range): boolean {
    var next: Node;
    var count: number = 0;
    var iterator = new RangeIterator(range)
      .revisit(false);

    while (next = iterator.next()) {
      count++;
      var blockquote: HTMLElement = closest(next, 'blockquote', true);
      if (!blockquote) return false;
    }

    return count > 0;
  }
}

export = IndentCommand;
