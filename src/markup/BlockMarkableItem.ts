import {BlockItem} from './BlockItem';

export abstract class BlockMarkableItem implements BlockItem {
  private elements: Array<BlockItem>;

  protected constructor(elements: Array<BlockItem>) {
    this.elements = new Array<BlockItem>(...elements);
  }

  protected toMarkdownSuper(start: string, end: string, st: Array<string>): void {
    st.push(start);
    for (const elem of this.elements) {
      elem.toMarkdown(st);
    }
    st.push(end);
  }

  protected toHtmlSuper(start: string, end: string, st: Array<string>): void {
    st.push(start);
    for (const elem of this.elements) {
      elem.toHtml(st);
    }
    st.push(end);
  }

  abstract toMarkdown(st: Array<string>): void;

  abstract toHtml(st: Array<string>): void;
}
