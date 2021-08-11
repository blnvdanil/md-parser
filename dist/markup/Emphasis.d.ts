import { BlockItem } from './BlockItem';
import { BlockMarkableItem } from './BlockMarkableItem';
export declare class Emphasis extends BlockMarkableItem {
    constructor(elements: Array<BlockItem>, closed: boolean);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
}
