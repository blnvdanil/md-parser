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
      if (res.length > 0 && res[0] === '\n') {
        res = res.slice(1);
      }
      if (res.length > 0 && res[res.length - 1] === '\n') {
        res = res.slice(0, res.length - 1);
      }
    }
    st.push('<pre>' + res + '</pre>')
  }

  toMarkdown(st: Array<string>): void {
    super.toMarkdownSuper('```', '```', st);
  }
}
