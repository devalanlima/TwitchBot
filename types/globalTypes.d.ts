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

  interface ParsedText {
    type: 'text' | 'emote',
    value: string,
  }

  interface ParsedEmote {
    type: 'text' | 'emote',
    value: {
      src: string,
      alt: string,
    }
  }

  type ParsedMessage = Array<ParsedText | ParsedEmote>
}

export { };