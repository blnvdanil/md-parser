import {Markable} from './Markable';
import {BlockItem} from './BlockItem';

export class Paragraph implements Markable {
  private readonly elements: Array<BlockItem>;

  constructor(elements: Array<BlockItem>) {
    this.elements = new Array<BlockItem>(...elements);
  }

  toHtml(st: Array<string>): void {
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

  toText(st: Array<string>) {
    for (const elem of this.elements) {
      elem.toText(st);
    }
  }


}
