import { Token } from './Token';

export class TokenReader {
  private readonly source: string = '';

  private pos: number = 0;

  private curToken: Token = Token.CODE;

  private curStringToken: string = '';

  private tags: string[] = ['**', '__', '~~', '```'];


  private strToToken = new Map([
    ['**', Token.STRONG],
    ['__', Token.EMPHASIS],
    ['~~', Token.STRIKEOUT],
    ['```', Token.CODE],
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

  public nextToken(): Token {
    if (this.pos >= this.source.length) {
      return Token.END;
    }

    if (this.checkTag()) {
      this.curStringToken = this.curTag;
      const temp = this.strToToken.get(this.curTag);
      this.curToken = temp === undefined ? Token.CODE : temp;
      this.pos += this.curTag.length;
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
      } else if (ch === '\n') {
        sb.push('<br>');
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
