import {TokenReader} from "./TokenReader";
import {Token} from "./Token";

export abstract class BaseParser {
    protected tr: TokenReader;
    protected curToken: Token;
    protected curStringToken: string;
    protected nextToken(): void {
        this.curToken = this.tr.nextToken();
        this.curStringToken = this.tr.getStringToken();
    }
    protected constructor() {
        this.tr = new TokenReader("");
        this.curToken = Token.CODE;
        this.curStringToken = "";
    }
}
