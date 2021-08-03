import {Markable} from "./Markable";
import {BlockItem} from "./BlockItem";

export class Header implements Markable {

    private elements: Array<BlockItem>;
    private hLevel: number;

    constructor(elements: Array<BlockItem>, hLevel: number) {
        this.hLevel = hLevel;
        this.elements = new Array<BlockItem>(...elements);
    }

    toHtml(st: Array<string>): void {
        st.push(`<h${this.hLevel}>`);
        for (const elem of this.elements) {
            elem.toHtml(st);
        }
        st.push(`</h${this.hLevel}>`);
    }

    toMarkdown(st: Array<string>): void {
        throw st;
    }

}
