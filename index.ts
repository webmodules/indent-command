/// <reference path='types.d.ts' />

/**
 * TypeScript dependencies.
 */

import AbstractCommand = require('abstract-command');
import closest = require('component-closest');
import RangeIterator = require('range-iterator');
import query = require('component-query');
import blockElements = require('block-elements');
import DEBUG = require('debug');
import contains = require('node-contains');

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

  private root: HTMLElement;

  constructor(root: HTMLElement = document.documentElement, doc: Document = root.ownerDocument) {
    super(doc);
    this.root = root;
    debug('created IndentCommand: document %o', this.document);
  }

  protected _execute(range: Range, value?: any): void {

    // array to ensure that we only process a particular block node once
    // (in the instance that it has multiple text node children)
    var blocks: HTMLElement[] = [];

    var common = range.commonAncestorContainer;
    var startContainer = range.startContainer;
    var startOffset = range.startOffset;
    var endContainer = range.endContainer;
    var endOffset = range.endOffset;

    var next: Node;
    var iterator = new RangeIterator(range)
      .revisit(false);

    var blockquote: HTMLElement = this.document.createElement('blockquote');

    while (next = iterator.next((node) => (node.childNodes.length == 0 && contains(this.root, node)))) {
      var block: HTMLElement = closest(next, blockSel, true);
      debug('closest "block" node: %o', block);

      if (block == this.root || !contains(this.root, block)) {
        debug('sanity check failed, "block" node is not inside the specified root. skipping');
        continue;
      }

      if (block && -1 === blocks.indexOf(block)) {
        blocks.push(block);

        // add BLOCKQUOTE element to the DOM, only once
        if (!blockquote.parentNode) {
          block.parentNode.insertBefore(blockquote, block);
        }

        blockquote.appendChild(block);
      }
    }

    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
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
