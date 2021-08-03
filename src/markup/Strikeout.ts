import {BlockMarkableItem} from "./BlockMarkableItem";
import {BlockItem} from "./BlockItem";

export class Strikeout extends BlockMarkableItem {
    constructor(elements: Array<BlockItem>) {
        super(elements);
    }

    toHtml(st: Array<string>): void {
        super.toHtmlSuper('<s>', '</s>', st);
    }

    toMarkdown(st: Array<string>): void {
        super.toMarkdownSuper('~', '~', st);
    }
}
