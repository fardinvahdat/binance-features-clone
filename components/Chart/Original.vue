<template>
  <div ref="chartContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { useMarketStore } from '~/stores/market';
import { storeToRefs } from 'pinia';

const marketStore = useMarketStore();
const { currentSymbol, interval, klines } = storeToRefs(marketStore);

const chartContainer = ref<HTMLDivElement | null>(null);
let chart: ReturnType<typeof createChart> | null = null;
let candlestickSeries: CandlestickSeries | null = null;

// Function to initialize or reset the chart
const initChart = () => {
  if (!chartContainer.value) return;

  // Clean up existing chart if symbol/interval changes
  if (chart) {
    chart.remove();
    chart = null;
    candlestickSeries = null;
  }

  // Create new chart
  chart = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    height: chartContainer.value.clientHeight,
    layout: {
      background: { type: 'solid', color: '#1e1e1e' }, // Dark theme
      textColor: '#d1d4dc',
    },
    grid: {
      vertLines: { color: '#2a2a2a' },
      horLines: { color: '#2a2a2a' },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
  });

  // Add candlestick series
  candlestickSeries = chart.addCandlestickSeries({
    upColor: '#26a69a', // Green for up
    downColor: '#ef5350', // Red for down
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
  });

  // Load initial data
  updateChartData();
};

// Function to transform and set Kline data to chart format
const updateChartData = () => {
  if (!candlestickSeries || klines.value.length === 0) return;

  // Transform store klines to Lightweight Charts format
  const chartData = klines.value.map((kline) => ({
    time: kline.time, // Unix timestamp (seconds)
    open: kline.open,
    high: kline.high,
    low: kline.low,
    close: kline.close,
  }));

  // Set all data at once (efficient)
  candlestickSeries.setData(chartData);

  // Auto-zoom to visible data
  chart?.timeScale().fitContent();
};

// Handle window resize
const handleResize = () => {
  if (chart && chartContainer.value) {
    chart.applyOptions({
      width: chartContainer.value.clientWidth,
      height: chartContainer.value.clientHeight,
    });
  }
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

// Watch for symbol or interval changes (re-init chart)
watch([currentSymbol, interval], () => {
  initChart();
});

// Watch for klines updates (real-time from WS)
watch(klines, () => {
  updateChartData();
}, { deep: true }); // Deep watch since klines is array

onUnmounted(() => {
  if (chart) {
    chart.remove();
  }
  window.removeEventListener('resize', handleResize);
});
</script>