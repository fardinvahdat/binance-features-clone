<template>
  <div class="bg-bg-panel border border-border-color flex flex-col h-full">
    <!-- Tabs -->
    <div class="flex items-center border-b border-border-color">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 text-sm border-b-2 transition-colors"
        :class="activeTab === tab 
          ? 'border-binance-yellow text-text-primary' 
          : 'border-transparent text-text-secondary hover:text-text-primary'"
      >
        {{ tab }}
      </button>
      <div class="flex-1"></div>
      <button class="p-2 text-text-secondary hover:text-text-primary">
        <ExternalLink :size="14" />
      </button>
      <button class="p-2 text-text-secondary hover:text-text-primary mr-2">
        <MoreHorizontal :size="14" />
      </button>
    </div>

    <!-- Column Headers -->
    <div class="grid grid-cols-3 gap-2 px-4 py-2 text-xs text-text-secondary border-b border-border-color">
      <div class="text-left">Price (USDT)</div>
      <div class="text-right">Amount (BTC)</div>
      <div class="text-right">Time</div>
    </div>

    <!-- Trades List -->
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="(trade, index) in displayTrades" 
        :key="index"
        class="grid grid-cols-3 gap-2 px-4 py-1 text-xs hover:bg-bg-hover cursor-pointer"
      >
        <div 
          :class="trade.isBuyerMaker ? 'text-binance-red' : 'text-binance-green'"
        >
          {{ trade.price.toFixed(1) }}
        </div>
        <div class="text-text-primary text-right">{{ trade.amount.toFixed(3) }}</div>
        <div class="text-text-secondary text-right">{{ trade.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ExternalLink, MoreHorizontal } from 'lucide-vue-next'
import { useMarketStore } from '~/stores/market'

const marketStore = useMarketStore()

const tabs = ['Trades', 'Top Movers']
const activeTab = ref('Trades')

const displayTrades = computed(() => {
  return marketStore.recentTrades
})
</script>
