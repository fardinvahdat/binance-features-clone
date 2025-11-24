<template>
  <div class="w-full h-[250px]">
    <TVChart :options="chartOptions" :key="interval" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMarketStore } from "~/stores/market";
import { storeToRefs } from "pinia";

const marketStore = useMarketStore();
const { interval } = storeToRefs(marketStore);
const chartOptions = computed(() => ({
  symbol: marketStore.currentSymbol,
  interval: marketStore.interval,
  theme: marketStore.theme,
  showHeader: marketStore.showHeader,
  autosize: true,
  container_id: "tradingview_chart",
}));
</script>
