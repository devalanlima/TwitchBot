import { parseChatMessage, toChannelName, toUserName, type ChatMessage } from "@twurple/chat";
import { useGlobalStore } from "~/store/useGlobalStore";

export default async function useStoreMessage (message: string, msg: ChatMessage, channel: string) {
  const { messages } = useGlobalStore();

  const parsedMessage = await useParseChatMessage(Number(msg.channelId), parseChatMessage(message, msg.emoteOffsets));  
  const finalUser = useBuildCustomUser(msg.userInfo);

  const time = () => {
    const hour = new Date().getHours().toString().padStart(2, '0');
    const min = new Date().getMinutes().toString().padStart(2, '0');
    return `${hour}:${min}`;
  };

  const channelKey = `#${channel}`
      
  if (parsedMessage) {

    const found = messages.find(channel => channel.hasOwnProperty(channelKey));
    const atualMessage = {
      id: msg.id,
      user: finalUser,
      message: parsedMessage,
      time: time(),
    }

    if (found) {
      messages[messages.findIndex(channel => channel.hasOwnProperty(channelKey))][channelKey].push(atualMessage) 
      if (messages[messages.findIndex(channel => channel.hasOwnProperty(channelKey))][channelKey].length > 30) {
        messages[messages.findIndex(channel => channel.hasOwnProperty(channelKey))][channelKey].shift();
      }
    }
  };
};