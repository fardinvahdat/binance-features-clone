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
      <button class="ml-auto p-2 text-text-secondary hover:text-text-primary mr-2">
        <Maximize2 :size="14" />
      </button>
    </div>

    <!-- Content -->
    <div v-if="activeTab === 'Chart'" class="flex-1">
      <!-- Chart content already handled by ChartContainer -->
    </div>

    <div v-else-if="activeTab === 'Info'" class="flex-1 p-4">
      <InfoPanel />
    </div>

    <div v-else-if="activeTab === 'Trading Data'" class="flex-1">
      <TradingDataGrid />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Maximize2 } from 'lucide-vue-next'

const tabs = ['Chart', 'Info', 'Trading Data']
const activeTab = ref('Chart')
</script>
