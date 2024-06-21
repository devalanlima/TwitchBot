declare global {

  interface Keyword {
    keyword: string;
    isExact: boolean;
  }

  interface KeywordPair {
    firstKeywordSet: Array<Keyword>;
    secondKeywordSet?: Array<Keyword>;
  }

  interface ChatCommand {
    keywordSet: KeywordPair;
    responses: Array<string>;
  }
}

export { };