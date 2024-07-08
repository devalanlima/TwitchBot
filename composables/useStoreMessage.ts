import { useGlobalStore } from "~/store/useGlobalStore";

export default async function useStoreMessage (channelFrom: string, message: MessageData) {
  const globalStore = useGlobalStore();

  const channel = globalStore.chatMessages[channelFrom];
  
  if (globalStore.chatMessages.hasOwnProperty(channelFrom)) {
    channel.push(message);
    
    channel.length >= 30 && channel.shift();
  } else {
    globalStore.chatMessages = {
      ...globalStore.chatMessages,
      [channelFrom]: [message],
    };
  };
};