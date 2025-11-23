<template>
  <div ref="chartContainer" class="w-full h-40"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  chartType: string
}>()

const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  if (!chartContainer.value) return

  chartInstance = echarts.init(chartContainer.value, 'dark')
  
  const option = getChartOption(props.chartType)
  chartInstance.setOption(option)

  window.addEventListener('resize', handleResize)
})

const getChartOption = (type: string) => {
  const baseOption = {
    backgroundColor: 'transparent',
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '15%',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: generateTimeData(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#848E9C',
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#2B2F36',
        },
      },
      axisLabel: {
        color: '#848E9C',
        fontSize: 10,
      },
    },
  }

  switch (type) {
    case 'openInterest':
      return {
        ...baseOption,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#2B2F36',
          borderColor: '#2B2F36',
          textStyle: { color: '#EAECEF' },
        },
        legend: {
          data: ['Open Interest (BTC)', 'Notional Value of OI'],
          textStyle: { color: '#848E9C', fontSize: 10 },
          top: 0,
        },
        series: [
          {
            name: 'Open Interest (BTC)',
            type: 'bar',
            data: generateRandomData(20, 98000000, 99000000),
            itemStyle: { color: '#F0B90B' },
          },
          {
            name: 'Notional Value of OI',
            type: 'line',
            yAxisIndex: 0,
            data: generateRandomData(20, 8200000000, 8400000000),
            lineStyle: { color: '#848E9C', width: 1 },
            symbol: 'none',
          },
        ],
      }

    case 'longShortAccounts':
    case 'longShortPositions':
      return {
        ...baseOption,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#2B2F36',
          borderColor: '#2B2F36',
          textStyle: { color: '#EAECEF' },
        },
        legend: {
          data: ['Long/Short Ratio (Accounts)'],
          textStyle: { color: '#848E9C', fontSize: 10 },
          top: 0,
        },
        series: [
          {
            name: 'Long/Short Ratio (Accounts)',
            type: 'line',
            data: generateRandomData(20, 2.50, 2.65),
            smooth: true,
            lineStyle: { color: '#F0B90B', width: 2 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#F0B90B33' },
                { offset: 1, color: '#F0B90B00' },
              ]),
            },
            symbol: 'circle',
            symbolSize: 4,
          },
        ],
      }

    case 'longShortRatio':
      return {
        ...baseOption,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#2B2F36',
          borderColor: '#2B2F36',
          textStyle: { color: '#EAECEF' },
        },
        legend: {
          data: ['Long/Short Ratio'],
          textStyle: { color: '#848E9C', fontSize: 10 },
          top: 0,
        },
        series: [
          {
            name: 'Long/Short Ratio',
            type: 'line',
            data: generateRandomData(20, 2.40, 2.48),
            smooth: true,
            lineStyle: { color: '#F0B90B', width: 2 },
            symbol: 'circle',
            symbolSize: 4,
          },
        ],
      }

    case 'takerVolume':
      return {
        ...baseOption,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#2B2F36',
          borderColor: '#2B2F36',
          textStyle: { color: '#EAECEF' },
        },
        legend: {
          data: ['Taker Sell Volume (BTC)', 'Taker Buy Volume (BTC)'],
          textStyle: { color: '#848E9C', fontSize: 10 },
          top: 0,
        },
        series: [
          {
            name: 'Taker Sell Volume (BTC)',
            type: 'bar',
            stack: 'volume',
            data: generateRandomData(20, 0, 1000000),
            itemStyle: { color: '#F6465D' },
          },
          {
            name: 'Taker Buy Volume (BTC)',
            type: 'bar',
            stack: 'volume',
            data: generateRandomData(20, 0, 1000000),
            itemStyle: { color: '#0ECB81' },
          },
        ],
      }

    case 'basis':
      return {
        ...baseOption,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#2B2F36',
          borderColor: '#2B2F36',
          textStyle: { color: '#EAECEF' },
        },
        legend: {
          data: ['Futures Price', 'Price Index', 'Basis'],
          textStyle: { color: '#848E9C', fontSize: 10 },
          top: 0,
        },
        series: [
          {
            name: 'Futures Price',
            type: 'line',
            data: generateRandomData(20, 83000, 85000),
            smooth: true,
            lineStyle: { color: '#F0B90B', width: 1 },
            symbol: 'none',
          },
          {
            name: 'Price Index',
            type: 'line',
            data: generateRandomData(20, 83000, 85000),
            smooth: true,
            lineStyle: { color: '#848E9C', width: 1 },
            symbol: 'none',
          },
          {
            name: 'Basis',
            type: 'bar',
            yAxisIndex: 0,
            data: generateRandomData(20, -60, 0),
            itemStyle: { color: '#2B2F36' },
          },
        ],
      }

    default:
      return baseOption
  }
}

const generateTimeData = () => {
  const times = []
  const now = new Date()
  for (let i = 19; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 30 * 60 * 1000)
    times.push(time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0'))
  }
  return times
}

const generateRandomData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => 
    Math.random() * (max - min) + min
  )
}

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>
