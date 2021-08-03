import {BaseParser} from './BaseParser';
import {Markable} from './markup/Markable';
import {TokenReader} from './TokenReader';
import {Paragraph} from './markup/Paragraph';
import {Header} from './markup/Header';
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
  private headerStarts = ['###### ', '##### ', '#### ', '### ', '## ', '# '];

  private hLevel: number = 0;

  constructor(data: string) {
    super();
    this.source = data.split('\n');
    console.log(this.source);
  }


  public parse(): Array<Markable> {
    const ans = new Array<Markable>();
    while (this.nextElement()) {
      if (this.isParagraph()) {
        this.tr = new TokenReader(this.curElem);
        this.nextToken();
        ans.push(new Paragraph(this.parseItems()));
      } else {
        this.tr = new TokenReader(this.curElem.substring(this.hLevel + 1));
        this.nextToken();
        ans.push(new Header(this.parseItems(), this.hLevel));
      }
    }
    return ans;
  }

  private isText(token: Token) {
    return token === Token.TEXT;
  }

  private parseItems(): Array<BlockItem> {
    const ans = new Array<BlockItem>();
    while (this.curToken !== Token.END) {
      if (this.isText(this.curToken)) {
        ans.push(new Text(this.curStringToken));
        this.nextToken();
      } else if (this.curToken === Token.IMG) {
        ans.push(this.tr.getImg());
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
      if (this.isText(this.curToken)) {
        ans.push(new Text(this.curStringToken));
        this.nextToken();
      } else if (this.curToken === Token.IMG) {
        ans.push(this.tr.getImg());
        this.nextToken();
      } else {
        const st: Token = this.curToken;
        this.nextToken();
        ans.push(...this.parseItem(st));
      }
    }
    if (this.curToken === start) {
      this.nextToken();
      return this.create(ans, start);
    } else if (start === Token.EMPHASIS || start === Token._EMPHASIS) {
      const temp = new Array<BlockItem>();
      temp.push(new Text(this.tokenToString(start)));
      temp.push(...ans);
      this.nextToken();
      return temp;
    } else {
      throw 'Unclosed tag! expected ' + start + 'found ' + this.curToken;
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
      case Token.__STRONG: {
        return '__';
      }
      case Token.EMPHASIS: {
        return '*';
      }
      case Token._EMPHASIS: {
        return '_';
      }
      case Token.CODE: {
        return '`';
      }
      default: {
        throw 'atata';
      }
    }
  }

  private create(ans: Array<BlockItem>, token: Token): Array<BlockItem> {
    switch (token) {
      case Token.STRIKEOUT: {
        return [new Strikeout(ans)];
      }
      case Token.STRONG: {
        return [new Strong(ans)];
      }
      case Token.__STRONG: {
        return [new Strong(ans)];
      }
      case Token.EMPHASIS: {
        return [new Emphasis(ans)];
      }
      case Token._EMPHASIS: {
        return [new Emphasis(ans)];
      }
      case Token.CODE: {
        return [new Code(ans)];
      }
      default: {
        throw 'atata';
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
    this.curElem = elem.join('');
    return true;
  }

  next(): string | null {
    const exp = this.source.length === 0 ? null : this.source.shift();
    if (exp !== undefined) {
      return exp
    }
    return null;
  }

  private isParagraph(): boolean {
    for (const headerStart of this.headerStarts) {
      if (this.curElem.startsWith(headerStart)) {
        this.hLevel = headerStart.length - 1;
        return false;
      }
    }
    return true;
  }


}
