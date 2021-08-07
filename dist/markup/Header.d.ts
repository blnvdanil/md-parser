import { Markable } from './Markable';
import { BlockItem } from './BlockItem';
export declare class Header implements Markable {
    private elements;
    private hLevel;
    constructor(elements: Array<BlockItem>, hLevel: number);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
    toText(st: Array<string>): void;
}
