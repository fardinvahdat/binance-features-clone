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
  symbol: `${marketStore.currentSymbol}.P`,
  interval: marketStore.interval,
  theme: "dark",
  autosize: true,
  container_id: "tradingview_chart",
  hide_top_toolbar: true,
}));
</script>
