<template>
  <div class="h-full flex flex-col bg-bg-panel text-text-primary">
    <div
      class="flex items-center border-b border-border-color overflow-x-auto text-base p-2"
    >
      <button
        v-for="tab in infoTabs"
        :key="tab.key"
        @click="selectedTab = tab.key"
        class="px-3 py-1 rounded transition-colors text-xs"
        :class="
          selectedTab === tab.key
            ? 'bg-bg-hover text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div
        v-if="selectedTab === 'coinInfo'"
        class="h-full w-full flex items-center justify-center"
      >
        it required api key from binance to work with! (i can't log-in)
      </div>
      <div v-else-if="selectedTab === 'tradingRules'">
        <InfoTradingRules />
      </div>
      <div
        v-else-if="selectedTab === 'leverageMargin'"
        class="h-full w-full flex items-center justify-center"
      >
        it required api key from binance to work with! (i can't log-in)
      </div>
      <div v-else-if="selectedTab === 'fundingHistory'">
        <InfoFundingHistory />
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
