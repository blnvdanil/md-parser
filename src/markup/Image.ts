import {BlockItem} from "./BlockItem";

export class Image implements BlockItem {
    private readonly name: string;
    private readonly src: string;

    constructor(name: string, src: string) {
        this.name = name;
        this.src = src;
    }

    toHtml(st: Array<string>): void {
        st.push('<img alt=\'');
        st.push(this.name);
        st.push('\' src=\'');
        st.push(this.src);
        st.push('\'>');
    }

    toMarkdown(st: Array<string>): void {
        throw st;
    }


}
