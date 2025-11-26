<template>
  <div class="h-full flex flex-col bg-bg-panel text-text-primary">
    <div
      class="flex items-center border-b border-border-color overflow-x-auto text-base"
    >
      <button
        v-for="tab in infoTabs"
        :key="tab.key"
        @click="selectedTab = tab.key"
        class="px-4 py-2 font-medium text-sm border-b-2 transition-colors"
        :class="
          selectedTab === tab.key
            ? 'border-binance-yellow text-text-primary'
            : 'border-transparent text-text-secondary hover:text-text-primary'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="selectedTab === 'coinInfo'">
        <p class="text-text-secondary">Coin Info Panel content goes here.</p>
        </div>
      <div v-else-if="selectedTab === 'tradingRules'">
        <TradingDataTradingRulesPanel />
        </div>
      <div v-else-if="selectedTab === 'leverageMargin'">
        <p class="text-text-secondary">Leverage & Margin Panel content goes here.</p>
        </div>
      <div v-else-if="selectedTab === 'fundingHistory'">
        <TradingDataFundingHistoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// Import sub-components here as they are created

const infoTabs = [
  { key: "coinInfo", label: "Coin Info" },
  { key: "tradingRules", label: "Trading Rules" },
  { key: "leverageMargin", label: "Leverage & Margin" },
  { key: "fundingHistory", label: "Funding History" },
];

const selectedTab = ref("coinInfo"); // Default to Coin Info
</script>