import type { ChatClient } from "@twurple/chat";

export default function useJoinSeveralChats (chatClient: ChatClient, channels: Array<string>): void {
  
  channels.map((channel) => {
    if (!chatClient.currentChannels.includes(channel)) {
      chatClient.join(channel);
      chatClient.say(channel, 'farenaBot entrou.')
    }
  });

}