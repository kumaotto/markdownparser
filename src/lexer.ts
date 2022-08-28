import { Token } from '@src/models/token';

const TEXT = 'text';
const STRONG = 'strong';

const STRONG_ELM_REGXP = /\*\*(.*?)\*\*/
const LIST_REGEZP = /^( *)([-|\*|\+] (.+))$/m;

const generateTextElm = (id: number, text: string, parent: Token): Token => {
  return {
    id,
    elmType: TEXT,
    content: text,
    parent
  };
}

const generateStrongElm = (id: number, text: string, parent: Token): Token => {
  return {
    id,
    elmType: STRONG,
    content: '',
    parent
  };
}

const matchWithStrongRegxp = (text: string) => {
  return text.match(STRONG_ELM_REGXP);
}

const matchWithListRegxp = (text: string) => {
  return text.match(LIST_REGEZP);
}

const analize = (markdown: string) => {
  const NEUTRAL_STATE = 'neutral_state';
  const LIST_STATE = 'list_state';
  let state = NEUTRAL_STATE;

  let lists = '';

  const rawMarkdownArray = markdown.split(/\r\n|\r|\n/);
  let markdownArray: Array<string> = [];

  rawMarkdownArray.forEach((md, index) => {
    const listMatch = md.match(LIST_REGEZP);
    if (state === NEUTRAL_STATE && listMatch) {
      state = LIST_STATE;
      lists += `${md}\n`;
    } else if (state === LIST_STATE && listMatch) {
      if (index === rawMarkdownArray.length - 1) {
        lists += `${md}`;
        markdownArray.push(lists);
      } else {
        lists += `${md}\n`;
      }
    } else if (state === LIST_STATE && !listMatch) {
      state = NEUTRAL_STATE;
      markdownArray.push(lists);
      lists = '';
    }

    if (lists.length === 0) {
      markdownArray.push(md);
    };
  });

  return markdownArray;
}

export { generateStrongElm, generateTextElm, matchWithStrongRegxp, matchWithListRegxp, analize }