import {BlockItem} from "./BlockItem";
import {BlockMarkableItem} from "./BlockMarkableItem";

export class Emphasis extends BlockMarkableItem {

    constructor(elements: Array<BlockItem>) {
        super(elements);
    }

    toHtml(st: Array<string>): void {
        super.toHtmlSuper("<em>", "</em>", st);
    }

    toMarkdown(st: Array<string>): void {
        super.toMarkdownSuper("*", "*", st);
    }
}
