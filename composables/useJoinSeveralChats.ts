import { ApiClient } from "@twurple/api";
import type { StaticAuthProvider } from "@twurple/auth";
import type { ChatClient } from "@twurple/chat";
import { useGlobalStore } from "~/store/useGlobalStore";

export default async function useJoinSeveralChats (chatClient: ChatClient, channelsToJoin: Array<string>, joinMessage?: string) {
  const loading = ref(true);
  const { $authProvider } = useNuxtApp();
  const authProvider = $authProvider as StaticAuthProvider;

  const globalStore = useGlobalStore();
  const channelCookies = useCookie('channelCookies');
  const api = authProvider && new ApiClient({ authProvider });
  
  if (globalStore.currentChannels.length > 3) {
    loading.value = false;
    alert('Max number of simultaneous channels reached');
  } else {

    if (!chatClient.isConnected) {
      chatClient.connect();
      useOnMessage(chatClient);
    } else {
      console.log('Already connected');
    };

    channelsToJoin.map(async (channel) => {

      if (!chatClient.currentChannels.includes(channel)) {
        await chatClient.join(channel).then(async ()=>{
          globalStore.currentChannels = chatClient.currentChannels;
          channelCookies.value = JSON.stringify(globalStore.currentChannels);          
        });          

        const channelId = await api?.users.getUserByName(channel.slice(1));
        channelId && useFetchChannelEmotes(channelId.id).then(()=>{
          joinMessage && useSayChat(chatClient, joinMessage, channel.slice(1));
        });
        loading.value = false;
      } else {
        console.log(`Already connected at ${channel}`);
      };
    });
  }

  return loading;
}