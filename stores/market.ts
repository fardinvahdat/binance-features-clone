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
    klines: [] as Kline[],
    markPrice: 0,
    indexPrice: 0,
    fundingRate: 0,
    nextFundingTime: "",
    interval: "H",
  }),

  getters: {
    priceChangePercent: (state) => {
      if (!state.ticker24h) return "0.00";
      return parseFloat(state.ticker24h.priceChangePercent).toFixed(2);
    },

    isPriceUp: (state) => state.currentPrice > state.prevPrice,
    isPriceDown: (state) => state.currentPrice < state.prevPrice,

    formattedPrice: (state) => {
      return state.currentPrice.toFixed(2);
    },

    volume24h: (state) => {
      if (!state.ticker24h) return "0";
      return parseFloat(state.ticker24h.volume).toLocaleString();
    },

    quoteVolume24h: (state) => {
      if (!state.ticker24h) return "0";
      return parseFloat(state.ticker24h.quoteVolume).toLocaleString();
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
  },
});
