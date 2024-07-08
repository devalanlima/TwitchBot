import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';

export default defineNuxtPlugin(async (nuxtApp)=>{
  const { $authProvider } = useNuxtApp();
  const authProvider = $authProvider as StaticAuthProvider;
  const chatClient = new ChatClient ({ authProvider });

  return {
    provide: {
      chatClient: chatClient,
    },
  };
});