const { public: runTime } = useRuntimeConfig();

export default oauth.twitchEventHandler({
  config:{
    scope: runTime.scopes as Array<string> ,
    authorizationParams:{
      force_verify: 'true',
    }
  },
  async onSuccess(event, { user, tokens }) {  
    function formatedDateTime() {
      const now = new Date();
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      
      const time = `${hours}:${minutes}`;
      const date = `${day}/${month}/${year}`;
      
      return `${date} - ${time}`;
    }  

    await setUserSession(event, {
      user: {
        id: user.id,
        tokens: tokens,
      },
      //@ts-ignore
      loggedInAt: formatedDateTime(),
    })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Twitch OAuth error:', error)
    return sendRedirect(event, '/')
  },
})