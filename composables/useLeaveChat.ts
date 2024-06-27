import type { ChatClient } from "@twurple/chat";
import { useGlobalStore } from "~/store/useGlobalStore";

export default function useLeaveChat (chatClient: ChatClient, channel: string) {
  const globalStore = useGlobalStore();

  if (globalStore.currentChannels.includes(channel)) {
    chatClient.part(channel);
    globalStore.currentChannels = globalStore.currentChannels.filter(currentChannel => channel !== currentChannel); 
    
    globalStore.messages = globalStore.messages.filter(obj => {
      return !Object.keys(obj).includes(channel);
    });

  } else {
    console.log('channel is not connected');
  }

  const channelCookies = useCookie('channelCookies');  
  channelCookies.value = JSON.stringify(globalStore.currentChannels);
}