<template>
  <div class="bg-bg-panel border border-border-color flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border-color">
      <span class="text-text-primary text-sm font-semibold">Order Book</span>
      <div class="flex items-center gap-2">
        <button class="text-text-secondary hover:text-text-primary p-1">
          <MoreHorizontal :size="14" />
        </button>
      </div>
    </div>

    <!-- View Mode Selector -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border-color">
      <div class="flex items-center gap-2">
        <button 
          v-for="mode in viewModes" 
          :key="mode.value"
          @click="selectedViewMode = mode.value"
          class="p-1 rounded"
          :class="selectedViewMode === mode.value 
            ? 'bg-bg-hover text-text-primary' 
            : 'text-text-secondary hover:text-text-primary'"
        >
          <component :is="mode.icon" :size="16" />
        </button>
      </div>
      
      <div class="flex items-center gap-1 text-xs">
        <span class="text-text-secondary">0.1</span>
        <ChevronDown :size="12" class="text-text-secondary" />
      </div>
    </div>

    <!-- Column Headers -->
    <div class="grid grid-cols-3 gap-2 px-4 py-2 text-xs text-text-secondary border-b border-border-color">
      <div class="text-left">Price (USDT)</div>
      <div class="text-right">Size (BTC)</div>
      <div class="text-right">Sum (BTC)</div>
    </div>

    <!-- Order Book Content -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <!-- Asks (Red) -->
      <div class="flex-1 overflow-y-auto flex flex-col-reverse">
        <div 
          v-for="(ask, index) in displayAsks" 
          :key="`ask-${index}`"
          class="grid grid-cols-3 gap-2 px-4 py-0.5 text-xs relative hover:bg-bg-hover cursor-pointer"
        >
          <div 
            class="absolute right-0 top-0 bottom-0 bg-binance-red opacity-10"
            :style="{ width: `${(ask.sum / maxAskSum) * 100}%` }"
          ></div>
          <div class="text-binance-red relative z-10">{{ ask.price.toFixed(1) }}</div>
          <div class="text-text-primary text-right relative z-10">{{ ask.size.toFixed(3) }}</div>
          <div class="text-text-primary text-right relative z-10">{{ ask.sum.toFixed(3) }}</div>
        </div>
      </div>

      <!-- Current Price -->
      <div class="px-4 py-2 border-y border-border-color flex items-center justify-between">
        <div 
          class="text-xl font-semibold"
          :class="marketStore.isPriceUp ? 'text-binance-green' : 'text-binance-red'"
        >
          {{ marketStore.formattedPrice }}
          <span 
            class="text-xs ml-2"
            :class="marketStore.isPriceUp ? 'text-binance-green' : 'text-binance-red'"
          >
            {{ marketStore.isPriceUp ? '↑' : '↓' }}
          </span>
        </div>
        <div class="text-xs text-text-secondary">
          {{ formattedSpread }}
        </div>
      </div>

      <!-- Bids (Green) -->
      <div class="flex-1 overflow-y-auto">
        <div 
          v-for="(bid, index) in displayBids" 
          :key="`bid-${index}`"
          class="grid grid-cols-3 gap-2 px-4 py-0.5 text-xs relative hover:bg-bg-hover cursor-pointer"
        >
          <div 
            class="absolute right-0 top-0 bottom-0 bg-binance-green opacity-10"
            :style="{ width: `${(bid.sum / maxBidSum) * 100}%` }"
          ></div>
          <div class="text-binance-green relative z-10">{{ bid.price.toFixed(1) }}</div>
          <div class="text-text-primary text-right relative z-10">{{ bid.size.toFixed(3) }}</div>
          <div class="text-text-primary text-right relative z-10">{{ bid.sum.toFixed(3) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MoreHorizontal, ChevronDown, LayoutGrid, Menu, Grid3x3 } from 'lucide-vue-next'
import { useMarketStore } from '~/stores/market'

const marketStore = useMarketStore()

const viewModes = [
  { value: 'all', icon: LayoutGrid },
  { value: 'asks', icon: Menu },
  { value: 'bids', icon: Grid3x3 },
]

const selectedViewMode = ref('all')

const displayAsks = computed(() => {
  return marketStore.asks.slice(0, 15)
})

const displayBids = computed(() => {
  return marketStore.bids.slice(0, 15)
})

const maxAskSum = computed(() => {
  if (displayAsks.value.length === 0) return 1
  return Math.max(...displayAsks.value.map(a => a.sum))
})

const maxBidSum = computed(() => {
  if (displayBids.value.length === 0) return 1
  return Math.max(...displayBids.value.map(b => b.sum))
})

const formattedSpread = computed(() => {
  if (marketStore.asks.length === 0 || marketStore.bids.length === 0) return '0.00'
  const spread = marketStore.asks[0].price - marketStore.bids[0].price
  return spread.toFixed(2)
})
</script>
