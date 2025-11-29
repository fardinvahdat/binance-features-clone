<template>
  <div class="bg-bg-panel px-4 py-1 overflow-x-auto my-2 min-h-fit">
    <div class="flex items-center gap-6 text-xs whitespace-nowrap">
      <div
        v-for="(ticker, index) in tickers"
        :key="index"
        class="flex items-center gap-2 cursor-pointer hover:bg-bg-hover px-2 py-1 rounded"
      >
        <span class="text-text-secondary">{{ ticker.symbol }}</span>

        <span
          :class="
            ticker.changePercent >= 0
              ? 'text-binance-green'
              : 'text-binance-red'
          "
        >
          {{ ticker.price.toFixed(2) }}
        </span>

        <span
          :class="
            ticker.changePercent >= 0
              ? 'text-binance-green'
              : 'text-binance-red'
          "
        >
          {{ ticker.changePercent >= 0 ? "+" : ""
          }}{{ ticker.changePercent.toFixed(2) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const marketStore = useMarketStore();
const tickers = computed(() => Object.values(marketStore.tickers).slice(0, 20));
</script>
