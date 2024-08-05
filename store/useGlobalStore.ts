export const useGlobalStore = defineStore('global', () => {
  const currentChannels = ref<Array<string>>([]);

  const chatMessages = ref<ChatData>({});

  const keywordMessages = ref<{[key: string]: number}>({});

  const timerMessages = ref<{[key: string]: any}>({});

  const savedCommands = ref<Array<ChatCommand>>([]);

  return { currentChannels, chatMessages, keywordMessages, timerMessages, savedCommands };
})