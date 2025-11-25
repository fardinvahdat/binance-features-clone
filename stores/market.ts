import { defineStore } from "pinia";

export interface Ticker24h {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  sum: number;
}

export interface Trade {
  price: number;
  amount: number;
  time: string;
  isBuyerMaker: boolean;
}

export interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const useMarketStore = defineStore("market", {
  state: () => ({
    currentSymbol: "BTCUSDT",
    currentPrice: 0,
    prevPrice: 0,
    ticker24h: null as Ticker24h | null,
    bids: [] as OrderBookLevel[],
    asks: [] as OrderBookLevel[],
    recentTrades: [] as Trade[],
    klines: [] as any[],
    markPrice: 0,
    indexPrice: 0,
    fundingRate: 0,
    nextFundingTime: "",
    interval: "1H",
    tickers: {} as Record<
      string,
      {
        symbol: string;
        price: number;
        changePercent: number;
        volume: number;
      }
    >,
  }),

  getters: {
    priceChangePercent: (state) => {
      if (!state.ticker24h) return "0.00";
      return parseFloat(state.ticker24h.priceChangePercent).toFixed(2);
    },

    isPriceUp: (state) => state.currentPrice >= state.prevPrice,
    isPriceDown: (state) => state.currentPrice < state.prevPrice,

    formattedPrice: (state) => {
      return state.currentPrice.toFixed(2);
    },

    volume24h: (state) => {
      if (!state.ticker24h) return "0";
      return parseFloat(state.ticker24h.volume).toString();
    },

    quoteVolume24h: (state) => {
      if (!state.ticker24h) return "0";
      return parseFloat(state.ticker24h.quoteVolume).toString();
    },

    lastCandle: (state) =>
      state.klines.length ? state.klines[state.klines.length - 1] : null,

    chartStats: (state) => {
      if (!state.klines.length) return null;

      const last = state.klines[state.klines.length - 1];

      const time = last.time * 1000; // convert seconds → ms
      const open = Number(last.open);
      const high = Number(last.high);
      const low = Number(last.low);
      const close = Number(last.close);

      const change = ((close - open) / open) * 100;
      const range = ((high - low) / low) * 100;

      return {
        date: new Date(time).toDateString(),
        open,
        high,
        low,
        close,
        change,
        range,
      };
    },

    movingAverages: (state) => {
      const ma = (length: number) => {
        if (state.klines.length < length) return null;

        const slice = state.klines.slice(-length);
        const avg =
          slice.reduce((sum, k) => sum + Number(k.close), 0) / slice.length;

        return avg;
      };

      return {
        ma7: ma(7),
        ma25: ma(25),
        ma99: ma(99),
      };
    },
  },

  actions: {
    setSymbol(symbol: string) {
      this.currentSymbol = symbol;
      // Reset data when changing symbols
      this.bids = [];
      this.asks = [];
      this.recentTrades = [];
      this.klines = [];
    },

    updatePrice(price: number) {
      this.prevPrice = this.currentPrice;
      this.currentPrice = price;
    },

    updateTicker(ticker: Ticker24h) {
      this.ticker24h = ticker;
      if (ticker.lastPrice) {
        this.updatePrice(parseFloat(ticker.lastPrice));
      }
    },

    updateOrderBook(bids: number[][], asks: number[][]) {
      // Calculate cumulative sums
      let bidSum = 0;
      this.bids = bids.slice(0, 20).map(([price, size]) => {
        bidSum += size;
        return { price, size, sum: bidSum };
      });

      let askSum = 0;
      this.asks = asks
        .slice(0, 20)
        .reverse()
        .map(([price, size]) => {
          askSum += size;
          return { price, size, sum: askSum };
        })
        .reverse();
    },

    addTrade(trade: Trade) {
      this.recentTrades.unshift(trade);
      if (this.recentTrades.length > 50) {
        this.recentTrades = this.recentTrades.slice(0, 50);
      }
    },

    updateKline(kline: Kline) {
      const existingIndex = this.klines.findIndex((k) => k.time === kline.time);
      if (existingIndex !== -1) {
        this.klines[existingIndex] = kline;
      } else {
        this.klines.push(kline);
      }
      // Keep only last 1000 candles
      if (this.klines.length > 1000) {
        this.klines = this.klines.slice(-1000);
      }
    },

    setKlines(klines: Kline[]) {
      this.klines = klines;
    },

    connectTickers() {
      const ws = new WebSocket(
        "wss://fstream.binance.com/stream?streams=!ticker@arr"
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (!data.data) return;

        for (const t of data.data) {
          this.tickers[t.s] = {
            symbol: t.s,
            price: Number(t.c),
            changePercent: Number(t.P),
            volume: Number(t.v),
          };
        }
      };
    },
  },
});
