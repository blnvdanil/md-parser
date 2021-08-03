import { BlockItem } from './BlockItem';
import { BlockMarkableItem } from './BlockMarkableItem';
export declare class Emphasis extends BlockMarkableItem {
    constructor(elements: Array<BlockItem>);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
}
