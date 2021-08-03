import {BlockItem} from "./BlockItem";

export class Text implements BlockItem {
    private text: string;
    constructor(text: string) {
        this.text = text;
    }

    toHtml(st: Array<string>): void {
        st.push(this.text);
    }

    toMarkdown(st: Array<string>): void {
        st.push(this.text);
    }


}
