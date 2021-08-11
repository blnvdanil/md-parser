import { BlockItem } from './BlockItem';
export declare abstract class BlockMarkableItem implements BlockItem {
    private readonly elements;
    protected closed: boolean;
    protected constructor(elements: Array<BlockItem>, closed: boolean);
    protected toMarkdownSuper(start: string, end: string, st: Array<string>): void;
    protected toHtmlSuper(start: string, end: string, st: Array<string>, startOnly: string): void;
    toText(st: Array<string>): void;
    abstract toMarkdown(st: Array<string>): void;
    abstract toHtml(st: Array<string>): void;
}
