// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-primevue', '@nuxtjs/tailwindcss', "nuxt-auth-utils"],
  css:["assets/css/theme.css", "assets/css/tailwind.css"],
  primevue: {
    options: {
    }
  },
  runtimeConfig: {
    public: {
      REDIRECT_URI: process.env.NUXT_REDIRECT_URI,
    },
    oauth: {
      twitch: {
        clientId: process.env.NUXT_OAUTH_TWITCH_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_TWITCH_CLIENT_SECRET,
      },
    }
  },
})