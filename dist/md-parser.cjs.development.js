'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var Token;

(function (Token) {
  Token[Token["END"] = 0] = "END";
  Token[Token["EMPHASIS"] = 1] = "EMPHASIS";
  Token[Token["STRONG"] = 2] = "STRONG";
  Token[Token["STRIKEOUT"] = 3] = "STRIKEOUT";
  Token[Token["CODE"] = 4] = "CODE";
  Token[Token["TEXT"] = 5] = "TEXT";
})(Token || (Token = {}));

var TokenReader = /*#__PURE__*/function () {
  function TokenReader(source) {
    this.source = '';
    this.pos = 0;
    this.curToken = Token.CODE;
    this.curStringToken = '';
    this.tags = ['**', '__', '~~', '```'];
    this.strToToken = new Map([['**', Token.STRONG], ['__', Token.EMPHASIS], ['~~', Token.STRIKEOUT], ['```', Token.CODE]]);
    this.curTag = '';
    this.source = source;
    this.pos = 0;
  }

  var _proto = TokenReader.prototype;

  _proto.checkTag = function checkTag() {
    for (var _iterator = _createForOfIteratorHelperLoose(this.tags), _step; !(_step = _iterator()).done;) {
      var tag = _step.value;

      if (this.source.startsWith(tag, this.pos)) {
        this.curTag = tag;
        return true;
      }
    }

    return false;
  };

  _proto.test = function test(ch) {
    return this.pos < this.source.length && ch === this.source[this.pos];
  };

  _proto.nextToken = function nextToken() {
    if (this.pos >= this.source.length) {
      return Token.END;
    }

    if (this.checkTag()) {
      this.curStringToken = this.curTag;
      var temp = this.strToToken.get(this.curTag);
      this.curToken = temp === undefined ? Token.CODE : temp;
      this.pos += this.curTag.length;
      return this.curToken;
    }

    var sb = new Array();

    while (this.pos < this.source.length && !this.checkTag()) {
      var ch = this.source.charAt(this.pos++);

      if (ch === '<') {
        sb.push('&lt;');
      } else if (ch === '>') {
        sb.push('&gt;');
      } else if (ch === '&') {
        sb.push('&amp;');
      } else if (ch === '\\' && this.pos < this.source.length && (this.test('*') || this.test('_'))) {
        sb.push(this.source.charAt(this.pos++));
      } else if (ch === '\n') {
        sb.push('<br>');
      } else {
        sb.push(ch);
      }
    }

    this.curToken = Token.TEXT;
    this.curStringToken = sb.join('');
    return this.curToken;
  };

  _proto.getStringToken = function getStringToken() {
    return this.curStringToken;
  };

  return TokenReader;
}();

var BaseParser = /*#__PURE__*/function () {
  function BaseParser() {
    this.tr = new TokenReader('');
    this.curToken = Token.CODE;
    this.curStringToken = '';
  }

  var _proto = BaseParser.prototype;

  _proto.nextToken = function nextToken() {
    this.curToken = this.tr.nextToken();
    this.curStringToken = this.tr.getStringToken();
  };

  return BaseParser;
}();

var Paragraph = /*#__PURE__*/function () {
  function Paragraph(elements) {
    this.elements = _construct(Array, elements);
  }

  var _proto = Paragraph.prototype;

  _proto.toHtml = function toHtml(st) {
    st.push('');

    for (var _iterator = _createForOfIteratorHelperLoose(this.elements), _step; !(_step = _iterator()).done;) {
      var elem = _step.value;
      elem.toHtml(st);
    }

    st.push('');
  };

  _proto.toMarkdown = function toMarkdown(st) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(this.elements), _step2; !(_step2 = _iterator2()).done;) {
      var elem = _step2.value;
      elem.toMarkdown(st);
    }
  };

  _proto.toText = function toText(st) {
    for (var _iterator3 = _createForOfIteratorHelperLoose(this.elements), _step3; !(_step3 = _iterator3()).done;) {
      var elem = _step3.value;
      elem.toText(st);
    }
  };

  return Paragraph;
}();

var Text = /*#__PURE__*/function () {
  function Text(text) {
    this.text = text;
  }

  var _proto = Text.prototype;

  _proto.toHtml = function toHtml(st) {
    st.push(this.text);
  };

  _proto.toMarkdown = function toMarkdown(st) {
    st.push(this.text);
  };

  _proto.toText = function toText(st) {
    st.push(this.text);
  };

  return Text;
}();

