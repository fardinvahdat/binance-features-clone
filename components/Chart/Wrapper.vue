<template>
  <div class="flex-1 bg-bg-panel border border-border-color flex flex-col">
    <!-- Chart Tabs -->
    <div
      class="flex items-center justify-between border-b border-border-color px-4 py-2"
    >
      <div class="flex items-center gap-2" v-if="activeChartTab === 'Original'">
        <!-- Time Intervals -->
        <div class="flex items-center gap-1 text-xs">
          <span class="text-text-secondary">Time</span>
          <button
            v-for="interval in timeIntervals"
            :key="interval"
            @click="selectedInterval = interval"
            class="px-2 py-0.5 rounded"
            :class="
              selectedInterval === interval
                ? 'bg-bg-hover text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            "
          >
            {{ interval }}
          </button>
        </div>

        <!-- Chart Controls -->
        <div class="flex items-center gap-2 ml-4 text-text-secondary">
          <button class="hover:text-text-primary p-1">
            <TrendingUp :size="16" />
          </button>
          <button class="hover:text-text-primary p-1">
            <Pencil :size="16" />
          </button>
          <button class="hover:text-text-primary p-1">
            <Copy :size="16" />
          </button>
          <button class="hover:text-text-primary p-1">
            <Camera :size="16" />
          </button>
          <button class="hover:text-text-primary p-1">
            <Settings :size="16" />
          </button>
          <button class="hover:text-text-primary p-1">
            <Maximize2 :size="16" />
          </button>
        </div>
      </div>
      <div></div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-sm">
          <button
            v-for="tab in chartTabs"
            :key="tab"
            @click="activeChartTab = tab"
            class="px-3 py-1 rounded transition-colors"
            :class="
              activeChartTab === tab
                ? 'bg-bg-hover text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            "
          >
            {{ tab }}
          </button>
        </div>
      </div>
    </div>

    <!-- Chart Content -->
    <div class="flex-1 relative min-h-[400px]">
      <ClientOnly>
        <ChartOriginal v-if="activeChartTab === 'Original'" />
        <div
          v-else-if="activeChartTab === 'Trading View'"
          class="h-full w-full flex items-center justify-center"
        >
          it required api key from tradingview to work with!
        </div>
        <ChartDepth
          v-else-if="activeChartTab === 'Depth'"
          :bids="marketStore.bids"
          :asks="marketStore.asks"
        />
      </ClientOnly>
    </div>

    <!-- Chart Info Bar -->
    <div class="border-t border-border-color px-4 py-1.5 text-xs">
      <div class="flex items-center gap-4 text-text-secondary" v-if="stats">
        <span
          >{{ stats.date }} Open:
          <span class="text-text-primary">{{ stats.open }}</span></span
        >
        <span
          >High: <span class="text-text-primary">{{ stats.high }}</span></span
        >
        <span
          >Low: <span class="text-text-primary">{{ stats.low }}</span></span
        >
        <span
          >Close: <span class="text-text-primary">{{ stats.close }}</span></span
        >

        <span>
          CHANGE:
          <span
            :class="
              stats.change >= 0 ? 'text-binance-green' : 'text-binance-red'
            "
          >
            {{ stats.change.toFixed(2) }}%
          </span>
        </span>

        <span>
          Range:
          <span class="text-text-primary">{{ stats.range.toFixed(2) }}%</span>
        </span>

        <span class="ml-auto">
          MA(7): <span class="text-[#8B5CF6]">{{ ma.ma7?.toFixed(2) }}</span>
        </span>
        <span>
          MA(25): <span class="text-[#F59E0B]">{{ ma.ma25?.toFixed(2) }}</span>
        </span>
        <span>
          MA(99): <span class="text-[#3B82F6]">{{ ma.ma99?.toFixed(2) }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import {
  TrendingUp,
  Pencil,
  Copy,
  Camera,
  Settings,
  Maximize2,
} from "lucide-vue-next";

const marketStore = useMarketStore();
const { interval: selectedInterval } = storeToRefs(marketStore);
const ma = computed(() => marketStore.movingAverages);
const stats = computed(() => marketStore.chartStats);

const chartTabs = ["Original", "Trading View", "Depth"];
const activeChartTab = ref("Original");

const timeIntervals = ["1M", "30M", "1H", "4H", "1D", "1W"];
</script>
