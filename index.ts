/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import NativeCommand = require('native-command');

/**
 * JavaScript dependencies.
 */

var closest = require('component-closest');
var currentRange = require('current-range');
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

class IndentCommand extends NativeCommand {

  constructor(doc?: Document) {
    super('indent', doc);
    debug('created IndentCommand: document %o', this.document);
  }

  execute(range?: Range, value?: any): void {
    super.execute(range);
    if (!range) range = currentRange(this.document);
    if (range) {
      var blockquote = closest(range.commonAncestorContainer, 'blockquote', true);
      if (blockquote) {
        // On Chrome, at least, the BLOCKQUOTE gets created with `margin`,
        // `border` and `padding` inline style attributes. We must remove them.
        blockquote.removeAttribute('style');
      }
    }
  }

  queryState(range?: Range): boolean {
    if (!range) range = currentRange(this.document);
    if (!range) return false;
    var blockquote = closest(range.commonAncestorContainer, 'blockquote', true);
    return !! blockquote;
  }
}

export = IndentCommand;