var BlockMarkableItem = /*#__PURE__*/function () {
  function BlockMarkableItem(elements, closed) {
    this.closed = true;
    this.closed = !!closed;
    this.elements = _construct(Array, elements);
  }

  var _proto = BlockMarkableItem.prototype;

  _proto.toMarkdownSuper = function toMarkdownSuper(start, end, st) {
    st.push(start);

    for (var _iterator = _createForOfIteratorHelperLoose(this.elements), _step; !(_step = _iterator()).done;) {
      var elem = _step.value;
      elem.toMarkdown(st);
    }

    st.push(end);
  };

  _proto.toHtmlSuper = function toHtmlSuper(start, end, st, startOnly) {
    if (!this.closed) {
      start = startOnly;
      end = '';
    }

    st.push(start);

    for (var _iterator2 = _createForOfIteratorHelperLoose(this.elements), _step2; !(_step2 = _iterator2()).done;) {
      var elem = _step2.value;
      elem.toHtml(st);
    }

    st.push(end);
  };

  _proto.toText = function toText(st) {
    for (var _iterator3 = _createForOfIteratorHelperLoose(this.elements), _step3; !(_step3 = _iterator3()).done;) {
      var elem = _step3.value;
      elem.toText(st);
    }
  };

  return BlockMarkableItem;
}();

var Strikeout = /*#__PURE__*/function (_BlockMarkableItem) {
  _inheritsLoose(Strikeout, _BlockMarkableItem);

  function Strikeout(elements, closed) {
    return _BlockMarkableItem.call(this, elements, closed) || this;
  }

  var _proto = Strikeout.prototype;

  _proto.toHtml = function toHtml(st) {
    _BlockMarkableItem.prototype.toHtmlSuper.call(this, '<s>', '</s>', st, "~~");
  };

  _proto.toMarkdown = function toMarkdown(st) {
    _BlockMarkableItem.prototype.toMarkdownSuper.call(this, '~~', '~~', st);
  };

  return Strikeout;
}(BlockMarkableItem);

var Strong = /*#__PURE__*/function (_BlockMarkableItem) {
  _inheritsLoose(Strong, _BlockMarkableItem);

  function Strong(elements, closed) {
    return _BlockMarkableItem.call(this, elements, closed) || this;
  }

  var _proto = Strong.prototype;

  _proto.toHtml = function toHtml(st) {
    _BlockMarkableItem.prototype.toHtmlSuper.call(this, '<strong>', '</strong>', st, "**");
  };

  _proto.toMarkdown = function toMarkdown(st) {
    _BlockMarkableItem.prototype.toMarkdownSuper.call(this, '**', '**', st);
  };

  return Strong;
}(BlockMarkableItem);

var Emphasis = /*#__PURE__*/function (_BlockMarkableItem) {
  _inheritsLoose(Emphasis, _BlockMarkableItem);

  function Emphasis(elements, closed) {
    return _BlockMarkableItem.call(this, elements, closed) || this;
  }

  var _proto = Emphasis.prototype;

  _proto.toHtml = function toHtml(st) {
    _BlockMarkableItem.prototype.toHtmlSuper.call(this, '<em>', '</em>', st, '__');
  };

  _proto.toMarkdown = function toMarkdown(st) {
    _BlockMarkableItem.prototype.toMarkdownSuper.call(this, '__', '__', st);
  };

  return Emphasis;
}(BlockMarkableItem);

var Code = /*#__PURE__*/function (_BlockMarkableItem) {
  _inheritsLoose(Code, _BlockMarkableItem);

  function Code(elements, closed) {
    return _BlockMarkableItem.call(this, elements, closed) || this;
  }

  var _proto = Code.prototype;

  _proto.toHtml = function toHtml(st) {
    _BlockMarkableItem.prototype.toHtmlSuper.call(this, '<code>', '</code>', st, '```');
  };

  _proto.toMarkdown = function toMarkdown(st) {
    _BlockMarkableItem.prototype.toMarkdownSuper.call(this, '```', '```', st);
  };

  return Code;
}(BlockMarkableItem);

