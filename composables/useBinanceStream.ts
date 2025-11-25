import { useMarketStore } from "~/stores/market";
import { ref, reactive } from "vue";

export const useBinanceStream = () => {
  const marketStore = useMarketStore();
  const ws = ref<WebSocket | null>(null);
  const reconnectTimeout = ref<NodeJS.Timeout | null>(null);
  const flushInterval = ref<NodeJS.Timeout | null>(null);
  const updateBuffer = reactive({
    trades: [] as any[],
    klines: null as any,
    depth: null as any,
    latestTicker: null as any,
    latestPrice: null as number | null,
  });

  const connect = (symbol: string = "btcusdt", interval: string = "1m") => {
    disconnect(); // Ensure clean start

    const streams = [
      `${symbol}@aggTrade`,
      `${symbol}@kline_${interval}`,
      `${symbol}@depth20@100ms`,
      `${symbol}@ticker`,
    ];
    const wsUrl = `wss://fstream.binance.com/stream?streams=${streams.join("/")}`;

    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () => {
      console.log(`WebSocket connected for ${symbol} at ${interval}`);
      startFlushInterval();
    };

    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.data) {
          handleMessage(data.data);
        }
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    };

    ws.value.onerror = (error) => {
      console.error("WebSocket connection error:", error);
    };

    ws.value.onclose = () => {
      console.log("WebSocket connection closed");
      stopFlushInterval();
      reconnectTimeout.value = setTimeout(
        () => connect(symbol, interval),
        3000
      );
    };
  };

  const handleMessage = (messageData: any) => {
    const { e: eventType } = messageData;

    switch (eventType) {
      case "aggTrade":
        updateBuffer.trades.push({
          price: parseFloat(messageData.p),
          amount: parseFloat(messageData.q),
          time: new Date(messageData.T).toLocaleTimeString(),
          isBuyerMaker: messageData.m,
        });
        updateBuffer.latestPrice = parseFloat(messageData.p);
        break;

      case "kline":
        const kline = messageData.k;
        updateBuffer.klines = {
          time: kline.t / 1000,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
          volume: parseFloat(kline.v),
        };
        updateBuffer.latestPrice = parseFloat(kline.c);
        break;

      case "depthUpdate":
        updateBuffer.depth = {
          bids: messageData.b.map((b: any) => [
            parseFloat(b[0]),
            parseFloat(b[1]),
          ]),
          asks: messageData.a.map((a: any) => [
            parseFloat(a[0]),
            parseFloat(a[1]),
          ]),
        };
        break;

      case "24hrTicker":
        updateBuffer.latestTicker = {
          symbol: messageData.s,
          priceChange: messageData.p,
          priceChangePercent: messageData.P,
          lastPrice: messageData.c,
          volume: messageData.v,
          quoteVolume: messageData.q,
          openPrice: messageData.o,
          highPrice: messageData.h,
          lowPrice: messageData.l,
        };
        updateBuffer.latestPrice = parseFloat(messageData.c);
        break;
    }
  };

  const startFlushInterval = () => {
    flushInterval.value = setInterval(flushBuffer, 1000);
  };

  const stopFlushInterval = () => {
    if (flushInterval.value) {
      clearInterval(flushInterval.value);
      flushInterval.value = null;
    }
  };

  const flushBuffer = () => {
    if (updateBuffer.latestPrice !== null) {
      marketStore.updatePrice(updateBuffer.latestPrice);
      updateBuffer.latestPrice = null;
    }

    if (updateBuffer.trades.length > 0) {
      updateBuffer.trades.forEach((trade: any) => marketStore.addTrade(trade));
      updateBuffer.trades = [];
    }

    if (updateBuffer.klines) {
      marketStore.updateKline(updateBuffer.klines);
      updateBuffer.klines = null;
    }

    if (updateBuffer.depth) {
      marketStore.updateOrderBook(
        updateBuffer.depth.bids,
        updateBuffer.depth.asks
      );
      updateBuffer.depth = null;
    }

    if (updateBuffer.latestTicker) {
      marketStore.updateTicker(updateBuffer.latestTicker);
      updateBuffer.latestTicker = null;
    }
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
    if (reconnectTimeout.value) {
      clearTimeout(reconnectTimeout.value);
      reconnectTimeout.value = null;
    }
    stopFlushInterval();
  };

const fetchInitialKlines = async (
  symbol: string = "btcusdt",
  interval: string = "1m",
  limit: number = 1000
) => {
  try {
    const proxyUrl = `/api/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      const text = await response.text(); // Get raw text for debugging
      console.error("Proxy response not OK:", response.status, text);
      throw new Error(`Proxy error: ${response.status} - ${text}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(`API error: ${data.error}`);
    }

    const klines = data.map((k: any) => ({
      time: k[0] / 1000,
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));
    marketStore.setKlines(klines);
    return klines;
  } catch (error) {
    console.error("Error fetching initial klines:", error);
    return [];
  }
};

  return {
    connect,
    disconnect,
    fetchInitialKlines,
  };
};
