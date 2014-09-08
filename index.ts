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
      var next: Node = range.commonAncestorContainer;
      while (next) {
        var blockquote: HTMLElement = closest(next, 'blockquote', true);
        if (blockquote) {
          if (blockquote.hasAttribute('dir')) {
            // IE adds a "dir=ltr" attribute (probably "rtl" on browsers with
            // appropriate language settings). Not really necessary and
            // inconsistent with other browsers so remove it.
            debug('removing "dir" attribute from BLOCKQUOTE: %o', blockquote);
            blockquote.removeAttribute('dir');
          }

          if (blockquote.hasAttribute('style')) {
            // On Chrome, at least, the BLOCKQUOTE gets created with `margin`,
            // `border` and `padding` inline style attributes. Remove them.
            // TODO: more extensive logic to only remove the specific styles,
            // and then remove the "style" attribute IFF there's no more.
            debug('removing "style" attribute from BLOCKQUOTE: %o', blockquote);
            blockquote.removeAttribute('style');
          }

          if (blockquote.hasAttribute('class')) {
            // on Safari 5, a "webkit-indent-blockquote" class gets added to
            // the generated BLOCKQUOTE element. Remove it.
            // TODO: more extensive logic to only remove the specific class,
            // and then remove the "class" attribute IFF there's no more.
            debug('removing "class" attribute from BLOCKQUOTE: %o', blockquote);
            blockquote.removeAttribute('class');
          }
          next = blockquote.parentNode;
        } else {
          next = null;
        }
      }
    }
  }

  queryState(range?: Range): boolean {
    if (!range) range = currentRange(this.document);
    if (!range) return false;
    var blockquote: HTMLElement = closest(range.commonAncestorContainer, 'blockquote', true);
    return !! blockquote;
  }
}

export = IndentCommand;
