import {BaseParser} from './BaseParser';
import {Markable} from './markup/Markable';
import {TokenReader} from './TokenReader';
import {Paragraph} from './markup/Paragraph';
import {Token} from './Token';
import {BlockItem} from './markup/BlockItem';
import {Text} from './markup/Text';
import {Strikeout} from './markup/Strikeout';
import {Strong} from './markup/Strong';
import {Emphasis} from './markup/Emphasis';
import {Code} from './markup/Code';


export class MdParser extends BaseParser {
  private readonly source: Array<string>;
  private curElem: string = '';
  private curLine: string | null = '';

  private sourceStr: string;

  thrownError: boolean = false;

  isHeaderRequired: boolean = false;
  isLinkRequired: boolean = false;

  constructor(data: string, isHeaderRequired?: boolean, isImageRequired?: boolean) {
    super();
    this.sourceStr = this.replaceHtmlSpecials(data.trim());
    this.isLinkRequired = !!isImageRequired;
    this.isHeaderRequired = !!isHeaderRequired;
    this.source = [data.trim()];
    console.log("data", [data])
  }

  replaceHtmlSpecials(data: string): string {
    const sb: Array<string> = [];
    for (const ch of data) {
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
  }

  public parseToHtml(): string {
    const res = this.parse();
    const html: Array<string> = [];
    for (const elem of res) {
      elem.toHtml(html);
    }
    return html.join('');
  }

  public parse(): Array<Markable> {
    const ans = new Array<Markable>();
    while (this.nextElement()) {
      this.tr = new TokenReader(this.curElem);
      this.nextToken();
      ans.push(new Paragraph(this.parseItems()));
    }
    console.log("ans:", ans)
    return ans;
  }

  private static isText(token: Token) {
    return token === Token.TEXT;
  }

  private parseItems(): Array<BlockItem> {
    const ans = new Array<BlockItem>();
    while (this.curToken !== Token.END) {
      if (MdParser.isText(this.curToken)) {
        ans.push(new Text(this.curStringToken));
        this.nextToken();
      } else {
        const start: Token = this.curToken;
        this.nextToken();
        ans.push(...this.parseItem(start));
      }
    }
    return ans;
  }

  private parseItem(start: Token): Array<BlockItem> {
    const ans = new Array<BlockItem>();
    while (this.curToken !== Token.END && this.curToken !== start) {
      if (MdParser.isText(this.curToken)) {
        ans.push(new Text(this.curStringToken));
        this.nextToken();
      } else {
        const st: Token = this.curToken;
        this.nextToken();
        ans.push(...this.parseItem(st));
      }
    }
    if (this.curToken === start) {
      this.nextToken();
      return this.create(ans, start, true);
    } else {
      this.nextToken();
      return this.create(ans, start, false);
    }
  }

  private tokenToString(token: Token): string {
    switch (token) {
      case Token.STRIKEOUT: {
        return '--';
      }
      case Token.STRONG: {
        return '**';
      }
      case Token.EMPHASIS: {
        return '*';
      }
      case Token.CODE: {
        return '`';
      }
      default: {
        this.thrownError = true;
        return "";
      }
    }
  }

  private create(ans: Array<BlockItem>, token: Token, closed: boolean): Array<BlockItem> {
    switch (token) {
      case Token.STRIKEOUT: {
        return [new Strikeout(ans, closed)];
      }
      case Token.STRONG: {
        return [new Strong(ans, closed)];
      }
      case Token.EMPHASIS: {
        return [new Emphasis(ans, closed)];
      }
      case Token.CODE: {
        return [new Code(ans, closed)];
      }
      default: {
        this.thrownError = true;
        return [new Code(ans, closed)];
      }
    }
  }

  private skipEmpties(): void {
    this.curLine = this.next();
    while (this.curLine !== null && this.curLine === '') {
      this.curLine = this.next();
    }
  }

  private nextElement(): boolean {
    this.skipEmpties();
    if (this.curLine === null) {
      return false;
    }
    const elem = new Array<string>();
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
  }

  next(): string | null {
    const exp = this.source.length === 0 ? null : this.source.shift();
    if (exp !== undefined) {
      return exp;
    }
    return null;
  }
}
