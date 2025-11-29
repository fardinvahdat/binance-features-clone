<template>
  <div class="p-4 space-y-6 text-text-primary">
    <h3 class="text-xl font-bold border-b border-border-color/50 pb-2">
      Trading Data History
    </h3>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <TradingDataChart
        title="Open Interest"
        :data="marketStore.oiData"
        :seriesNames="['National Value of Open...', 'Open Interest (BTC)']"
        :colors="['#FCD535', '#A29BFE']"
        :yaxisFormatter="(val: number) => (val / 1000000).toFixed(0) + 'M'"
      />
      
      <TradingDataChart
        title="Top Trader Long/Short Ratio (Accounts)"
        :data="marketStore.topAccountRatioData"
        :seriesNames="['Long/Short Ratio (Accounts)']"
        :colors="['#FCD535']"
      />
      
      <TradingDataChart
        title="Top Trader Long/Short Ratio (Positions)"
        :data="marketStore.topPositionRatioData"
        :seriesNames="['Long/Short Ratio (Positions)']"
        :colors="['#A29BFE']"
      />

      <TradingDataChart
        title="Long/Short Ratio"
        :data="marketStore.allTraderRatioData"
        :seriesNames="['Long/Short Ratio']"
        :colors="['#EF5350']"
      />
      
      <TradingDataChart
        title="Taker Buy/Sell Volume"
        :data="marketStore.takerVolData"
        :seriesNames="['Taker Buy Volume (BTC)', 'Taker Sell Volume (BTC)']"
        type="bar"
        :colors="['#26A69A', '#EF5350']"
      />

      <TradingDataChart
        title="Basis"
        :data="marketStore.basisData"
        :seriesNames="['Futures Price', 'Price Index', 'Basis']"
        :colors="['#FCD535', '#A29BFE', '#FFFFFF']"
        :yaxisFormatter="(val: number) => val.toFixed(2)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from "~/stores/market";
const marketStore = useMarketStore();
</script>