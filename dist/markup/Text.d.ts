import { BlockItem } from "./BlockItem";
export declare class Text implements BlockItem {
    private text;
    constructor(text: string);
    toHtml(st: Array<string>): void;
    toMarkdown(st: Array<string>): void;
}
