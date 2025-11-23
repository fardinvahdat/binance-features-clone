<template>
  <div class="bg-bg-primary px-4 py-1 overflow-x-auto">
    <div class="flex items-center gap-6 text-xs whitespace-nowrap">
      <div 
        v-for="ticker in tickers" 
        :key="ticker.symbol"
        class="flex items-center gap-2 cursor-pointer hover:bg-bg-hover px-2 py-1 rounded"
      >
        <span class="text-text-secondary">{{ ticker.symbol }}</span>
        <span 
          :class="ticker.change >= 0 ? 'text-binance-green' : 'text-binance-red'"
        >
          {{ ticker.price }}
        </span>
        <span 
          :class="ticker.change >= 0 ? 'text-binance-green' : 'text-binance-red'"
        >
          {{ ticker.change >= 0 ? '+' : '' }}{{ ticker.change }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tickers = ref([
  { symbol: 'BTCUSDT', price: '512.93', change: -1.46 },
  { symbol: 'ETHUSDT', price: '3,241.56', change: -0.96 },
  { symbol: 'BNBUSDT', price: '623.45', change: -4.75 },
])
</script>
