import { BlockMarkableItem } from './BlockMarkableItem';
import { BlockItem } from './BlockItem';
export declare class Strikeout extends BlockMarkableItem {
    constructor(elements: Array<BlockItem>, closed: boolean);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
}
