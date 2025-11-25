<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Top Navigation Bar -->
    <HeaderTopBar />

    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Side: Chart + Bottom Tabs -->
      <div class="flex-1 flex flex-col overflow-auto">
        <!-- Ticker Bar -->
        <HeaderTickerBar />

        <!-- Market Header -->
        <HeaderMarket />

        <!-- Chart Area -->
        <div class="flex-1 flex">
          <ChartContainer class="flex-1" />
        </div>

        <!-- Bottom Panels (Positions, Orders, etc.) -->
        <div class="h-64 border-t border-border-color">
          <TradingPositionsPanel />
        </div>
      </div>

      <!-- Right Side Panels -->
      <div class="w-96 flex flex-col gap-2 p-2 overflow-auto">
        <!-- Order Book -->
        <div class="flex-1 min-h-full">
          <OrderBookPanel />
        </div>

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
import { useMarketStore } from "~/stores/market";

const { connect, disconnect, fetchInitialKlines } = useBinanceStream();
const marketStore = useMarketStore();
const { interval } = storeToRefs(marketStore);

onMounted(async () => {
  await fetchInitialKlines(
    marketStore.currentSymbol.toLocaleLowerCase(),
    interval.value.toLocaleLowerCase()
  );
  // Connect to WebSocket on mount
  connect(
    marketStore.currentSymbol.toLowerCase(),
    interval.value.toLocaleLowerCase()
  );
});

// Watch for symbol changes and reconnect
watch(
  () => marketStore.currentSymbol,
  (newSymbol) => {
    console.log("Symbol changed to:", newSymbol);
    // Disconnect old connection and connect with new symbol
    disconnect();
    connect(newSymbol.toLowerCase(), interval.value.toLocaleLowerCase());
    fetchInitialKlines(
      newSymbol.toLowerCase(),
      interval.value.toLocaleLowerCase()
    );
  }
);

onUnmounted(() => {
  // Disconnect WebSocket on unmount
  disconnect();
});
</script>
