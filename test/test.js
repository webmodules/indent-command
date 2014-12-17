
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
        sel = window.getSelection();
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
        sel = window.getSelection();
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
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        assert(range.startContainer === div.firstChild.firstChild.firstChild);
        assert(range.startOffset === 3);
        assert(range.endContainer === div.firstChild.firstChild.firstChild);
        assert(range.endOffset === 3);
      });

      it('should insert a single BLOCKQUOTE element around multiple P blocks', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>wat</p><p>hel<b>lo</b></p><p>world!</p><p>woah</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.childNodes[1].firstChild, 1);
        range.setEnd(div.childNodes[2].firstChild, 4);
        assert(!range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        indent.execute();
        assert.equal('<p>wat</p><blockquote><p>hel<b>lo</b></p><p>world!</p></blockquote><p>woah</p>', div.innerHTML);

        // test that the Selection remains intact
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        assert(range.startContainer === div.childNodes[1].firstChild.firstChild);
        assert(range.startOffset === 1);
        assert(range.endContainer === div.childNodes[1].lastChild.firstChild);
        assert(range.endOffset === 4);
      });

      it('should insert a second BLOCKQUOTE element when executed twice around multiple P blocks', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>wat</p><p>hel<b>lo</b></p><p>world!</p><p>woah</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.childNodes[1].firstChild, 2);
        range.setEnd(div.childNodes[2].firstChild, 3);
        assert(!range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        indent.execute();
        assert.equal('<p>wat</p><blockquote><p>hel<b>lo</b></p><p>world!</p></blockquote><p>woah</p>', div.innerHTML);

        indent.execute();
        assert.equal('<p>wat</p><blockquote><blockquote><p>hel<b>lo</b></p><p>world!</p></blockquote></blockquote><p>woah</p>', div.innerHTML);

        // test that the Selection remains intact
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        assert(range.startContainer === div.childNodes[1].firstChild.firstChild.firstChild);
        assert(range.startOffset === 2);
        assert(range.endContainer === div.childNodes[1].firstChild.lastChild.firstChild);
        assert(range.endOffset === 3);
      });

      it('should insert a BLOCKQUOTE element in between 2 other BLOCKQUOTE elements', function () {
        div = document.createElement('div');
        div.innerHTML = '<div><blockquote><p>one</p></blockquote><p>two</p><blockquote><p>three</p></blockquote></div><div>foo!!!</div>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.childNodes[1].firstChild, 1);
        range.setEnd(div.firstChild.childNodes[1].firstChild, 1);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        indent.execute();

        assert.equal('<div><blockquote><p>one</p></blockquote><blockquote><p>two</p></blockquote><blockquote><p>three</p></blockquote></div><div>foo!!!</div>', div.innerHTML);

        // test that the Selection remains intact
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        assert(range.startContainer === div.firstChild.childNodes[1].firstChild.firstChild);
        assert(range.startOffset === 1);
        assert(range.endContainer === div.firstChild.childNodes[1].firstChild.firstChild);
        assert(range.endOffset === 1);
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

    describe('queryState()', function () {

      it('should return `true` when selection is within a BLOCKQUOTE', function () {
        div = document.createElement('div');
        div.innerHTML = '<blockquote><p>hello</p></blockquote>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild.firstChild, 1);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        assert(indent.queryState());
      });

      it('should return `true` when selection is within multiple BLOCKQUOTEs', function () {
        div = document.createElement('div');
        div.innerHTML = '<blockquote><p>hello</p></blockquote><blockquote><p>world</p></blockquote>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild.firstChild, 1);
        range.setEnd(div.lastChild.firstChild.firstChild, 3);
        assert(!range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var indent = new IndentCommand();

        assert(indent.queryState());
      });

    });

  });

});
