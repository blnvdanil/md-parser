import {BlockItem} from './BlockItem';

export abstract class BlockMarkableItem implements BlockItem {
  private readonly elements: Array<BlockItem>;

  protected closed: boolean = true;

  protected constructor(elements: Array<BlockItem>, closed: boolean) {
    this.closed = !!closed;
    this.elements = new Array<BlockItem>(...elements);
  }


  protected toMarkdownSuper(start: string, end: string, st: Array<string>): void {
    st.push(start);
    for (const elem of this.elements) {
      elem.toMarkdown(st);
    }
    st.push(end);
  }

  protected toHtmlSuper(start: string, end: string, st: Array<string>, startOnly: string): void {
    if (!this.closed) {
      start = startOnly;
      end = '';
    }
    st.push(start);
    for (const elem of this.elements) {
      elem.toHtml(st);
    }
    st.push(end);
  }

  public toText(st: Array<string>): void {
    for (const elem of this.elements) {
      elem.toText(st);
    }
  }

  abstract toMarkdown(st: Array<string>): void;

  abstract toHtml(st: Array<string>): void;
}

