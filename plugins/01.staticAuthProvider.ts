import { StaticAuthProvider } from '@twurple/auth';
import { useUserSession } from '#imports';
import { useGlobalStore } from '~/store/useGlobalStore';

export default defineNuxtPlugin(async (nuxtApp)=>{
  let { user } = useUserSession()

  const { public: credentials } = useRuntimeConfig()
  const clientId = credentials.clientId;
  const accessToken = user.value?.tokens.access_token
  const globalStore = useGlobalStore();

  let authProvider: StaticAuthProvider | null = null

  if (accessToken) {
    authProvider = new StaticAuthProvider(clientId, accessToken, credentials.scopes as Array<string>);
  }

  return {
    provide: {
      authProvider: authProvider
    }
  }
})