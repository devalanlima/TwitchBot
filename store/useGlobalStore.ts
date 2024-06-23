import type { ParsedMessagePart } from "@twurple/chat";

export const useGlobalStore = defineStore('global', () => {
  const messages = ref<Array<ParsedMessage>>([]);

  return { messages };
})