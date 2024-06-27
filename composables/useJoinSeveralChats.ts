import type { ChatClient } from "@twurple/chat";
import { useGlobalStore } from "~/store/useGlobalStore";

export default async function useJoinSeveralChats (chatClient: ChatClient, channelsToJoin: Array<string>, joinMessage?: string) {
  const loading = ref(true);

  const globalStore = useGlobalStore();
  const channelCookies = useCookie('channelCookies');
  
  if (globalStore.messages.length > 3) {
    loading.value = false;
    alert('Máximo de canais simultaneos atingido');
  } else {

    if (!chatClient.isConnected) {
      chatClient.connect();
      useOnMessage(chatClient);
    } else {
      console.log('already connected');
    };

    channelsToJoin.map(async (channel) => {
      if (!chatClient.currentChannels.includes(channel)) {
        await chatClient.join(channel).then(()=>{
          globalStore.currentChannels = chatClient.currentChannels;
          channelCookies.value = JSON.stringify(globalStore.currentChannels);
          globalStore.messages.push({
            [channel]: [],
          });
        });     

        joinMessage && chatClient.say(channel, joinMessage);      
        loading.value = false;
      } else {
        console.log(`already connected at ${channel}`);
      };
    });
  }

  return loading;
}