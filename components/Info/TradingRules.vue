<template>
  <div class="space-y-6 text-text-primary">
    <h3 class="text-xl font-bold">
      Trading Rules: {{ marketStore.currentSymbol }}
    </h3>

    <div v-if="marketStore.tradingRules" class="p-4 bg-bg-darker rounded-lg border border-border-color">
      <div class="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
        <div class="flex flex-col">
          <span class="text-text-secondary">Symbol</span>
          <span class="font-mono">{{ marketStore.tradingRules.symbol }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-text-secondary">Contract Type</span>
          <span class="font-mono">{{ marketStore.tradingRules.contractType }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-text-secondary">Base Asset</span>
          <span class="font-mono">{{ marketStore.tradingRules.baseAsset }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-text-secondary">Quote Asset</span>
          <span class="font-mono">{{ marketStore.tradingRules.quoteAsset }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-text-secondary">Max Open Orders</span>
          <span class="font-mono">{{ formatNumber(marketStore.tradingRules.maxNumOrders, 0) }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-text-secondary">Max Algo Orders</span>
          <span class="font-mono">{{ formatNumber(marketStore.tradingRules.maxNumAlgoOrders, 0) }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-text-secondary">Market Status</span>
          <span :class="marketStore.tradingRules.status === 'TRADING' ? 'text-binance-green' : 'text-binance-red'">
            {{ marketStore.tradingRules.status }}
          </span>
        </div>
      </div>

      <div class="my-4 h-px bg-border-color"></div>

      <div class="space-y-3">
        <h4 class="text-md font-medium text-text-primary">Price Rules</h4>
        <div class="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <div class="flex flex-col">
            <span class="text-text-secondary">Price Precision (Digits)</span>
            <span class="font-mono">{{ marketStore.tradingRules.pricePrecision }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-text-secondary">Tick Size (Min Change)</span>
            <span class="font-mono">{{ formatNumber(marketStore.tradingRules.tickSize, marketStore.tradingRules.pricePrecision) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-text-secondary">Min Price</span>
            <span class="font-mono">{{ formatNumber(marketStore.tradingRules.minPrice, marketStore.tradingRules.pricePrecision) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-text-secondary">Max Price</span>
            <span class="font-mono">{{ formatNumber(marketStore.tradingRules.maxPrice, marketStore.tradingRules.pricePrecision) }}</span>
          </div>
        </div>
      </div>

      <div class="my-4 h-px bg-border-color"></div>

      <div class="space-y-3">
        <h4 class="text-md font-medium text-text-primary">Quantity Rules</h4>
        <div class="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <div class="flex flex-col">
            <span class="text-text-secondary">Quantity Precision (Digits)</span>
            <span class="font-mono">{{ marketStore.tradingRules.quantityPrecision }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-text-secondary">Step Size (Min Quantity Increment)</span>
            <span class="font-mono">{{ formatNumber(marketStore.tradingRules.stepSize, marketStore.tradingRules.quantityPrecision) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-text-secondary">Min Quantity</span>
            <span class="font-mono">{{ formatNumber(marketStore.tradingRules.minQty, marketStore.tradingRules.quantityPrecision) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-text-secondary">Max Quantity</span>
            <span class="font-mono">{{ formatNumber(marketStore.tradingRules.maxQty, marketStore.tradingRules.quantityPrecision) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-text-secondary">Min Notional (USD)</span>
            <span class="font-mono">${{ formatNumber(marketStore.tradingRules.minNotional, 2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-text-secondary">
      <p>Loading trading rules for {{ marketStore.currentSymbol }}...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from "~/stores/market";

const marketStore = useMarketStore();

/**
 * Formats a number using the specified precision, removing trailing zeros if precision > 0.
 *
 * @param num The number to format.
 * @param precision The number of decimal places to show.
 */
const formatNumber = (num: number, precision: number) => {
    // Check if precision is valid and use toFixed to enforce it
    if (precision >= 0) {
        // toLocaleString with minimumFractionDigits is often better for presentation
        // but toFixed is required for strict precision adherence from Binance API
        const fixed = num.toFixed(precision);
        // Use replace to strip unnecessary trailing zeros, like Binance does,
        // unless the number is an integer (precision 0)
        return precision > 0 ? fixed.replace(/\.?0+$/, '') : fixed;
    }
    return num.toString();
};
</script>