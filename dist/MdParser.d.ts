import { BaseParser } from './BaseParser';
import { Markable } from './markup/Markable';
export declare class MdParser extends BaseParser {
    private readonly source;
    private curElem;
    private curLine;
    private headerStarts;
    private hLevel;
    isHeaderRequired: boolean;
    isImageRequired: boolean;
    constructor(data: string, isHeaderRequired?: boolean, isImageRequired?: boolean);
    parse(): Array<Markable>;
    private isText;
    private parseItems;
    private parseItem;
    private tokenToString;
    private create;
    private skipEmpties;
    private nextElement;
    next(): string | null;
    private isParagraph;
}
