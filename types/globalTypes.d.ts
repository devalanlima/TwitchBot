import type { ChatMessage, ChatUser } from "@twurple/chat";

declare global {

  interface Keyword {
    keyword: string;
    isExact: boolean;
  }

  interface KeywordPair {
    firstKeywordSet: Array<Keyword>;
    secondKeywordSet?: Array<Keyword>;
  }

  interface CommandResponse {
    id: number, 
    response: string
  }

  interface ChatCommand {
    name: string,
    keywordSet: KeywordPair;
    responses: Array<CommandResponse>;
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
    displayName: string,
    color: string | undefined,
    isBot: boolean,
    isBroadcaster: boolean,
    isMod: boolean,
    isSubscriber: boolean,
    isVip: boolean,
    isFounder: boolean,
    isArtist: boolean,
  }

  interface MessageData {
    id: string,
    time: Date,
    user: CustomUser,
    data: ParsedMessage,
  }

  interface ChatData {
    [key: string]: Array<MessageData>,
  }

  interface EmotesResponse {
    "provider": 0 | 1 | 2 | 3,
    "code": string,
    "urls": [
      {
        "size": '1x' | '2x' | '3x' | '4x',
        "url": string
      }
    ]
  }

}

export { };