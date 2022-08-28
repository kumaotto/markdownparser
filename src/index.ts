import { parse } from '@src/parser';
import { generate } from './generator';
import { analize } from './lexer';

const convertToHTMLString = (markdown: string) => {
    const markdownArray = analize(markdown)
    const asts = markdownArray.map(md => parse(md));
    const htmlString = generate(asts);
    return htmlString;
}

console.log(convertToHTMLString('normal text\n \n * **boldlist1**\n * list2'))