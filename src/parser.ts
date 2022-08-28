import { Token } from "@src/models/token";
import { generateStrongElm, generateTextElm, matchWithListRegxp, matchWithStrongRegxp } from "./lexer";

const rootToken: Token = {
  id: 0,
  elmType: 'root',
  content: '',
  parent: {} as Token,
};

export const parse = (markdownRow: string) => {
  if (matchWithListRegxp(markdownRow)) {
    return _tokenizeList(markdownRow)
  }
  return _tokenizeText(markdownRow);
}

const _tokenizeText = (
  textElement: string,
  initialId: number = 0,
  initialRoot: Token = rootToken
) => {
  let elements: Token[] = [];
  let parent: Token = initialRoot;

  let id = initialId;

  const _tokenize = (originalText: string, p: Token) => {
    let proccessingText = originalText;
    parent = p;

    while (proccessingText.length !== 0) {
      const matchArray = matchWithStrongRegxp(proccessingText) as RegExpMatchArray;

      if (!matchArray) {
        id += 1;
        const onlyText = generateTextElm(id, proccessingText, parent);
        proccessingText = '';
        elements.push(onlyText);
      } else {
        if (Number(matchArray.index) > 0) {
          const text = proccessingText.substring(0, Number(matchArray.index));
          id += 1;
          const textElm = generateTextElm(id, text, parent);
          elements.push(textElm);
          proccessingText = proccessingText.replace(text, '');
        }

        id += 1;
        const elm = generateStrongElm(id, '', parent);

        // Set the outer element to parent
        parent = elm;
        elements.push(elm);

        // Delete text generated token from text
        proccessingText = proccessingText.replace(matchArray[0], '');

        // Recursion
        _tokenize(matchArray[1], parent);
        parent = p;
      }
    }
  };

  _tokenize(textElement, parent);
  return elements;
};

export const _tokenizeList = (listString: string) => {
  const UL = 'ul';
  const LIST = 'li';

  let id = 1;
  const rootUlToken: Token = {
    id,
    elmType: UL,
    content: '',
    parent: rootToken
  };
  let parent = rootUlToken;
  let tokens: Token[] = [rootUlToken];
  listString.split(/\r\n|\r|\n/).filter(Boolean).forEach(l => {
    const match = matchWithListRegxp(l) as RegExpMatchArray;

    id += 1;
    const listToken: Token = {
      id,
      elmType: LIST,
      content: '',
      parent
    };
    tokens.push(listToken);
    const listText: Token[] = _tokenizeText(match[3], id, listToken);
    id += listText.length;
    tokens.push(...listText);
  });
  return tokens;
}