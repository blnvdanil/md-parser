import { Token } from './Token';
export declare class TokenReader {
    private readonly source;
    private pos;
    private curToken;
    private curStringToken;
    private tags;
    private strToToken;
    private curTag;
    constructor(source: string);
    private checkTag;
    private test;
    nextToken(): Token;
    getStringToken(): string;
}
