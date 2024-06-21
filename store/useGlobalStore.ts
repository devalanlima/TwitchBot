import type { ParsedMessagePart } from "@twurple/chat";

export const useGlobalStore = defineStore('global', () => {
  const messages = ref<Array<Array<ParsedMessagePart>>>([]);

  return { messages };
})