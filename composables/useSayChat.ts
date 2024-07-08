import type { ChatClient } from "@twurple/chat";

export default async function useSayChat (chatClient: ChatClient, message: string, channel: string) {
  chatClient.say(channel, message);
  useStoreMessage(channel, await useParseChatMessage(message, channel));
}