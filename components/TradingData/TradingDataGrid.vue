<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-4 p-4 h-full">
    <!-- Open Interest -->
    <div class="bg-bg-primary border border-border-color rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-text-primary text-sm">Open Interest</span>
        <div class="flex items-center gap-2 text-xs">
          <button 
            v-for="interval in timeIntervals" 
            :key="interval"
            class="text-text-secondary hover:text-text-primary"
          >
            {{ interval }}
          </button>
          <button class="text-text-secondary hover:text-text-primary">
            <Info :size="12" />
          </button>
        </div>
      </div>
      <MiniChart chart-type="openInterest" />
    </div>

    <!-- Top Trader Long/Short Ratio (Accounts) -->
    <div class="bg-bg-primary border border-border-color rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-text-primary text-sm">Top Trader Long/Short Ratio (Accounts)</span>
        <div class="flex items-center gap-2 text-xs">
          <button 
            v-for="interval in timeIntervals" 
            :key="interval"
            class="text-text-secondary hover:text-text-primary"
          >
            {{ interval }}
          </button>
          <button class="text-text-secondary hover:text-text-primary">
            <Info :size="12" />
          </button>
        </div>
      </div>
      <MiniChart chart-type="longShortAccounts" />
    </div>

    <!-- Top Trader Long/Short Ratio (Positions) -->
    <div class="bg-bg-primary border border-border-color rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-text-primary text-sm">Top Trader Long/Short Ratio (Positions)</span>
        <div class="flex items-center gap-2 text-xs">
          <button 
            v-for="interval in timeIntervals" 
            :key="interval"
            class="text-text-secondary hover:text-text-primary"
          >
            {{ interval }}
          </button>
          <button class="text-text-secondary hover:text-text-primary">
            <Info :size="12" />
          </button>
        </div>
      </div>
      <MiniChart chart-type="longShortPositions" />
    </div>

    <!-- Long/Short Ratio -->
    <div class="bg-bg-primary border border-border-color rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-text-primary text-sm">Long/Short Ratio</span>
        <div class="flex items-center gap-2 text-xs">
          <button 
            v-for="interval in timeIntervals" 
            :key="interval"
            class="text-text-secondary hover:text-text-primary"
          >
            {{ interval }}
          </button>
          <button class="text-text-secondary hover:text-text-primary">
            <Info :size="12" />
          </button>
        </div>
      </div>
      <MiniChart chart-type="longShortRatio" />
    </div>

    <!-- Taker Buy/Sell Volume -->
    <div class="bg-bg-primary border border-border-color rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-text-primary text-sm">Taker Buy/Sell Volume</span>
        <div class="flex items-center gap-2 text-xs">
          <button 
            v-for="interval in timeIntervals" 
            :key="interval"
            class="text-text-secondary hover:text-text-primary"
          >
            {{ interval }}
          </button>
          <button class="text-text-secondary hover:text-text-primary">
            <Info :size="12" />
          </button>
        </div>
      </div>
      <MiniChart chart-type="takerVolume" />
    </div>

    <!-- Basis -->
    <div class="bg-bg-primary border border-border-color rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-text-primary text-sm">Basis</span>
        <div class="flex items-center gap-2 text-xs">
          <button 
            v-for="interval in timeIntervals" 
            :key="interval"
            class="text-text-secondary hover:text-text-primary"
          >
            {{ interval }}
          </button>
          <button class="text-text-secondary hover:text-text-primary">
            <Info :size="12" />
          </button>
        </div>
      </div>
      <MiniChart chart-type="basis" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Info } from 'lucide-vue-next'

const timeIntervals = ['5m', '15m', '30m', '1h', '4h']
</script>