var MdParser = /*#__PURE__*/function (_BaseParser) {
  _inheritsLoose(MdParser, _BaseParser);

  function MdParser(data, isHeaderRequired, isImageRequired) {
    var _this;

    _this = _BaseParser.call(this) || this;
    _this.curElem = '';
    _this.curLine = '';
    _this.thrownError = false;
    _this.isHeaderRequired = false;
    _this.isLinkRequired = false;
    _this.isLinkRequired = !!isImageRequired;
    _this.isHeaderRequired = !!isHeaderRequired;
    _this.source = [data.trim()];
    console.log("data", [data]);
    return _this;
  }

  var _proto = MdParser.prototype;

  _proto.replaceHtmlSpecials = function replaceHtmlSpecials(data) {
    var sb = [];

    for (var _iterator = _createForOfIteratorHelperLoose(data), _step; !(_step = _iterator()).done;) {
      var ch = _step.value;

      if (ch === '<') {
        sb.push('&lt;');
      } else if (ch === '>') {
        sb.push('&gt;');
      } else if (ch === '&') {
        sb.push('&amp;');
      } else {
        sb.push(ch);
      }
    }

    return sb.join('');
  };

  _proto.parseToHtml = function parseToHtml() {
    var res = this.parse();
    var html = [];

    for (var _iterator2 = _createForOfIteratorHelperLoose(res), _step2; !(_step2 = _iterator2()).done;) {
      var elem = _step2.value;
      elem.toHtml(html);
    }

    return html.join('');
  };

  _proto.parse = function parse() {
    var ans = new Array();

    while (this.nextElement()) {
      this.tr = new TokenReader(this.curElem);
      this.nextToken();
      ans.push(new Paragraph(this.parseItems()));
    }

    console.log("ans:", ans);
    return ans;
  };

  MdParser.isText = function isText(token) {
    return token === Token.TEXT;
  };

  _proto.parseItems = function parseItems() {
    var ans = new Array();

    while (this.curToken !== Token.END) {
      if (MdParser.isText(this.curToken)) {
        ans.push(new Text(this.curStringToken));
        this.nextToken();
      } else {
        var start = this.curToken;
        this.nextToken();
        ans.push.apply(ans, this.parseItem(start));
      }
    }

    return ans;
  };

  _proto.parseItem = function parseItem(start) {
    var ans = new Array();

    while (this.curToken !== Token.END && this.curToken !== start) {
      if (MdParser.isText(this.curToken)) {
        ans.push(new Text(this.curStringToken));
        this.nextToken();
      } else {
        var st = this.curToken;
        this.nextToken();
        ans.push.apply(ans, this.parseItem(st));
      }
    }

    if (this.curToken === start) {
      this.nextToken();
      return this.create(ans, start, true);
    } else {
      this.nextToken();
      return this.create(ans, start, false);
    }
  };

  _proto.create = function create(ans, token, closed) {
    switch (token) {
      case Token.STRIKEOUT:
        {
          return [new Strikeout(ans, closed)];
        }

      case Token.STRONG:
        {
          return [new Strong(ans, closed)];
        }

      case Token.EMPHASIS:
        {
          return [new Emphasis(ans, closed)];
        }

      case Token.CODE:
        {
          return [new Code(ans, closed)];
        }

      default:
        {
          this.thrownError = true;
          return [new Code(ans, closed)];
        }
    }
  };

  _proto.skipEmpties = function skipEmpties() {
    this.curLine = this.next();

    while (this.curLine !== null && this.curLine === '') {
      this.curLine = this.next();
    }
  };

  _proto.nextElement = function nextElement() {
    this.skipEmpties();

    if (this.curLine === null) {
      return false;
    }

    var elem = new Array();
    elem.push(this.curLine);
    this.curLine = this.next();

    while (this.curLine !== null && this.curLine !== '') {
      elem.push('\n');
      elem.push(this.curLine);
      this.curLine = this.next();
    }

    console.log(elem);
    this.curElem = elem.join('');
    return true;
  };

  _proto.next = function next() {
    var exp = this.source.length === 0 ? null : this.source.shift();

    if (exp !== undefined) {
      return exp;
    }

    return null;
  };

  return MdParser;
}(BaseParser);

exports.BlockMarkableItem = BlockMarkableItem;
exports.Code = Code;
exports.Emphasis = Emphasis;
exports.MdParser = MdParser;
exports.Paragraph = Paragraph;
exports.Strikeout = Strikeout;
exports.Strong = Strong;
exports.Text = Text;
//# sourceMappingURL=md-parser.cjs.development.js.map
