import { Token } from './Token';
import { Image } from './markup/Image';
export declare class TokenReader {
    private readonly source;
    private pos;
    private curToken;
    private curStringToken;
    private tags;
    private imgName;
    private imgSrc;
    private strToToken;
    private curTag;
    constructor(source: string);
    private checkTag;
    private test;
    private parseImg;
    getImg(): Image;
    nextToken(): Token;
    getStringToken(): string;
}
