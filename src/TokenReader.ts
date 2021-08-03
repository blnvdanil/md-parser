import {Token} from './Token';
import {Image} from './markup/Image';

export class TokenReader {
  private readonly source: string = '';

  private pos: number = 0;

  private curToken: Token = Token.CODE;

  private curStringToken: string = '';

  private tags: string[] = ['**', '__', '--', '*', '_', '`', '!['];

  private imgName: string = '';

  private imgSrc: string = '';

  private strToToken = new Map([
    ['**', Token.STRONG],
    ['*', Token.EMPHASIS],
    ['--', Token.STRIKEOUT],
    ['`', Token.CODE],
    ['_', Token._EMPHASIS],
    ['__', Token.__STRONG],
    ['![', Token.IMG]
  ]);

  private curTag: string = '';

  constructor(source: string) {
    this.source = source;
    this.pos = 0;
  }

  private checkTag(): boolean {
    for (const tag of this.tags) {
      if (this.source.startsWith(tag, this.pos)) {
        this.curTag = tag;
        return true;
      }
    }
    return false;
  }

  private test(ch: string): boolean {
    return this.pos < this.source.length && ch === this.source[this.pos];
  }

  private parseImg(): void {
    const start: number = this.pos;
    let mid: number;
    let end: number;
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
  }

  public getImg(): Image {
    return new Image(this.imgName, this.imgSrc);
  }

  public nextToken(): Token {
    if (this.pos >= this.source.length) {
      return Token.END;
    }

    if (this.checkTag()) {
      this.curStringToken = this.curTag;
      const temp = this.strToToken.get(this.curTag);
      this.curToken = temp === undefined ? Token.CODE : temp;
      this.pos += this.curTag.length;
      if (this.curToken === Token.IMG) {
        this.parseImg();
      }
      return this.curToken;
    }

    const sb: Array<string> = new Array<string>();

    while (this.pos < this.source.length && !this.checkTag()) {
      const ch: string = this.source.charAt(this.pos++);
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
  }


  public getStringToken(): string {
    return this.curStringToken;
  }
}
