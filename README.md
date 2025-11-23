# Binance Futures Clone - Nuxt 3

A high-fidelity clone of the Binance Futures trading interface built with Nuxt 3, Tailwind CSS, and Pinia.

## 🚀 Tech Stack

- **Framework**: Nuxt 3 (SSR disabled for optimal performance)
- **State Management**: Pinia
- **Styling**: Tailwind CSS 3
- **Charting**:
  - `lightweight-charts` for the main candlestick chart
  - `echarts` / `vue-echarts` for trading data visualizations
  - `nuxt-tradingview` for TradingView embed
- **Icons**: lucide-vue-next
- **Real-time Data**: WebSocket connection to Binance Futures API

## 📦 Installation

```bash
# Install dependencies
pnpm install

# or with npm
npm install

# or with yarn
yarn install
```

## 🏃 Development

```bash
# Start development server
pnpm dev

# or
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🎨 Features

### ✅ Real-time Market Data
- Live price updates via WebSocket (100ms throttled updates)
- Real-time order book with cumulative sums
- Recent trades feed
- 24-hour ticker statistics

### ✅ Advanced Charting
- **Original Chart**: Candlestick chart with volume and moving averages (MA7, MA25, MA99)
- **TradingView**: Embedded TradingView chart
- **Depth Chart**: Market depth visualization

### ✅ Trading Interface
- Order book with bid/ask spread
- Trading panel with limit/market/stop-limit orders
- Recent trades list
- Position and order management panels

### ✅ Trading Data Analytics
- Open Interest chart
- Long/Short Ratio (Accounts & Positions)
- Taker Buy/Sell Volume
- Basis chart
- All charts update in real-time

### ✅ Performance Optimizations
- Buffer & Flush strategy for WebSocket updates (max 10 updates/sec)
- Efficient chart rendering with lightweight-charts
- Throttled UI updates to prevent freezing

## 📁 Project Structure

```
nuxt/
├── assets/
│   └── css/
│       └── main.css          # Tailwind imports
├── components/
│   ├── Chart/
│   │   ├── ChartContainer.vue
│   │   ├── OriginalChart.vue
│   │   ├── TradingViewChart.vue
│   │   └── DepthChart.vue
│   ├── Header/
│   │   ├── TopBar.vue
│   │   ├── MarketHeader.vue
│   │   └── TickerBar.vue
│   ├── OrderBook/
│   │   ├── OrderBookPanel.vue
│   │   └── TradesPanel.vue
│   ├── Trading/
│   │   ├── TradingPanel.vue
│   │   ├── PositionsPanel.vue
│   │   └── AccountPanel.vue
│   └── TradingData/
│       ├── TradingDataTabs.vue
│       ├── TradingDataGrid.vue
│       ├── InfoPanel.vue
│       └── MiniChart.vue
├── composables/
│   └── useBinanceStream.ts   # WebSocket composable
├── pages/
│   └── index.vue             # Main trading page
├── stores/
│   └── market.ts             # Pinia store for market data
├── app.vue
├── nuxt.config.ts
├── tailwind.config.ts        # Binance color palette
├── tsconfig.json
└── package.json
```

## 🎨 Color Palette

The application uses Binance's official color scheme:

- **Background Primary**: `#161A1E`
- **Panel Background**: `#1E2329`
- **Binance Green**: `#0ECB81`
- **Binance Red**: `#F6465D`
- **Binance Yellow**: `#F0B90B`
- **Text Primary**: `#EAECEF`
- **Text Secondary**: `#848E9C`
- **Border**: `#2B2F36`

## 🔌 API Endpoints

The application connects to Binance Futures public APIs:

- **WebSocket**: `wss://fstream.binance.com/stream`
- **REST API**: `https://fapi.binance.com/fapi/v1/`

### Subscribed WebSocket Streams:
- `btcusdt@aggTrade` - Aggregate trades
- `btcusdt@kline_1m` - 1-minute candlesticks
- `btcusdt@depth20@100ms` - Order book depth (20 levels, 100ms updates)
- `btcusdt@ticker` - 24-hour ticker statistics

## 🔧 Configuration

### Tailwind Configuration
The Tailwind config includes custom colors matching Binance's design system. See `tailwind.config.ts`.

### Nuxt Configuration
- SSR is disabled (`ssr: false`) for client-side rendering
- Modules: `@pinia/nuxt`, `@nuxtjs/tailwindcss`, `nuxt-tradingview`

## 📝 Notes

- This is a **frontend-only** clone for educational purposes
- No actual trading functionality is implemented
- Real-time data is fetched from Binance public APIs
- The application does not require authentication

## 🚧 Future Enhancements

- [ ] Add more trading pairs
- [ ] Implement dark/light theme toggle
- [ ] Add price alerts
- [ ] Implement drawing tools on charts
- [ ] Add technical indicators panel
- [ ] Mobile responsive design

## 📄 License

This project is for educational purposes only. Binance and related trademarks are property of Binance.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using Nuxt 3
