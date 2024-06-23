import { parseChatMessage, type ChatClient, type ChatMessage } from "@twurple/chat";
import useParseEmotes from "./useParseEmotes";

export default function useOnMessage (chatClient: ChatClient, commands: Array<ChatCommand>) {
  let chatListener;
  chatClient.removeListener(chatListener);

  const composeMessageToFilter = (message: string) => {
    return message.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ").join(""); 
  };

  const keywordsExistsInText = (keyWords: KeywordPair, text: string) => {

    const testExactMatch = (keyword: string, text: string) => {
      const regex = new RegExp(`(^|\\s)${keyword}(\\s|$)`);
      return regex.test(text);
    };

    const firstKeywordSetMatch = 
    keyWords.firstKeywordSet.some(
      (keyWord) => keyWord.isExact 
      ? testExactMatch(keyWord.keyword.toLowerCase(), text.toLowerCase())
      : composeMessageToFilter(text).includes(composeMessageToFilter(keyWord.keyword))
    );

    const secondKeywordSetMach = 
    keyWords.secondKeywordSet?.some(
      (keyWord) => keyWord.isExact
      ? testExactMatch(keyWord.keyword.toLowerCase(), text.toLowerCase())
      : composeMessageToFilter(text).includes(composeMessageToFilter(keyWord.keyword))
    );

    if (keyWords.secondKeywordSet) {
      return firstKeywordSetMatch ? secondKeywordSetMach : false;
    } else {
      return firstKeywordSetMatch;
    };

  };

  const pickRandom = (list: Array<any>) => {
    return list[~~(Math.random() * list.length)];
  };

  chatListener = chatClient.onMessage(async (channel: string, user: string, text: string, msg: ChatMessage)=>{
    useParseEmotes(Number(msg.channelId), parseChatMessage(text, msg.emoteOffsets));

    commands.map((command): void => {
      if (keywordsExistsInText(command.keywordSet, text)) {
        const response = pickRandom(command.responses);
        chatClient.say(channel, response);
        useParseEmotes(Number(msg.channelId), parseChatMessage(response, msg.emoteOffsets));
      }
    });

  });
};