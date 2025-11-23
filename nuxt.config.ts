export default defineNuxtConfig({
  ssr: false,
  typescript: { strict: true },

  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "nuxt-tradingview"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },

  tradingview: {
    overrideDefaults: true, // Default
    prefix: "TV",
  },

  css: ["@/assets/css/main.css"],
});
