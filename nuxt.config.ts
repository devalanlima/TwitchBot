// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-primevue', '@nuxtjs/tailwindcss', "nuxt-auth-utils"],
  css:["assets/css/theme.css", "assets/css/tailwind.css"],
  primevue: {
    options: {
    }
  }
})