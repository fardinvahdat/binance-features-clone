<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Top Navigation Bar -->
    <HeaderTopBar />

    <!-- Main Content Area -->
    <div class="flex-1 grid overflow-hidden grid-cols-4">
      <!-- Left Side: Chart + Bottom Tabs -->
      <div class="flex-1 flex flex-col overflow-auto col-span-3">
        <!-- Ticker Bar -->
        <HeaderTickerBar />

        <!-- Market Header -->
        <HeaderMarket />

        <!-- Tabs -->

        <div
          class="flex items-center border-b border-border-color overflow-x-auto text-base min-h-fit"
        >
          <button
            v-for="type in types"
            :key="type"
            @click="selectedType = type"
            class="px-4 py-2 font-medium text-sm border-b-2 transition-colors"
            :class="
              selectedType === type
                ? 'border-binance-yellow text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            "
          >
            {{ type }}
          </button>
        </div>

        <!-- Chart Area -->
        <div class="flex-1 flex" v-if="selectedType == 'Chart'">
          <ChartWrapper class="flex-1" />
        </div>

        <!-- Info Tab -->
        <div class="flex-1 flex" v-if="selectedType == 'Info'">
          <InfoWrapper class="flex-1" />
        </div>

        <!-- Bottom Panels (Positions, Orders, etc.) -->
        <div class="h-64 border-t border-border-color">
          <TradingPositionsPanel />
        </div>
      </div>

      <!-- Right Side Panels -->
      <div class="col-span-1 grid grid-cols-2 gap-2 p-2 overflow-auto">
        <!-- Order Book -->
        <div>
          <div class="flex-1 min-h-full">
            <OrderBookPanel />
          </div>
        </div>
        <div>
          <!-- Trading Panel -->
          <div class="h-auto">
            <TradingPanel />
          </div>

          <!-- Trades -->
          <div class="h-64">
            <OrderBookTradesPanel />
          </div>

          <!-- Account Panel -->
          <div class="h-auto">
            <TradingAccountPanel />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer Notification -->
    <div class="bg-bg-panel border-t border-border-color px-4 py-2 text-xs">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-text-secondary">
          <button class="hover:text-text-primary">Stable connection</button>
          <span>ZENIUSDT -11.08% 617.07</span>
          <span>ZECUSDT -2.80% 61.70</span>
          <span>DASHUSDT -6.63% 35.30</span>
          <span>CROSSUSDT -25.38% 0.10163</span>
          <span>PIERUSDT</span>
        </div>
        <div class="flex items-center gap-4 text-text-secondary">
          <button class="hover:text-text-primary">Campaign Center</button>
          <button class="hover:text-text-primary">Announcements</button>
          <button class="hover:text-text-primary">Disclaimer</button>
          <button class="hover:text-text-primary">Futures Chatroom</button>
          <button class="hover:text-text-primary">Cookie Preferences</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, watch } from "vue";
import { useBinanceStream } from "~/composables/useBinanceStream";
import { useBinanceInfo } from "~/composables/useBinanceInfo";
import { useMarketStore } from "~/stores/market";

const { connect, disconnect, fetchInitialKlines } = useBinanceStream();
const {
  fetchExchangeInfo,
  fetchFundingRateHistory,
  fetchLeverageTiers,
  fetchOpenInterest,
  fetchTakerVolume,
} = useBinanceInfo();
const marketStore = useMarketStore();
const { interval } = storeToRefs(marketStore);
const types = ["Chart", "Info", "Trading Data"];
const selectedType = ref("Chart");

const initData = async (symbol: string, interval: string) => {
  const lowerSymbol = symbol.toLowerCase();
  const lowerInterval = interval.toLowerCase();

  // 1. Fetch historical klines
  await fetchInitialKlines(lowerSymbol, lowerInterval);

  // 2. Fetch static/info data
  await fetchExchangeInfo(symbol);
  await fetchFundingRateHistory(symbol); // <-- Fetch historical funding data
  await fetchLeverageTiers(symbol);
  await fetchOpenInterest(symbol);
  await fetchTakerVolume(symbol);

  // 3. Connect to WebSocket
  connect(lowerSymbol, lowerInterval);
};

onMounted(async () => {
  await initData(marketStore.currentSymbol, interval.value);
  marketStore.connectTickers();
});

// Watch for symbol and interval changes and reconnect
watch(
  [() => marketStore.currentSymbol, () => marketStore.interval],
  ([newSymbol, newInterval], [oldSymbol, oldInterval]) => {
    console.log("Symbol or interval changed:", newSymbol, newInterval);

    disconnect(); // Disconnect old stream
    initData(newSymbol, newInterval); // Load new data and reconnect
  }
);

onUnmounted(() => {
  disconnect();
});
</script>
