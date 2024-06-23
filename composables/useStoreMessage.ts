import { parseChatMessage, type ChatMessage } from "@twurple/chat";
import { useGlobalStore } from "~/store/useGlobalStore";

export default async function useStoreMessage (message: string, msg: ChatMessage) {
  const { messages } = useGlobalStore();

  const parsedMessage = await useParseChatMessage(Number(msg.channelId), parseChatMessage(message, msg.emoteOffsets));  
  const finalUser = useBuildCustomUser(msg.userInfo);
  
  if (parsedMessage) {
    messages.push({
      user: finalUser,
      message: parsedMessage,
    });
  };
};