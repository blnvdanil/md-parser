import {BlockMarkableItem} from './BlockMarkableItem';
import {BlockItem} from './BlockItem';

export class Code extends BlockMarkableItem {

  constructor(elements: Array<BlockItem>, closed: boolean) {
    super(elements, closed);
  }

  toHtml(st: Array<string>): void {
    super.toHtmlSuper('<code>', '</code>', st, '```');
  }

  toMarkdown(st: Array<string>): void {
    super.toMarkdownSuper('```', '```', st);
  }
}
