import { Markable } from './Markable';
import { BlockItem } from './BlockItem';
export declare class Paragraph implements Markable {
    private readonly elements;
    constructor(elements: Array<BlockItem>);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
    toText(st: Array<string>): void;
}
