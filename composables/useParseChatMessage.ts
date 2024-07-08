import { ApiClient } from "@twurple/api";
import type { StaticAuthProvider } from "@twurple/auth";
import { buildEmoteImageUrl, parseChatMessage, type ChatMessage } from "@twurple/chat";

export default async function useParseChatMessage (chatMessage: ChatMessage | string, channel: string) {

  const { user } = useUserSession();
  const { $authProvider } = useNuxtApp();
  const authProvider = $authProvider as StaticAuthProvider;

  const globalEmotes = JSON.parse(localStorage.getItem('globalEmotes') || '[]');

  let parsedChatMessage;
  let allEmotes: Array<EmotesResponse>;
  let parsedString: ParsedMessage = [];
  let chatData: MessageData = {
    id: '0',
    time: new Date(),
    user: {
      displayName: '* Not logged - Try to reconnect *',
      color: '#FF0000',
      isBot: true,
      isBroadcaster: false,
      isMod: false,
      isSubscriber: false,
      isVip: false,
      isFounder: false,
      isArtist: false,
    },
    data: parsedString,
  };

  if (typeof chatMessage === 'string') {
    if (authProvider && user.value && channel) {
      const api = new ApiClient({ authProvider });
      const chatUser = await api?.users.getUserById(user.value?.id);
      const channelId = await api.users.getUserByName(channel);

      const channelEmotes = channelId && JSON.parse(localStorage.getItem(channelId?.id) || '[]');
      allEmotes = [...globalEmotes, ...channelEmotes];
      parsedString = parseStoredEmotes(allEmotes, chatMessage);
      
      const botUser: CustomUser  = {
        displayName: chatUser?.displayName || 'farenaBot',
        isBot: true,
        color: '#FFFFFF',
        isBroadcaster: false,
        isMod: false,
        isSubscriber: false,
        isVip: false,
        isFounder: false,
        isArtist: false,
      }
      chatData = {
        id: '0',
        time: new Date(),
        user: botUser,
        data: parsedString,
      }
    }

  } else {

    const channelEmotes = chatMessage.channelId && JSON.parse(localStorage.getItem(chatMessage.channelId) || '[]');
    allEmotes = [...globalEmotes, ...channelEmotes];
    parsedChatMessage = parseChatMessage(chatMessage.text, chatMessage.emoteOffsets);

    parsedChatMessage.map((item)=>{
      if (item.type === 'text' && globalEmotes) {
        parsedString = [...parsedString, ...parseStoredEmotes(allEmotes, item.text)];
      } else if (item.type === 'emote') {
        parsedString.push({
          type: 'emote',
          value: {
            src: buildEmoteImageUrl(item.id),
            alt: item.name,
          },
        });
      };
    });

    const customUser: CustomUser  = {
      displayName: chatMessage.userInfo.displayName,
      isBot: false,
      isBroadcaster: chatMessage.userInfo.isBroadcaster,
      isMod: chatMessage.userInfo.isMod,
      isSubscriber: chatMessage.userInfo.isSubscriber,
      isVip: chatMessage.userInfo.isVip,
      isFounder: chatMessage.userInfo.isFounder,
      isArtist: chatMessage.userInfo.isArtist,
      color: chatMessage.userInfo.color,
    }

    chatData = {
      id: chatMessage.id,
      time: chatMessage.date,
      user: customUser,
      data: parsedString,
    };

  };

  function parseStoredEmotes(words: Array<EmotesResponse>, str: string): ParsedMessage {
    const result: ParsedMessage = [];
    let remainingString = str;
    
    const positions = words.map(word => ({ word, index: str.indexOf(word.code) }))
      .filter(({ index }) => index !== -1)
      .sort((a, b) => a.index - b.index);
    
    let currentIndex = 0;
    
    while (currentIndex < remainingString.length) {
      let found = false;
      for (const { word } of positions) {
        if (remainingString.startsWith(word.code, currentIndex)) {
          const endIndex = currentIndex + word.code.length;
          const before = (currentIndex === 0) || (remainingString[currentIndex - 1] === ' ');
          const after = (endIndex === remainingString.length) || (remainingString[endIndex] === ' ');
    
          if (before && after) {
            if (currentIndex > 0) {
              result.push({
                type: 'text',
                value: remainingString.substring(0, currentIndex),
              });
            };
            result.push({
              type: 'emote',
              value: {
                src: word.urls[0].url,
                alt: word.code,
              },
            });
            result.push({
              type: 'text',
              value: ' ',
            });
            remainingString = remainingString.substring(endIndex).trim();
            currentIndex = 0;
            found = true;
            break;
          };
        };
      };
        if (!found) {
          currentIndex++;
        };
      }
    
      if (remainingString) {
        result.push({
          type: 'text',
          value: remainingString,
        });
      }
    return result;
  };

  return chatData;

};