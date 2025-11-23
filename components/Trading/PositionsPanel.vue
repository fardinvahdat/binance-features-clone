<template>
  <div class="bg-bg-panel border-t border-border-color">
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
    </div>

    <!-- Empty State -->
    <div class="py-12 text-center">
      <p class="text-text-secondary text-sm mb-4">
        <a href="#" class="text-binance-yellow hover:underline">Log In</a> 
        or 
        <a href="#" class="text-binance-yellow hover:underline">Register Now</a> 
        to trade
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabs = [
  'Position(0)',
  'Open Orders(0)',
  'Order History',
  'Trade History',
  'Transaction History',
  'Position History',
  'Bots',
  'Assets',
]

const activeTab = ref('Position(0)')
</script>
