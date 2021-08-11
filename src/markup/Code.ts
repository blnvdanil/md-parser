import {BlockMarkableItem} from './BlockMarkableItem';
import {BlockItem} from './BlockItem';

export class Code extends BlockMarkableItem {

  constructor(elements: Array<BlockItem>, closed: boolean) {
    super(elements, closed);
  }

  toHtml(st: Array<string>): void {
    const arr: Array<string> = [];
    super.toHtmlSuper('', '', arr, '```');
    let res = arr.join('');
    if (this.closed) {
      if (res.startsWith('<br>')) {
        res = res.slice(4);
      }
      if (res.endsWith('<br>')) {
        res = res.slice(0, res.length - 4);
      }
    }
    st.push('<pre>' + res + '</pre>')
  }

  toMarkdown(st: Array<string>): void {
    super.toMarkdownSuper('```', '```', st);
  }
}
