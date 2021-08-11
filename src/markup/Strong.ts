import {BlockMarkableItem} from './BlockMarkableItem';
import {BlockItem} from './BlockItem';

export class Strong extends BlockMarkableItem {
  constructor(elements: Array<BlockItem>, closed: boolean) {
    super(elements, closed);
  }

  toHtml(st: Array<string>): void {
    super.toHtmlSuper('<strong>', '</strong>', st, "**");
  }

  toMarkdown(st: Array<string>): void {
    super.toMarkdownSuper('**', '**', st);
  }
}
