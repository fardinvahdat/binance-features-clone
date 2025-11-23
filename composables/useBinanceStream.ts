import { useMarketStore } from '~/stores/market'

export const useBinanceStream = () => {
  const marketStore = useMarketStore()
  let ws: WebSocket | null = null
  let reconnectTimeout: NodeJS.Timeout | null = null
  let updateBuffer: any = {
    trades: [],
    klines: null,
    depth: null,
  }
  let flushInterval: NodeJS.Timeout | null = null

  const connect = (symbol: string = 'btcusdt') => {
    if (ws) {
      ws.close()
    }

    const streams = [
      `${symbol}@aggTrade`,
      `${symbol}@kline_1m`,
      `${symbol}@depth20@100ms`,
      `${symbol}@ticker`,
    ]

    const wsUrl = `wss://fstream.binance.com/stream?streams=${streams.join('/')}`
    
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connected')
      startFlushInterval()
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        handleMessage(data)
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      stopFlushInterval()
      // Attempt to reconnect after 3 seconds
      reconnectTimeout = setTimeout(() => {
        connect(symbol)
      }, 3000)
    }
  }

  const handleMessage = (data: any) => {
    if (!data.data) return

    const { e: eventType, s: symbol } = data.data

    switch (eventType) {
      case 'aggTrade':
        // Buffer trade data
        updateBuffer.trades.push({
          price: parseFloat(data.data.p),
          amount: parseFloat(data.data.q),
          time: new Date(data.data.T).toLocaleTimeString(),
          isBuyerMaker: data.data.m,
        })
        // Update price immediately for responsiveness
        marketStore.updatePrice(parseFloat(data.data.p))
        break

      case 'kline':
        // Buffer kline data
        const kline = data.data.k
        updateBuffer.klines = {
          time: kline.t / 1000,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
          volume: parseFloat(kline.v),
        }
        break

      case 'depthUpdate':
        // Buffer depth data
        updateBuffer.depth = {
          bids: data.data.b.map((b: any) => [parseFloat(b[0]), parseFloat(b[1])]),
          asks: data.data.a.map((a: any) => [parseFloat(a[0]), parseFloat(a[1])]),
        }
        break

      case '24hrTicker':
        // Update ticker immediately
        marketStore.updateTicker({
          symbol: data.data.s,
          priceChange: data.data.p,
          priceChangePercent: data.data.P,
          lastPrice: data.data.c,
          volume: data.data.v,
          quoteVolume: data.data.q,
          openPrice: data.data.o,
          highPrice: data.data.h,
          lowPrice: data.data.l,
        })
        break
    }
  }

  const startFlushInterval = () => {
    // Flush buffered data to store every 500ms (2 times per second)
    flushInterval = setInterval(() => {
      flushBuffer()
    }, 500)
  }

  const stopFlushInterval = () => {
    if (flushInterval) {
      clearInterval(flushInterval)
      flushInterval = null
    }
  }

  const flushBuffer = () => {
    // Flush trades
    if (updateBuffer.trades.length > 0) {
      updateBuffer.trades.forEach((trade: any) => {
        marketStore.addTrade(trade)
      })
      updateBuffer.trades = []
    }

    // Flush kline
    if (updateBuffer.klines) {
      marketStore.updateKline(updateBuffer.klines)
      updateBuffer.klines = null
    }

    // Flush depth
    if (updateBuffer.depth) {
      marketStore.updateOrderBook(updateBuffer.depth.bids, updateBuffer.depth.asks)
      updateBuffer.depth = null
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    stopFlushInterval()
  }

  // Fetch initial kline data
  const fetchInitialKlines = async (symbol: string = 'BTCUSDT', interval: string = '1m', limit: number = 1000) => {
    try {
      const response = await fetch(
        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      )
      const data = await response.json()
      
      const klines = data.map((k: any) => ({
        time: k[0] / 1000,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }))
      
      marketStore.setKlines(klines)
      return klines
    } catch (error) {
      console.error('Error fetching initial klines:', error)
      return []
    }
  }

  return {
    connect,
    disconnect,
    fetchInitialKlines,
  }
}