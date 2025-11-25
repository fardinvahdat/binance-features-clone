<script setup lang="ts">
import { defineProps, shallowRef, watch, nextTick, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";

interface DepthPoint {
  price: number;
  sum: number;
}

const props = defineProps<{
  bids: DepthPoint[];
  asks: DepthPoint[];
}>();

//
// Format raw data
//
function buildSide(data: DepthPoint[], side: "bid" | "ask") {
  return [...data]
    .sort((a, b) =>
      side === "bid"
        ? Number(b.price) - Number(a.price)
        : Number(a.price) - Number(b.price)
    )
    .map((d) => ({
      x: Number(d.price),
      y: Number(d.sum),
    }));
}

//
// CHART OPTIONS — Binance Styled
//
const options = shallowRef<ApexCharts.ApexOptions>({
  chart: {
    type: "area",
    height: 350,
    background: "transparent",
    toolbar: { show: false },
    animations: { enabled: false },
    zoom: { enabled: false },
    sparkline: { enabled: false },
  },

  grid: {
    borderColor: "#1e2329",
    strokeDashArray: 0,
    padding: { top: 10, bottom: 0, left: 0, right: 0 },
  },

  tooltip: {
    theme: "dark",
    x: { formatter: (v) => Number(v).toFixed(2) },
    y: { formatter: (v) => Number(v).toFixed(3) },
    marker: { show: false },
  },

  xaxis: {
    type: "numeric",
    labels: {
      style: { colors: "#6b7280", fontSize: "11px" },
      formatter: (v) => Number(v).toFixed(2),
    },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },

  yaxis: {
    opposite: true,
    labels: {
      style: { colors: "#6b7280", fontSize: "11px" },
      formatter: (v) => Number(v).toFixed(2),
    },
  },

  stroke: {
    width: 2,
    curve: 'smooth'
  },

  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
    },
  },

  colors: ["#0ecb81", "#f6465d"], // bid = green, ask = red

  dataLabels: {
    enabled: false,
  },
});

const series = shallowRef([
  { name: "Bids", data: [] as any[] },
  { name: "Asks", data: [] as any[] },
]);

//
// UPDATE CHART ON DATA CHANGE
//
watch(
  () => [props.bids, props.asks],
  () => {
    series.value = [
      { name: "Bids", data: buildSide(props.bids, "bid") },
      { name: "Asks", data: buildSide(props.asks, "ask") },
    ];
  },
  { deep: true }
);
</script>

<template>
  <div class="w-full h-full">
    <VueApexCharts :options="options" :series="series" height="100%" />
  </div>
</template>

<style scoped>
/* Binance chart background */
.w-full.h-full {
  background: #0d1117;
}
</style>
