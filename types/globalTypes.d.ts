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
    type: 'text',
    value: string,
  }

  interface ParsedEmote {
    type: 'emote',
    value: {
      src: string,
      alt: string,
    }
  }

  type ParsedMessage = Array<ParsedText | ParsedEmote>

  interface CustomUser {
    badges: {
      isSubscriber: boolean,
      isVip: boolean,
      isBroadcaster: boolean,
      isModerator: boolean,
      isFounder: boolean,
      isArtist: boolean,
    },
    username: {
      color: string | undefined,
      displayName: string,
    }
  }

  interface MessageData {
    id: string,
    user: CustomUser,
    message: ParsedMessage,
    time: string,
  }

  interface CustomMessage {
    [key: string]: Array<MessageData>;
  }

}

export { };