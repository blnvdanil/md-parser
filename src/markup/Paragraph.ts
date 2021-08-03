import {Markable} from './Markable';
import {BlockItem} from './BlockItem';

export class Paragraph implements Markable {
    private readonly elements: Array<BlockItem>;

    constructor(elements: Array<BlockItem>) {
        this.elements = new Array<BlockItem>(...elements);
    }

    toHtml(st: Array<string>): void {
        console.log('p: ', this.elements);
        st.push('<p>');
        for (const elem of this.elements) {
            elem.toHtml(st);
        }
        st.push('</p>');
    }

    toMarkdown(st: Array<string>): void {
        for (const elem of this.elements) {
            elem.toMarkdown(st);
        }
    }


}
