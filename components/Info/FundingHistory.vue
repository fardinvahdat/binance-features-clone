<template>
  <div class="space-y-6 text-text-primary">
    <h3 class="text-xl font-bold">
      Funding Rate & Info: {{ marketStore.currentSymbol }}
    </h3>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-3 text-sm p-4 bg-bg-darker rounded-lg border border-border-color">
        <div class="flex justify-between text-text-secondary">
          <span>Symbol</span>
          <span class="text-text-primary font-mono">{{ marketStore.currentSymbol }} Perp</span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Interval</span>
          <span class="text-text-primary">8h</span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Time to Next Funding</span>
          <span class="text-binance-green font-mono">
            {{ timeToNextFunding }}
          </span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Funding Rate (Real-time)</span>
          <span class="font-bold" :class="rateColor(marketStore.fundingRate)">
            {{ formatRate(marketStore.fundingRate) }}
          </span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Mark Price (Real-time)</span>
          <span class="font-mono">{{ formatPrice(marketStore.markPrice) }}</span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Index Price (Real-time)</span>
          <span class="font-mono">{{ formatPrice(marketStore.indexPrice) }}</span>
        </div>
      </div>

      <div class="p-4 bg-bg-darker rounded-lg border border-border-color h-64">
        <h4 class="text-md font-medium text-text-primary mb-2">
          Historical Funding Rate
        </h4>
        <div class="flex items-center justify-center h-full">
          <span class="text-text-secondary text-sm"
            >Chart integration using vue3-apexcharts goes here.</span
          >
        </div>
      </div>
    </div>

    <div class="mt-8 p-4 bg-bg-darker rounded-lg border border-border-color">
      <h4 class="text-md font-medium text-text-primary border-b border-border-color/50 pb-2 mb-2">
        Funding Rate History
      </h4>

      <div class="overflow-x-auto h-96">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-text-secondary sticky top-0 bg-bg-darker border-b border-border-color">
              <th class="px-3 py-2 text-left font-medium">Time (UTC)</th>
              <th class="px-3 py-2 text-left font-medium">Funding Rate</th>
              <th class="px-3 py-2 text-left font-medium">Mark Price</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in marketStore.fundingHistory"
              :key="item.fundingTime"
              class="border-b border-border-color/50 last:border-b-0 hover:bg-bg-panel-hover transition-colors"
            >
              <td class="px-3 py-1.5 text-text-primary font-mono text-xs">{{ formatTimestamp(item.fundingTime) }}</td>
              <td class="px-3 py-1.5 font-bold" :class="rateColor(item.fundingRate)">
                {{ formatRate(item.fundingRate) }}
              </td>
              <td class="px-3 py-1.5 text-text-primary font-mono">
                {{ formatPrice(item.markPrice) }}
              </td>
            </tr>
            <tr v-if="marketStore.fundingHistory.length === 0">
                <td colspan="3" class="text-center text-text-secondary py-4">No funding history found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from "~/stores/market";
import { useIntervalFn } from "@vueuse/core";
import { computed, ref } from "vue";

const marketStore = useMarketStore();

// --- Formatting & Logic ---

const formatRate = (rate: number) => {
  const percentage = rate * 100;
  // Ensure sign is shown if not zero
  const sign = percentage > 0 ? "+" : "";
  return `${sign}${percentage.toFixed(4)}%`;
};

const formatPrice = (price: number) => {
  return price.toFixed(
    marketStore.tradingRules?.pricePrecision ?? 4
  );
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toISOString().replace("T", " ").slice(0, 19);
};

const rateColor = (rate: number) => {
  if (rate > 0) return "text-binance-green";
  if (rate < 0) return "text-binance-red";
  return "text-text-primary";
};

// --- Time to Next Funding Countdown ---

const timeRemaining = ref(0);

const calculateTimeRemaining = () => {
  const now = Date.now();
  const nextTime = marketStore.nextFundingTime;

  if (nextTime > now) {
    timeRemaining.value = nextTime - now;
  } else {
    // If the next funding time is in the past, reset to 8 hours (or fetch a new nextFundingTime)
    timeRemaining.value = 0;
  }
};

// Initial calculation and start the countdown timer (runs every second)
calculateTimeRemaining();
useIntervalFn(calculateTimeRemaining, 1000);

const timeToNextFunding = computed(() => {
  if (timeRemaining.value <= 0) return "00:00:00";

  const totalSeconds = Math.floor(timeRemaining.value / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});
</script>