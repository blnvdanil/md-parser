import {BlockItem} from './BlockItem';
import {BlockMarkableItem} from './BlockMarkableItem';

export class Emphasis extends BlockMarkableItem {

  constructor(elements: Array<BlockItem>, closed: boolean) {
    super(elements, closed);
  }

  toHtml(st: Array<string>): void {
    super.toHtmlSuper('<em>', '</em>', st, '__');
  }

  toMarkdown(st: Array<string>): void {
    super.toMarkdownSuper('__', '__', st);
  }
}
