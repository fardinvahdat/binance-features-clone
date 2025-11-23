<template>
  <div ref="depthChartContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useMarketStore } from '~/stores/market'

const depthChartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null
let isDestroyed = false

const marketStore = useMarketStore()

onMounted(async () => {
  if (!depthChartContainer.value) return

  // Wait for next tick to ensure DOM is ready and has size
  await nextTick()
  
  if (!depthChartContainer.value || isDestroyed) return

  // Check if container has valid dimensions
  const width = depthChartContainer.value.clientWidth
  const height = depthChartContainer.value.clientHeight
  
  if (width === 0 || height === 0) {
    console.warn('Container has no dimensions, waiting...')
    // Retry after a short delay
    setTimeout(() => {
      if (!isDestroyed && depthChartContainer.value) {
        initChart()
      }
    }, 100)
    return
  }

  initChart()
})

const initChart = () => {
  if (!depthChartContainer.value || isDestroyed) return
  
  try {
    chartInstance = echarts.init(depthChartContainer.value, 'dark')
    
    updateChart()

    // Watch for order book updates
    watch(() => [marketStore.bids, marketStore.asks], () => {
      if (!isDestroyed) {
        updateChart()
      }
    }, { deep: true })

    // Handle resize with ResizeObserver
    resizeObserver = new ResizeObserver(() => {
      if (chartInstance && !isDestroyed) {
        chartInstance.resize()
      }
    })

    resizeObserver.observe(depthChartContainer.value)
  } catch (error) {
    console.error('Error initializing depth chart:', error)
  }
}

const updateChart = () => {
  if (!chartInstance || isDestroyed) return

  const bids = marketStore.bids
  const asks = marketStore.asks

  if (bids.length === 0 || asks.length === 0) return

  const option = {
    backgroundColor: '#1E2329',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#848E9C',
          width: 1,
        },
      },
      backgroundColor: '#2B2F36',
      borderColor: '#2B2F36',
      textStyle: {
        color: '#EAECEF',
      },
    },
    grid: {
      left: '3%',
      right: '3%',
      top: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      scale: true,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#2B2F36',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#848E9C',
        },
      },
      axisLabel: {
        color: '#848E9C',
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#2B2F36',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#848E9C',
        },
      },
      axisLabel: {
        color: '#848E9C',
      },
    },
    series: [
      {
        name: 'Bids',
        type: 'line',
        data: bids.map(b => [b.price, b.sum]),
        smooth: true,
        lineStyle: {
          color: '#0ECB81',
          width: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0ECB8166' },
            { offset: 1, color: '#0ECB8100' },
          ]),
        },
        symbol: 'none',
      },
      {
        name: 'Asks',
        type: 'line',
        data: asks.map(a => [a.price, a.sum]),
        smooth: true,
        lineStyle: {
          color: '#F6465D',
          width: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F6465D66' },
            { offset: 1, color: '#F6465D00' },
          ]),
        },
        symbol: 'none',
      },
    ],
  }

  chartInstance.setOption(option)
}

onUnmounted(() => {
  isDestroyed = true
  
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>