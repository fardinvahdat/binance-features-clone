<template>
  <div class="w-full h-[250px]">
    <TVChart
      :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMarketStore } from "~/stores/market";

const marketStore = useMarketStore();

// Convert symbol to TradingView format (e.g., BTCUSDT -> BINANCE:BTCUSDT)
const chartOptions = ref({
  theme: "dark",
  autosize: true,
  symbol: "BINANCE:BTCUSDT.P",
  timezone: "",
  height: "400",
  container_id: "tradingview_chart",
  locale: "en",
  interval: "D",
});
</script>
