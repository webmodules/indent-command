
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
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        indent.execute();
        assert.equal('<blockquote><p>hello</p></blockquote><p>world!</p>', div.innerHTML);

        // test that the Selection remains intact
        var sel = window.getSelection();
        range = sel.getRangeAt(0);
        assert(range.startContainer === div.firstChild.firstChild.firstChild);
        assert(range.startOffset === 1);
        assert(range.endContainer === div.firstChild.firstChild.firstChild);
        assert(range.endOffset === 1);
      });

      it('should insert a second BLOCKQUOTE element when executed twice', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p><p>world!</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 2);
        range.setEnd(div.firstChild.firstChild, 2);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        indent.execute();
        assert.equal('<blockquote><p>hello</p></blockquote><p>world!</p>', div.innerHTML);

        indent.execute();
        assert.equal('<blockquote><blockquote><p>hello</p></blockquote></blockquote><p>world!</p>', div.innerHTML);

        // test that the Selection remains intact
        var sel = window.getSelection();
        range = sel.getRangeAt(0);
        assert(range.startContainer === div.firstChild.firstChild.firstChild.firstChild);
        assert(range.startOffset === 2);
        assert(range.endContainer === div.firstChild.firstChild.firstChild.firstChild);
        assert(range.endOffset === 2);
      });

      it('should insert a BLOCKQUOTE element around an H2 block', function () {
        div = document.createElement('div');
        div.innerHTML = '<h2>hello</h2><p>world!</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 3);
        range.setEnd(div.firstChild.firstChild, 3);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        indent.execute();
        assert.equal('<blockquote><h2>hello</h2></blockquote><p>world!</p>', div.innerHTML);

        // test that the Selection remains intact
        var sel = window.getSelection();
        range = sel.getRangeAt(0);
        assert(range.startContainer === div.firstChild.firstChild.firstChild);
        assert(range.startOffset === 3);
        assert(range.endContainer === div.firstChild.firstChild.firstChild);
        assert(range.endOffset === 3);
      });

    });

    describe('queryEnabled()', function () {

      it('should return `true` when the selection is within a `contenteditable`', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p><p>world!</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 1);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        assert(indent.queryEnabled());
      });

      it('should return `false` when there is no selection', function () {
        var sel = window.getSelection();
        sel.removeAllRanges();

        var indent = new IndentCommand();

        assert(!indent.queryEnabled());
      });

    });

  });

});
