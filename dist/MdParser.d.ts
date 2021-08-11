import { BaseParser } from './BaseParser';
import { Markable } from './markup/Markable';
export declare class MdParser extends BaseParser {
    private readonly source;
    private curElem;
    private curLine;
    thrownError: boolean;
    isHeaderRequired: boolean;
    isLinkRequired: boolean;
    constructor(data: string, isHeaderRequired?: boolean, isImageRequired?: boolean);
    replaceHtmlSpecials(data: string): string;
    parseToHtml(): string;
    parse(): Array<Markable>;
    private static isText;
    private parseItems;
    private parseItem;
    private create;
    private skipEmpties;
    private nextElement;
    next(): string | null;
}
