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
  Token[Token["_EMPHASIS"] = 6] = "_EMPHASIS";
  Token[Token["__STRONG"] = 7] = "__STRONG";
  Token[Token["IMG"] = 8] = "IMG";
})(Token || (Token = {}));

var Image = /*#__PURE__*/function () {
  function Image(name, src) {
    this.name = name;
    this.src = src;
  }

  var _proto = Image.prototype;

  _proto.toHtml = function toHtml(st) {
    st.push('<img alt=\'');
    st.push(this.name);
    st.push('\' src=\'');
    st.push(this.src);
    st.push('\'>');
  };

  _proto.toMarkdown = function toMarkdown(st) {
    throw st;
  };

  return Image;
}();

var TokenReader = /*#__PURE__*/function () {
  function TokenReader(source, isImageRequired) {
    this.source = '';
    this.pos = 0;
    this.curToken = Token.CODE;
    this.curStringToken = '';
    this.tags = ['**', '__', '--', '*', '_', '`'];
    this.imgName = '';
    this.imgSrc = '';
    this.strToToken = new Map([['**', Token.STRONG], ['*', Token.EMPHASIS], ['--', Token.STRIKEOUT], ['`', Token.CODE], ['_', Token._EMPHASIS], ['__', Token.__STRONG], ['![', Token.IMG]]);
    this.curTag = '';

    if (isImageRequired) {
      this.tags.push('![');
    }

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

  _proto.parseImg = function parseImg() {
    var start = this.pos;
    var mid;
    var end;

    while (this.pos < this.source.length && !this.source.startsWith('](', this.pos)) {
      this.pos++;
    }

    if (this.pos < this.source.length && this.source.startsWith('](', this.pos)) {
      mid = this.pos;

      while (this.pos < this.source.length && !this.source.startsWith(')', this.pos)) {
        this.pos++;
      }

      if (this.pos < this.source.length && this.source.startsWith(')', this.pos)) {
        end = this.pos;
        this.imgName = this.source.substring(start, mid);
        this.imgSrc = this.source.substring(mid + 2, end);
        this.pos++;
        return;
      }
    }

    throw 'atata';
  };

  _proto.getImg = function getImg() {
    return new Image(this.imgName, this.imgSrc);
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

      if (this.curToken === Token.IMG) {
        this.parseImg();
      }

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
    st.push('<p>');

    for (var _iterator = _createForOfIteratorHelperLoose(this.elements), _step; !(_step = _iterator()).done;) {
      var elem = _step.value;
      elem.toHtml(st);
    }

    st.push('</p>');
  };

  _proto.toMarkdown = function toMarkdown(st) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(this.elements), _step2; !(_step2 = _iterator2()).done;) {
      var elem = _step2.value;
      elem.toMarkdown(st);
    }
  };

  return Paragraph;
}();

var Header = /*#__PURE__*/function () {
  function Header(elements, hLevel) {
    this.hLevel = hLevel;
    this.elements = _construct(Array, elements);
  }

  var _proto = Header.prototype;

  _proto.toHtml = function toHtml(st) {
    st.push("<h" + this.hLevel + ">");

    for (var _iterator = _createForOfIteratorHelperLoose(this.elements), _step; !(_step = _iterator()).done;) {
      var elem = _step.value;
      elem.toHtml(st);
    }

    st.push("</h" + this.hLevel + ">");
  };

  _proto.toMarkdown = function toMarkdown(st) {
    throw st;
  };

  return Header;
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

  return Text;
}();

