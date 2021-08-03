import { BlockItem } from "./BlockItem";
export declare abstract class BlockMarkableItem implements BlockItem {
    private elements;
    protected constructor(elements: Array<BlockItem>);
    protected toMarkdownSuper(start: string, end: string, st: Array<string>): void;
    protected toHtmlSuper(start: string, end: string, st: Array<string>): void;
    abstract toMarkdown(st: Array<string>): void;
    abstract toHtml(st: Array<string>): void;
}
