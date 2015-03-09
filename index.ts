/// <reference path='types.d.ts' />

/**
 * TypeScript dependencies.
 */

import AbstractCommand = require('abstract-command');
import closest = require('component-closest');
import RangeIterator = require('range-iterator');
import query = require('component-query');
import blockElements = require('block-elements');
import contains = require('node-contains');
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

  private root: HTMLElement;

  constructor(root: HTMLElement = document.documentElement, doc: Document = root.ownerDocument) {
    super(doc);
    this.root = root;
    debug('created IndentCommand: document %o', this.document);
  }

  public createElement(): HTMLElement {
    return this.document.createElement('blockquote');
  }

  public wrapNode(node: Node, blockquote: HTMLElement, blocks: HTMLElement[]) {
    var block: HTMLElement = closest(node, blockSel, true, this.root);
    debug('closest "block" node: %o', block);

    if (block == this.root || !contains(this.root, block)) {
      debug('sanity check failed, "block" node is not inside the specified root. skipping');
      return;
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

  protected _execute(range: Range, value?: any): void {

    // array to ensure that we only process a particular block node once
    // (in the instance that it has multiple text node children)
    var blocks: HTMLElement[] = [];

    var common = range.commonAncestorContainer;
    var startContainer = range.startContainer;
    var startOffset = range.startOffset;
    var endContainer = range.endContainer;
    var endOffset = range.endOffset;

    var blockquote: HTMLElement = this.createElement();

    if (range.collapsed) {
      this.wrapNode(range.endContainer, blockquote, blocks);
    } else {
      var next;
      var iterator = RangeIterator(range, (node) => (node.childNodes.length === 0 && contains(this.root, node)));
      while (!(next = iterator.next()).done) {
        this.wrapNode(next.value, blockquote, blocks);
      }
    }

    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  }

  protected _queryState(range: Range): boolean {
    var blockquote: HTMLElement;
    if (range.collapsed) {
      blockquote = closest(range.endContainer, 'blockquote', true, this.root);
      return !!blockquote;
    } else {
      var next;
      var count: number = 0;
      var iterator = RangeIterator(range, (node) => (node.childNodes.length === 0 && contains(this.root, node)));

      while (!(next = iterator.next()).done) {
        count++;
        blockquote = closest(next.value, 'blockquote', true, this.root);
        if (!blockquote) return false;
      }

      return count > 0;
    }
  }
}

export = IndentCommand;
