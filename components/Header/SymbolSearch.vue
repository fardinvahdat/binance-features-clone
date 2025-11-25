<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/50 z-50 flex items-start justify-start pt-16 pl-4"
      @click="close"
    >
      <div 
        class="bg-bg-panel border border-border-color rounded w-80 shadow-2xl"
        @click.stop
      >
        <!-- Search Header -->
        <div class="p-3 border-b border-border-color">
          <div class="relative">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="w-full bg-bg-primary text-text-primary pl-10 pr-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-binance-yellow"
            />
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-border-color">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="flex-1 px-4 py-2 text-xs transition-colors"
            :class="activeTab === tab 
              ? 'text-text-primary border-b-2 border-binance-yellow' 
              : 'text-text-secondary hover:text-text-primary'"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Symbol List -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Favorites -->
          <div v-if="activeTab === 'Favorites'">
            <div 
              v-for="symbol in filteredFavorites" 
              :key="symbol.symbol"
              @click="selectSymbol(symbol)"
              class="px-4 py-2 hover:bg-bg-hover cursor-pointer flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <Star :size="14" class="text-binance-yellow fill-binance-yellow" />
                <span class="text-text-primary text-sm">{{ symbol.symbol }}</span>
                <span class="text-text-secondary text-xs">Perp</span>
              </div>
              <div class="text-right">
                <div class="text-text-primary text-sm">{{ symbol.price }}</div>
                <div 
                  class="text-xs"
                  :class="symbol.change >= 0 ? 'text-binance-green' : 'text-binance-red'"
                >
                  {{ symbol.change >= 0 ? '+' : '' }}{{ symbol.change }}%
                </div>
              </div>
            </div>
            <div v-if="filteredFavorites.length === 0" class="px-4 py-8 text-center text-text-secondary text-sm">
              No favorites yet
            </div>
          </div>

          <!-- USDT-M -->
          <div v-if="activeTab === 'USDT-M'">
            <div 
              v-for="symbol in filteredUSDTSymbols" 
              :key="symbol.symbol"
              @click="selectSymbol(symbol)"
              class="px-4 py-2 hover:bg-bg-hover cursor-pointer flex items-center justify-between group"
            >
              <div class="flex items-center gap-2">
                <Star 
                  :size="14" 
                  class="text-text-secondary group-hover:text-binance-yellow cursor-pointer transition-colors"
                  :class="{ 'text-binance-yellow fill-binance-yellow': symbol.isFavorite }"
                  @click.stop="toggleFavorite(symbol)"
                />
                <span class="text-text-primary text-sm">{{ symbol.symbol }}</span>
                <span class="text-text-secondary text-xs">Perp</span>
              </div>
              <div class="text-right">
                <div class="text-text-primary text-sm">{{ symbol.price }}</div>
                <div 
                  class="text-xs"
                  :class="symbol.change >= 0 ? 'text-binance-green' : 'text-binance-red'"
                >
                  {{ symbol.change >= 0 ? '+' : '' }}{{ symbol.change }}%
                </div>
              </div>
            </div>
          </div>

          <!-- COIN-M -->
          <div v-if="activeTab === 'COIN-M'">
            <div class="px-4 py-8 text-center text-text-secondary text-sm">
              No COIN-M symbols available
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Search, Star } from 'lucide-vue-next'
import { useMarketStore } from '~/stores/market'

interface SymbolData {
  symbol: string
  price: string
  change: number
  volume: string
  isFavorite?: boolean
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  selectSymbol: [symbol: string]
}>()

const marketStore = useMarketStore()
const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const activeTab = ref('Favorites')
const tabs = ['Favorites', 'USDT-M', 'COIN-M']

const usdtSymbols = computed(() => {
  return Object.values(marketStore.tickers)
    .filter(t => t.symbol.endsWith("USDT"))
    .map(t => ({
      symbol: t.symbol,
      price: t.price.toFixed(2),
      change: t.changePercent,
      volume: t.volume,
      isFavorite: false
    }))
})


const filteredFavorites = computed(() => {
  const favorites = usdtSymbols.value.filter(s => s.isFavorite)
  if (!searchQuery.value) return favorites
  return favorites.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredUSDTSymbols = computed(() => {
  if (!searchQuery.value) return usdtSymbols.value
  return usdtSymbols.value.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectSymbol = (symbol: SymbolData) => {
  emit('selectSymbol', symbol.symbol)
  close()
}

const toggleFavorite = (symbol: SymbolData) => {
  symbol.isFavorite = !symbol.isFavorite
}

const close = () => {
  emit('close')
}

// Focus search input when dialog opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    searchQuery.value = ''
  }
})
</script>
