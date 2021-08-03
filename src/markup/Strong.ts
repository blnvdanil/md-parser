import {BlockMarkableItem} from './BlockMarkableItem';
import {BlockItem} from './BlockItem';

export class Strong extends BlockMarkableItem {
  constructor(elements: Array<BlockItem>) {
    super(elements);
  }

  toHtml(st: Array<string>): void {
    super.toHtmlSuper('<strong>', '</strong>', st);
  }

  toMarkdown(st: Array<string>): void {
    super.toMarkdownSuper('__', '__', st);
  }
}
