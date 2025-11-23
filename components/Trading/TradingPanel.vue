<template>
  <div class="bg-bg-panel border border-border-color flex flex-col">
    <!-- Mode Tabs -->
    <div class="flex items-center gap-2 px-4 py-2 border-b border-border-color">
      <button 
        v-for="mode in tradingModes" 
        :key="mode"
        @click="selectedMode = mode"
        class="px-3 py-1 text-sm rounded"
        :class="selectedMode === mode 
          ? 'bg-bg-hover text-text-primary' 
          : 'text-text-secondary hover:text-text-primary'"
      >
        {{ mode }}
      </button>
      <button class="px-3 py-1 text-sm text-text-secondary hover:text-text-primary rounded">
        S
      </button>
    </div>

    <!-- Order Type Tabs -->
    <div class="flex items-center border-b border-border-color">
      <button 
        v-for="type in orderTypes" 
        :key="type"
        @click="selectedOrderType = type"
        class="px-4 py-2 text-sm border-b-2 transition-colors"
        :class="selectedOrderType === type 
          ? 'border-binance-yellow text-text-primary' 
          : 'border-transparent text-text-secondary hover:text-text-primary'"
      >
        {{ type }}
      </button>
      <div class="flex-1"></div>
      <button class="p-2 text-text-secondary hover:text-text-primary mr-2">
        <ChevronDown :size="14" />
      </button>
      <button class="p-2 text-text-secondary hover:text-text-primary mr-2">
        <Info :size="14" />
      </button>
    </div>

    <!-- Trading Form -->
    <div class="p-4 space-y-4">
      <!-- Available Balance -->
      <div class="flex items-center justify-between text-xs">
        <span class="text-text-secondary">Avbl</span>
        <div class="flex items-center gap-1">
          <span class="text-text-primary">-- USDT</span>
          <RefreshCw :size="12" class="text-text-secondary" />
        </div>
      </div>

      <!-- Price Input -->
      <div>
        <label class="text-xs text-text-secondary mb-1 block">Price</label>
        <div class="flex items-center bg-bg-primary border border-border-color rounded px-3 py-2">
          <input 
            type="text" 
            value="83,682.7"
            class="flex-1 bg-transparent text-text-primary outline-none text-sm"
          />
          <span class="text-text-secondary text-xs ml-2">USDT</span>
          <button class="ml-2 px-2 py-0.5 bg-bg-hover text-text-primary text-xs rounded">
            BBO
          </button>
        </div>
      </div>

      <!-- Size Input -->
      <div>
        <label class="text-xs text-text-secondary mb-1 block">Size</label>
        <div class="flex items-center bg-bg-primary border border-border-color rounded px-3 py-2">
          <input 
            type="text" 
            placeholder="0"
            class="flex-1 bg-transparent text-text-primary outline-none text-sm"
          />
          <span class="text-text-secondary text-xs ml-2">BTC</span>
          <ChevronDown :size="14" class="text-text-secondary ml-1" />
        </div>
      </div>

      <!-- Slider -->
      <div class="relative">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value="0"
          class="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between text-xs text-text-secondary mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2">
        <button class="w-full py-3 bg-binance-yellow text-bg-primary font-semibold rounded hover:opacity-90 transition-opacity">
          Register Now
        </button>
        <button class="w-full py-3 bg-bg-hover text-text-primary font-semibold rounded hover:bg-border-color transition-colors">
          Log In
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, Info, RefreshCw } from 'lucide-vue-next'

const tradingModes = ['Cross', '20x', 'S']
const selectedMode = ref('Cross')

const orderTypes = ['Limit', 'Market', 'Stop Limit']
const selectedOrderType = ref('Limit')
</script>
