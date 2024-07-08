export const useGlobalStore = defineStore('global', () => {
  const currentChannels = ref<Array<string>>([]);

  const chatMessages = ref<ChatData>({})

  return { currentChannels, chatMessages };
})