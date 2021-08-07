export interface Markable {
    toMarkdown(st: Array<string>): void;
    toHtml(st: Array<string>): void;
    toText(st: Array<string>): void;
}
