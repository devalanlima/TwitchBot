import { type ChatClient, type ChatMessage } from "@twurple/chat";
import useStoreMessage from "./useStoreMessage";
import { useGlobalStore } from "~/store/useGlobalStore";

export default async function useOnMessage (chatClient: ChatClient, commands?: Array<ChatCommand>) {
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

  const replaceVariables = (message: string, sender: string, channel: string, text: string) => {
    let replacedMessage: string = message;

    if (message.includes('#{sender}')) {     
      replacedMessage = replacedMessage.replace(/#{sender}/g, sender);
    };
    if (message.includes('#{channel}')) {
      replacedMessage = replacedMessage.replace(/#{channel}/g, channel);
    };
    if(message.includes('#{message}')) {
      replacedMessage = replacedMessage.replace(/#{message}/g, text);
    };

    return replacedMessage;
  };

  const globalStore = useGlobalStore();

  commands?.map((command) => {
    if (command.timeSet.mode === 'keyword' && !(command.name in globalStore.keywordMessages)) {      
      if (command.name in globalStore.timerMessages) {        
        clearInterval(globalStore.timerMessages[command.name]);
        delete globalStore.timerMessages[command.name];
      };

      globalStore.keywordMessages = {
        ...globalStore.keywordMessages,
        [command.name]: 0,
      };
    } else if (command.timeSet.mode === 'timer' && !(command.name in globalStore.timerMessages)) {
      if (command.name in globalStore.keywordMessages) {        
        delete globalStore.keywordMessages[command.name];
      };

      globalStore.timerMessages[command.name] = setInterval(() => {
        const randomResponse: CommandResponse = pickRandom(command.responses);
        globalStore.currentChannels.map((channel) => {
          useSayChat(chatClient, randomResponse.response, channel.slice(1));
        })
      }, 
      command.timeSet.time < 1000 ? 1000 : command.timeSet.time
    );
    };
  });

  chatListener = chatClient.onMessage(async (channel: string, user: string, text: string, msg: ChatMessage)=>{
    const now = Date.now();
    commands && commands.map((command) => {
      if (command.timeSet.mode === 'keyword') {
        if (keywordsExistsInText(command.keywordSet, text)) {  
          const permitSend = now - globalStore.keywordMessages[command.name] >= command.timeSet.time;   
          if (permitSend) {
            const randomResponse: CommandResponse = pickRandom(command.responses);
            const response = replaceVariables(randomResponse.response, user, channel, text);
            useSayChat(chatClient, response, channel);
            globalStore.keywordMessages[command.name] = now;
          };
        };
      };
    });
    
    useStoreMessage(channel, await useParseChatMessage(msg, channel));
  });

};