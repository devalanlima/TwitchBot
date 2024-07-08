import { ApiClient } from "@twurple/api";
import type { StaticAuthProvider } from "@twurple/auth";
import type { ChatClient } from "@twurple/chat";
import { useGlobalStore } from "~/store/useGlobalStore";

export default async function useLeaveChat (chatClient: ChatClient, channel: string) {
  const globalStore = useGlobalStore();
  const { $authProvider } = useNuxtApp();
  const authProvider = $authProvider as StaticAuthProvider;
  const api = authProvider && new ApiClient({ authProvider });

  if (globalStore.currentChannels.includes(channel)) {
    chatClient.part(channel);
    globalStore.currentChannels = globalStore.currentChannels.filter(currentChannel => channel !== currentChannel); 
    
    delete globalStore.chatMessages[channel.slice(1)];
    
    await api?.users.getUserByName(channel.slice(1)).then((user)=>{
      user?.id && localStorage.removeItem(user?.id);
    })

  } else {
    console.log('Channel is not connected');
  }

  const channelCookies = useCookie('channelCookies');  
  channelCookies.value = JSON.stringify(globalStore.currentChannels);
}