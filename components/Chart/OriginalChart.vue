<template>
  <div ref="chartContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'
import { useMarketStore } from '~/stores/market'
import { useBinanceStream } from '~/composables/useBinanceStream'

const chartContainer = ref<HTMLElement | null>(null)
let chart: IChartApi | null = null
let candlestickSeries: ISeriesApi<'Candlestick'> | null = null
let volumeSeries: ISeriesApi<'Histogram'> | null = null
let ma7Series: ISeriesApi<'Line'> | null = null
let ma25Series: ISeriesApi<'Line'> | null = null
let ma99Series: ISeriesApi<'Line'> | null = null
let resizeObserver: ResizeObserver | null = null
let isDestroyed = false

const marketStore = useMarketStore()
const { fetchInitialKlines } = useBinanceStream()

onMounted(async () => {
  if (!chartContainer.value) return

  // Wait for next tick to ensure DOM is ready
  await nextTick()
  
  if (!chartContainer.value || isDestroyed) return

  // Create the chart
  chart = createChart(chartContainer.value, {
    layout: {
      background: { type: ColorType.Solid, color: '#1E2329' },
      textColor: '#848E9C',
    },
    grid: {
      vertLines: { color: '#2B2F36' },
      horzLines: { color: '#2B2F36' },
    },
    width: chartContainer.value.clientWidth,
    height: chartContainer.value.clientHeight,
    crosshair: {
      mode: 1,
    },
    rightPriceScale: {
      borderColor: '#2B2F36',
    },
    timeScale: {
      borderColor: '#2B2F36',
      timeVisible: true,
      secondsVisible: false,
    },
  })

  // Create candlestick series
  candlestickSeries = chart.addCandlestickSeries({
    upColor: '#0ECB81',
    downColor: '#F6465D',
    borderUpColor: '#0ECB81',
    borderDownColor: '#F6465D',
    wickUpColor: '#0ECB81',
    wickDownColor: '#F6465D',
  })

  // Create volume series
  volumeSeries = chart.addHistogramSeries({
    priceFormat: {
      type: 'volume',
    },
    priceScaleId: 'volume',
  })

  chart.priceScale('volume').applyOptions({
    scaleMargins: {
      top: 0.8,
      bottom: 0,
    },
  })

  // Create MA series
  ma7Series = chart.addLineSeries({
    color: '#8B5CF6',
    lineWidth: 1,
    priceLineVisible: false,
    lastValueVisible: false,
  })

  ma25Series = chart.addLineSeries({
    color: '#F59E0B',
    lineWidth: 1,
    priceLineVisible: false,
    lastValueVisible: false,
  })

  ma99Series = chart.addLineSeries({
    color: '#3B82F6',
    lineWidth: 1,
    priceLineVisible: false,
    lastValueVisible: false,
  })

  // Fetch and set initial data
  await fetchInitialKlines('BTCUSDT', '1m', 1000)
  updateChartData()

  // Handle resize
  resizeObserver = new ResizeObserver(entries => {
    if (chart && !isDestroyed && entries.length > 0) {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) {
        chart.applyOptions({ width, height })
      }
    }
  })

  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value)
  }

  // Watch for kline updates
  watch(() => marketStore.klines, () => {
    if (!isDestroyed) {
      updateChartData()
    }
  }, { deep: true })

  // Watch for symbol changes
  watch(() => marketStore.currentSymbol, async (newSymbol) => {
    if (!isDestroyed) {
      console.log('Refetching klines for:', newSymbol)
      await fetchInitialKlines(newSymbol, '1m', 1000)
      updateChartData()
    }
  })
})

const updateChartData = () => {
  if (!candlestickSeries || !volumeSeries || isDestroyed) return

  const klines = marketStore.klines
  if (klines.length === 0) return

  // Update candlestick data
  const candleData = klines.map(k => ({
    time: k.time,
    open: k.open,
    high: k.high,
    low: k.low,
    close: k.close,
  }))
  candlestickSeries.setData(candleData)

  // Update volume data
  const volumeData = klines.map((k, i) => {
    const isUp = i === 0 ? true : k.close >= k.open
    return {
      time: k.time,
      value: k.volume,
      color: isUp ? '#0ECB8133' : '#F6465D33',
    }
  })
  volumeSeries.setData(volumeData)

  // Calculate and update MAs
  if (ma7Series && klines.length >= 7 && !isDestroyed) {
    const ma7Data = calculateMA(klines, 7)
    ma7Series.setData(ma7Data)
  }

  if (ma25Series && klines.length >= 25 && !isDestroyed) {
    const ma25Data = calculateMA(klines, 25)
    ma25Series.setData(ma25Data)
  }

  if (ma99Series && klines.length >= 99 && !isDestroyed) {
    const ma99Data = calculateMA(klines, 99)
    ma99Series.setData(ma99Data)
  }
}

const calculateMA = (data: any[], period: number) => {
  const result = []
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close
    }
    result.push({
      time: data[i].time,
      value: sum / period,
    })
  }
  return result
}

onUnmounted(() => {
  isDestroyed = true
  
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  
  if (chart) {
    chart.remove()
    chart = null
  }
  
  candlestickSeries = null
  volumeSeries = null
  ma7Series = null
  ma25Series = null
  ma99Series = null
})
</script>