import {BlockMarkableItem} from './BlockMarkableItem';
import {BlockItem} from './BlockItem';

export class Code extends BlockMarkableItem {

    constructor(elements: Array<BlockItem>) {
        super(elements);
    }

    toHtml(st: Array<string>): void {
        super.toHtmlSuper('`', '`', st);
    }

    toMarkdown(st: Array<string>): void {
        super.toMarkdownSuper('<code>', '</code>', st);
    }
}
