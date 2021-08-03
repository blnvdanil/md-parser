import { BlockItem } from './BlockItem';
export declare class Image implements BlockItem {
    private readonly name;
    private readonly src;
    constructor(name: string, src: string);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
}
