import { BlockMarkableItem } from './BlockMarkableItem';
import { BlockItem } from './BlockItem';
export declare class Strong extends BlockMarkableItem {
    constructor(elements: Array<BlockItem>, closed: boolean);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
}
