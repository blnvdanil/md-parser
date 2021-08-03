import { BlockMarkableItem } from "./BlockMarkableItem";
import { BlockItem } from "./BlockItem";
export declare class Code extends BlockMarkableItem {
    constructor(elements: Array<BlockItem>);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
}
