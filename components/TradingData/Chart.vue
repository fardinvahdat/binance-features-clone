<template>
  <div class="p-4 bg-bg-darker rounded-lg border border-border-color space-y-2 h-[350px]">
    <h4 class="text-md font-medium text-text-secondary">{{ title }}</h4>
    <div v-if="chartSeries.length && chartSeries[0].data.length > 0">
      <ClientOnly>
        <apexchart :options="chartOptions" :series="chartSeries" type="line" height="280"></apexchart>
      </ClientOnly>
    </div>
    <div v-else class="flex items-center justify-center h-full text-text-tertiary">
        Loading or No Data Available
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  data: any[]; // Array of { time: number, value: number, value2?: number }
  seriesNames: string[];
  type?: 'line' | 'bar';
  colors?: string[];
  yaxisFormatter?: (val: number) => string;
}>();

const chartSeries = computed(() => {
    if (!props.data || props.data.length === 0) return [];

    // All series data is structured as [timestamp, value]
    const series1 = props.data.map(d => [d.time, d.value]);
    const series: any[] = [{
        name: props.seriesNames[0],
        data: series1,
        type: props.type === 'bar' ? 'bar' : 'line'
    }];
    
    // Handle secondary series (e.g., Open Interest or Taker Volume)
    if (props.data[0] && props.data[0].value2 !== undefined) {
        const series2 = props.data.map(d => [d.time, d.value2]);
        series.push({
            name: props.seriesNames[1] ?? 'Series 2',
            data: series2,
            type: 'line', // Always keep the secondary series as line for dual-axis charts
            yaxisIndex: 1, // Use secondary Y-axis
        });
    }
    
    return series;
});


const chartOptions = computed(() => ({
  chart: {
    id: props.title.replace(/\s/g, '-'),
    toolbar: { show: false },
    background: '#141417',
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: { colors: '#777' },
      // formatter: (val: string) => new Date(val).toDateString(),
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: [
    // Primary Y-axis
    {
      show: true,
      opposite: true,
      labels: {
        style: { colors: props.colors ? props.colors[0] : '#FFF' },
        formatter: props.yaxisFormatter ?? ((val: number) => val.toFixed(2)),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    // Secondary Y-axis for dual-series charts
    ...(props.data[0] && props.data[0].value2 !== undefined ? [{
        show: true,
        opposite: false,
        labels: {
            style: { colors: props.colors ? props.colors[1] : '#FFF' },
            formatter: (val: number) => val.toFixed(0), // Format for Volume/Contracts
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
    }] : []),
  ],
  grid: { show: false },
  tooltip: { 
    theme: 'dark' 
  },
  dataLabels: { enabled: false },
  stroke: { 
    curve: 'smooth', 
    width: 2 
  },
  colors: props.colors ?? ['#FCD535', '#26A69A', '#EF5350'],
  fill: {
      type: 'solid',
      opacity: 1, // Ensure lines are 100% visible
  },
}));
</script>