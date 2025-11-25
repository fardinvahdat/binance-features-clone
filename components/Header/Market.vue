<template>
  <div class="bg-bg-panel px-4 py-1 flex items-center justify-between border-b border-border-color">
    <div class="flex items-center gap-6">
      <!-- Symbol Selector -->
      <div 
        @click="showSymbolSearch = true"
        class="flex items-center gap-2 cursor-pointer hover:bg-bg-hover px-2 py-1 rounded"
      >
        <div class="w-6 h-6 rounded-full bg-binance-yellow flex items-center justify-center text-bg-primary font-semibold text-xs">
          ₿
        </div>
        <div>
          <div class="flex items-center gap-1">
            <span class="text-text-primary font-semibold">{{ marketStore.currentSymbol }}</span>
            <!-- <span class="text-text-secondary text-xs">Perp</span> -->
            <ChevronDown :size="14" class="text-text-secondary" />
          </div>
        </div>
      </div>

      <!-- Current Price -->
      <div>
        <div 
          class="text-2xl font-semibold transition-colors duration-200"
          :class="priceColorClass"
        >
          {{ marketStore.formattedPrice }}
        </div>
        <div class="text-xs text-text-secondary">{{ formattedPriceChange }}</div>
      </div>

      <!-- Market Info -->
      <div class="flex items-center gap-6 text-[10px]">
        <div>
          <div class="text-text-secondary text-nowrap">Mark Price</div>
          <div class="text-text-primary">{{ marketStore.formattedPrice }}</div>
        </div>
        <div>
          <div class="text-text-secondary text-nowrap">Index Price</div>
          <div class="text-text-primary">{{ marketStore.formattedPrice }}</div>
        </div>
        <div>
          <div class="text-text-secondary flex items-center gap-1">
            Funding / Countdown
          </div>
          <div class="flex items-center gap-1">
            <span 
              class="font-semibold"
              :class="fundingRateClass"
            >
              {{ formattedFundingRate }}
            </span>
          </div>
        </div>
        <div>
          <div class="text-text-secondary">24h High</div>
          <div class="text-text-primary">{{ high24h }}</div>
        </div>
        <div>
          <div class="text-text-secondary">24h Low</div>
          <div class="text-text-primary">{{ low24h }}</div>
        </div>
        <div>
          <div class="text-text-secondary">24h Volume(BTC)</div>
          <div class="text-text-primary">{{ marketStore.volume24h }}</div>
        </div>
        <div>
          <div class="text-text-secondary">24h Volume(USDT)</div>
          <div class="text-text-primary">{{ marketStore.quoteVolume24h }}</div>
        </div>
        
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button class="text-text-secondary hover:text-text-primary p-1">
        <Star :size="16" />
      </button>
      <button class="text-text-secondary hover:text-text-primary p-1">
        <MoreHorizontal :size="16" />
      </button>
    </div>
  </div>

  <!-- Symbol Search Dialog -->
  <SymbolSearch 
    :is-open="showSymbolSearch" 
    @close="showSymbolSearch = false"
    @select-symbol="handleSymbolChange"
  />
</template>

<script setup lang="ts">
import { ChevronDown, Info, Star, MoreHorizontal } from 'lucide-vue-next'
import { useMarketStore } from '~/stores/market'
import { computed, ref } from 'vue'
import SymbolSearch from './SymbolSearch.vue'

const marketStore = useMarketStore()
const showSymbolSearch = ref(false)

const handleSymbolChange = (symbol: string) => {
  marketStore.setSymbol(symbol)
}

const priceColorClass = computed(() => {
  if (marketStore.isPriceUp) return 'text-binance-green'
  if (marketStore.isPriceDown) return 'text-binance-red'
  return 'text-text-primary'
})

const formattedPriceChange = computed(() => {
  const percent = parseFloat(marketStore.priceChangePercent)
  const sign = percent >= 0 ? '+' : ''
  const colorClass = percent >= 0 ? 'text-binance-green' : 'text-binance-red'
  
  return marketStore.ticker24h 
    ? `${sign}${marketStore.ticker24h.priceChange} ${sign}${percent}%`
    : '0.00 +0.00%'
})

const formattedFundingRate = computed(() => {
  return '0.0042%'
})

const fundingRateClass = computed(() => {
  return 'text-binance-green'
})

const ticker = computed(() => marketStore.tickers[marketStore.currentSymbol])

const high24h = computed(() => ticker.value?.highPrice ?? 0)
const low24h = computed(() => ticker.value?.lowPrice ?? 0)
const volume24h = computed(() => ticker.value?.volume ?? 0)
</script>