export const useGlobalStore = defineStore('global', () => {
  const currentChannels = ref<Array<string>>([]);
  
  const messages = ref<Array<CustomMessage>>([]);

  return { messages, currentChannels };
})