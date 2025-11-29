<template>
  <div class="space-y-6 text-text-primary">
    <h3 class="text-xl font-bold">
      Contract Information: {{ marketStore.currentSymbol }}
    </h3>

    <div class="mt-8 p-4 bg-bg-darker rounded-lg border border-border-color">
      <h4 class="text-md font-medium text-text-primary border-b border-border-color/50 pb-2 mb-4">
        Maximum Leverage and Margin Tiers
      </h4>

      <div class="overflow-x-auto h-[450px]">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-text-secondary sticky top-0 bg-bg-darker border-b border-border-color z-10">
              <th class="px-3 py-2 text-left font-medium">Position Notional ({{ tradingRules.marginAsset ?? 'USDT' }})</th>
              <th class="px-3 py-2 text-center font-medium">Max Leverage (x)</th>
              <th class="px-3 py-2 text-center font-medium">Initial Margin (%)</th>
              <th class="px-3 py-2 text-center font-medium">Maint. Margin Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(bracket, index) in marketStore.leverageTiers"
              :key="index"
              class="border-b border-border-color/50 last:border-b-0 hover:bg-bg-panel-hover transition-colors"
            >
              <td class="px-3 py-2 text-text-primary font-mono text-xs">
                {{ formatNotionalRange(bracket, marketStore.leverageTiers.length === index + 1) }}
              </td>
              <td class="px-3 py-2 text-center font-bold text-binance-green">
                {{ bracket.initialLeverage }}x
              </td>
              <td class="px-3 py-2 text-center text-text-primary">
                {{ (100 / bracket.initialLeverage).toFixed(3) }}%
              </td>
              <td class="px-3 py-2 text-center text-text-primary">
                {{ (bracket.maintMarginRatio * 100).toFixed(3) }}%
              </td>
            </tr>
            <tr v-if="!marketStore.leverageTiers || marketStore.leverageTiers.length === 0">
                <td colspan="4" class="text-center text-text-secondary py-4">Loading contract rules...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from "~/stores/market";
import { computed } from "vue";

const marketStore = useMarketStore();

// Safely access trading rules (which is used for marginAsset/contractType)
const tradingRules = computed(() => marketStore.tradingRules || {});

/**
 * Formats the notional range for display.
 * @param bracket The current leverage bracket object.
 * @param isLast If this is the last bracket in the list.
 */
const formatNotionalRange = (bracket: any, isLast: boolean) => {
  const cap = bracket.notionalCap;
  const floor = bracket.notionalFloor;

  const formatValue = (value: number) => {
    if (value === 0) return '0';
    // Use a short form (K, M) for large numbers
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return value.toLocaleString();
  }

  if (isLast) {
    // For the last bracket, it's typically "Above X" or "X and below"
    return `> ${formatValue(floor)}`;
  } else {
    // For intermediate brackets
    return `${formatValue(floor)} - ${formatValue(cap)}`;
  }
};
</script>