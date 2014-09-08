
var assert = require('assert');
var IndentCommand = require('../');

describe('IndentCommand', function () {
  var div;

  afterEach(function () {
    if (div) {
      // clean up...
      document.body.removeChild(div);
      div = null;
    }
  });

  describe('new IndentCommand()', function () {

    it('should create a `IndentCommand` instance', function () {
      var indent = new IndentCommand();

      assert(indent instanceof IndentCommand);
      assert(indent.document === document);
    });

    describe('execute()', function () {

      it('should insert a BLOCKQUOTE element around parent block', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p><p>world!</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 1);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        indent.execute();
        assert.equal('<blockquote><p>hello</p></blockquote><p>world!</p>', div.innerHTML);
      });

      it('should insert a second BLOCKQUOTE element when executed twice', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p><p>world!</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 1);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        indent.execute();
        assert.equal('<blockquote><p>hello</p></blockquote><p>world!</p>', div.innerHTML);

        indent.execute();
        assert.equal('<blockquote><blockquote><p>hello</p></blockquote></blockquote><p>world!</p>', div.innerHTML);
      });

    });

  });

});
