export interface Markable {
    toMarkdown(st: Array<string>): void;

    toHtml(st: Array<string>): void;
}
