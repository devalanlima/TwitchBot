import { parseChatMessage, type ChatMessage } from "@twurple/chat";
import { useGlobalStore } from "~/store/useGlobalStore";

export default async function useStoreMessage (message: string, msg: ChatMessage) {
  const { messages } = useGlobalStore();

  const parsedMessage = await useParseChatMessage(Number(msg.channelId), parseChatMessage(message, msg.emoteOffsets));  
  const finalUser = useBuildCustomUser(msg.userInfo);

  const time = () => {
    const hour = new Date().getHours().toString().padStart(2, '0');
    const min = new Date().getMinutes().toString().padStart(2, '0');
    return `${hour}:${min}`;
  };
  
  if (parsedMessage) {
    messages.push({
      id: msg.id,
      user: finalUser,
      message: parsedMessage,
      time: time(),
    });
  };
};