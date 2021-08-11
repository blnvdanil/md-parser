// import {MdParser} from "./MdParser";
//
//
// const p = new MdParser("https://github.com/microsoft/TypeScript/issues/9545", false, true);
//
// console.log(p.parseToHtml());
//


import {MdParser} from "./MdParser";

// let value = "vot sylka http://google.com vot eshe sylka ya.comm"
//
// const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi;
//
// let match;
//
// let res = "";
//
// let start = 0;
//
// let end = 0;
//
//
// while (match = regex.exec(value)) {
//     end = match.index;
//     res += "!" + value.substring(start, end) + "!";
//     const url = match[0];
//     res += `<a href="${url.startsWith('https://') ? url : 'https://' + url}"> ${url} </a>`;
//     start = regex.lastIndex;
// }
//
// console.log(res)

let testCount = 0;

function test(data: string, answer: string) {
    testCount++;
    const parsed = new MdParser(data).parseToHtml();
    const structure = new MdParser(data).parse();
    if (parsed === answer) {
        console.log(testCount, "passed:", [data], "-->", [answer]);
    } else {
        console.log(testCount, "failed, epected: " + answer + "\n found: " + [parsed] + ", with structure:", ...structure)
    }
}


const tests = [
    ["ajsdaksd **", "<p>ajsdaksd **</p>"],
    ["__hello__ my friend", "<p><em>hello</em> my friend</p>"],
    ["__ ** __", "<p>__ ** __</p>"],
    ["**__**__", "<p>**__**__</p>"],
    ["__ **hello**", "<p>__ <strong>hello</strong></p>"],
    ["__**Вложенные выделения**__ \n с переносами!", "<p><em><strong>Вложенные выделения</strong></em> <br> с переносами!</p>"],
    ["\n\n\n Привет мой друг __ \n\n __ сказка началась", "<p>Привет мой друг <em> <br><br> </em> сказка началась</p>"],
    ["```kako``` **```kakao```** kokokoko**", "<p><code>kako</code> <strong><code>kakao</code></strong> kokokoko**</p>"],
    ["``` hello", "<p>``` hello</p>"],
    ["x", "<p>x</p>"],
    ["", ""],
];


for (const testImpl of tests) {
    test(testImpl[0], testImpl[1]);
}












