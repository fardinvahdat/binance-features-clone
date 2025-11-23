import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#161A1E',
        'bg-panel': '#1E2329',
        'bg-hover': '#2B2F36',
        'binance-green': '#0ECB81',
        'binance-red': '#F6465D',
        'text-primary': '#EAECEF',
        'text-secondary': '#848E9C',
        'border-color': '#2B2F36',
        'binance-yellow': '#F0B90B',
      },
    },
  },
  plugins: [],
} satisfies Config
