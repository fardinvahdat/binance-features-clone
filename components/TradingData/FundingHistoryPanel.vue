<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 gap-8">
      <div class="space-y-3 text-sm">
        <h3 class="text-lg font-semibold border-b border-border-color pb-2">
          Real-Time Funding Data
        </h3>

        <div class="flex justify-between text-text-secondary">
          <span>Symbol</span>
          <span class="text-text-primary">{{ marketStore.currentSymbol }} Perp</span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Interval</span>
          <span class="text-text-primary">8h</span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Time to Next Funding</span>
          <span class="text-binance-green">
            {{ formatNextFundingTime(marketStore.nextFundingTime) }}
          </span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Funding Rate</span>
          <span class="text-text-primary">
            {{ formatRate(marketStore.fundingRate) }}
          </span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Interest Rate</span>
          <span class="text-text-primary">0.0100%</span>
        </div>
        <div class="flex justify-between text-text-secondary">
          <span>Funding Cap / Floor</span>
          <span class="text-text-primary">0.3000% / -0.3000%</span>
        </div>
      </div>

      <div class="h-64">
        <h3 class="text-lg font-semibold border-b border-border-color pb-2">
          Funding Rate: {{ formatRate(marketStore.fundingRate) }}
        </h3>
        <div class="flex items-center justify-center h-full bg-bg-darker">
          <span class="text-text-secondary"
            >Historical Funding Rate Chart (e.g., ApexCharts)</span
          >
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h3 class="text-lg font-semibold border-b border-border-color pb-2 mb-4">
        Funding Rate History
      </h3>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-text-secondary border-b border-border-color">
              <th class="px-3 py-2 text-left font-medium">Time</th>
              <th class="px-3 py-2 text-left font-medium">Funding Interval</th>
              <th class="px-3 py-2 text-left font-medium">Funding Rate</th>
              <th class="px-3 py-2 text-left font-medium">Mark Price</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in marketStore.fundingHistory"
              :key="index"
              class="border-b border-border-color/50"
            >
              <td class="px-3 py-2 text-text-primary">{{ item.time }}</td>
              <td class="px-3 py-2 text-text-secondary">{{ item.interval }}</td>
              <td class="px-3 py-2" :class="rateColor(item.rate)">
                {{ formatRate(item.rate) }}
              </td>
              <td class="px-3 py-2 text-text-primary">
                {{ formatPrice(item.markPrice) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from "~/stores/market";

const marketStore = useMarketStore();

// --- Formatting Functions ---

const formatRate = (rate: number) => {
  const percentage = rate * 100;
  return `${percentage.toFixed(4)}%`;
};

const formatPrice = (price: number) => {
  return price.toFixed(8); // Displaying high precision like in the screenshot
};

const formatNextFundingTime = (timeStr: string) => {
  // In a real app, this would be a proper calculation based on the next funding timestamp.
  // Placeholder based on screenshot: "00:30:35"
  return timeStr || "Calculating...";
};

const rateColor = (rate: number) => {
  if (rate > 0) return "text-binance-green";
  if (rate < 0) return "text-binance-red";
  return "text-text-primary";
};

// --- Mock Data (for initial testing) ---
// Since we don't have the API logic for this yet, we'll populate the store with mock data
// to match the screenshot structure for visualization.

marketStore.nextFundingTime = "00:30:35";
marketStore.fundingRate = 0.00040339; // 0.0403%

marketStore.fundingHistory = [
  {
    time: "2025-11-26 03:30",
    interval: "8h",
    rate: 0.00040388,
    markPrice: 87324.10000000,
  },
  {
    time: "2025-11-25 19:30",
    interval: "8h",
    rate: -0.000319,
    markPrice: 86946.50000000,
  },
  {
    time: "2025-11-25 11:30",
    interval: "8h",
    rate: 0.001996,
    markPrice: 87363.20000000,
  },
  {
    time: "2025-11-25 03:30",
    interval: "8h",
    rate: -0.000289,
    markPrice: 88247.8481493,
  },
  // Add more entries here to match the screenshot
];
</script>