var BlockMarkableItem = /*#__PURE__*/function () {
  function BlockMarkableItem(elements) {
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

  _proto.toHtmlSuper = function toHtmlSuper(start, end, st) {
    st.push(start);

    for (var _iterator2 = _createForOfIteratorHelperLoose(this.elements), _step2; !(_step2 = _iterator2()).done;) {
      var elem = _step2.value;
      elem.toHtml(st);
    }

    st.push(end);
  };

  return BlockMarkableItem;
}();

var Strikeout = /*#__PURE__*/function (_BlockMarkableItem) {
  _inheritsLoose(Strikeout, _BlockMarkableItem);

  function Strikeout(elements) {
    return _BlockMarkableItem.call(this, elements) || this;
  }

  var _proto = Strikeout.prototype;

  _proto.toHtml = function toHtml(st) {
    _BlockMarkableItem.prototype.toHtmlSuper.call(this, '<s>', '</s>', st);
  };

  _proto.toMarkdown = function toMarkdown(st) {
    _BlockMarkableItem.prototype.toMarkdownSuper.call(this, '~', '~', st);
  };

  return Strikeout;
}(BlockMarkableItem);

var Strong = /*#__PURE__*/function (_BlockMarkableItem) {
  _inheritsLoose(Strong, _BlockMarkableItem);

  function Strong(elements) {
    return _BlockMarkableItem.call(this, elements) || this;
  }

  var _proto = Strong.prototype;

  _proto.toHtml = function toHtml(st) {
    _BlockMarkableItem.prototype.toHtmlSuper.call(this, '<strong>', '</strong>', st);
  };

  _proto.toMarkdown = function toMarkdown(st) {
    _BlockMarkableItem.prototype.toMarkdownSuper.call(this, '__', '__', st);
  };

  return Strong;
}(BlockMarkableItem);

var Emphasis = /*#__PURE__*/function (_BlockMarkableItem) {
  _inheritsLoose(Emphasis, _BlockMarkableItem);

  function Emphasis(elements) {
    return _BlockMarkableItem.call(this, elements) || this;
  }

  var _proto = Emphasis.prototype;

  _proto.toHtml = function toHtml(st) {
    _BlockMarkableItem.prototype.toHtmlSuper.call(this, '<em>', '</em>', st);
  };

  _proto.toMarkdown = function toMarkdown(st) {
    _BlockMarkableItem.prototype.toMarkdownSuper.call(this, '*', '*', st);
  };

  return Emphasis;
}(BlockMarkableItem);

var Code = /*#__PURE__*/function (_BlockMarkableItem) {
  _inheritsLoose(Code, _BlockMarkableItem);

  function Code(elements) {
    return _BlockMarkableItem.call(this, elements) || this;
  }

  var _proto = Code.prototype;

  _proto.toHtml = function toHtml(st) {
    _BlockMarkableItem.prototype.toHtmlSuper.call(this, '<code>', '</code>', st);
  };

  _proto.toMarkdown = function toMarkdown(st) {
    _BlockMarkableItem.prototype.toMarkdownSuper.call(this, '`', '`', st);
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
    _this.headerStarts = ['###### ', '##### ', '#### ', '### ', '## ', '# '];
    _this.hLevel = 0;
    _this.thrownError = false;
    _this.isHeaderRequired = false;
    _this.isImageRequired = false;
    _this.isImageRequired = !!isImageRequired;
    _this.isHeaderRequired = !!isHeaderRequired;
    _this.source = data.trim().split('\n');
    return _this;
  }

  var _proto = MdParser.prototype;

  _proto.parseToHtml = function parseToHtml() {
    var res = this.parse();

    if (this.thrownError) {
      return this.source.join('\n');
    } else {
      var st = new Array();

      for (var _iterator = _createForOfIteratorHelperLoose(res), _step; !(_step = _iterator()).done;) {
        var value = _step.value;
        value.toHtml(st);
      }

      var result = st.join('');

      if (result === '') {
        return this.source.join('\n');
      }

      return st.join('');
    }
  };

  _proto.parse = function parse() {
    var ans = new Array();

    while (this.nextElement()) {
      if (this.isParagraph()) {
        this.tr = new TokenReader(this.curElem, this.isImageRequired);
        this.nextToken();
        ans.push(new Paragraph(this.parseItems()));
      } else {
        this.tr = new TokenReader(this.curElem.substring(this.hLevel + 1), this.isImageRequired);
        this.nextToken();
        ans.push(new Header(this.parseItems(), this.hLevel));
      }
    }

    return ans;
  };

  _proto.isText = function isText(token) {
    return token === Token.TEXT;
  };

  _proto.parseItems = function parseItems() {
    var ans = new Array();

    while (this.curToken !== Token.END) {
      if (this.isText(this.curToken)) {
        ans.push(new Text(this.curStringToken));
        this.nextToken();
      } else if (this.curToken === Token.IMG) {
        ans.push(this.tr.getImg());
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
      if (this.isText(this.curToken)) {
        ans.push(new Text(this.curStringToken));
        this.nextToken();
      } else if (this.curToken === Token.IMG) {
        ans.push(this.tr.getImg());
        this.nextToken();
      } else {
        var st = this.curToken;
        this.nextToken();
        ans.push.apply(ans, this.parseItem(st));
      }
    }

    if (this.curToken === start) {
      this.nextToken();
      return this.create(ans, start);
    } else if (start === Token.EMPHASIS || start === Token._EMPHASIS) {
      var temp = new Array();
      temp.push(new Text(this.tokenToString(start)));
      temp.push.apply(temp, ans);
      this.nextToken();
      return temp;
    } else {
      this.thrownError = true;
      return [];
    }
  };

  _proto.tokenToString = function tokenToString(token) {
    switch (token) {
      case Token.STRIKEOUT:
        {
          return '--';
        }

      case Token.STRONG:
        {
          return '**';
        }

      case Token.__STRONG:
        {
          return '__';
        }

      case Token.EMPHASIS:
        {
          return '*';
        }

      case Token._EMPHASIS:
        {
          return '_';
        }

      case Token.CODE:
        {
          return '`';
        }

      default:
        {
          this.thrownError = true;
          return "";
        }
    }
  };

  _proto.create = function create(ans, token) {
    switch (token) {
      case Token.STRIKEOUT:
        {
          return [new Strikeout(ans)];
        }

      case Token.STRONG:
        {
          return [new Strong(ans)];
        }

      case Token.__STRONG:
        {
          return [new Strong(ans)];
        }

      case Token.EMPHASIS:
        {
          return [new Emphasis(ans)];
        }

      case Token._EMPHASIS:
        {
          return [new Emphasis(ans)];
        }

      case Token.CODE:
        {
          return [new Code(ans)];
        }

      default:
        {
          this.thrownError = true;
          return [new Code(ans)];
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

  _proto.isParagraph = function isParagraph() {
    if (this.isHeaderRequired) {
      for (var _iterator2 = _createForOfIteratorHelperLoose(this.headerStarts), _step2; !(_step2 = _iterator2()).done;) {
        var headerStart = _step2.value;

        if (this.curElem.startsWith(headerStart)) {
          this.hLevel = headerStart.length - 1;
          return false;
        }
      }
    }

    return true;
  };

  return MdParser;
}(BaseParser);

exports.BlockMarkableItem = BlockMarkableItem;
exports.Code = Code;
exports.Emphasis = Emphasis;
exports.Header = Header;
exports.Image = Image;
exports.MdParser = MdParser;
exports.Paragraph = Paragraph;
exports.Strikeout = Strikeout;
exports.Strong = Strong;
exports.Text = Text;
//# sourceMappingURL=md-parser.cjs.development.js.map
