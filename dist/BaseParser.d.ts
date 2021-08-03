import { TokenReader } from "./TokenReader";
import { Token } from "./Token";
export declare abstract class BaseParser {
    protected tr: TokenReader;
    protected curToken: Token;
    protected curStringToken: string;
    protected nextToken(): void;
    protected constructor();
}
