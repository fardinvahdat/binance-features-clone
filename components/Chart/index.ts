import ChartOriginal from "./ChartOriginal.vue";
import ChartDepth from "./ChartDepth.vue";

export interface ChartDefinition {
  name: string; // Name in tab
  component: any; // Vue component
  props?: string[]; // Extra props to pass
}

export const chartRegistry: ChartDefinition[] = [
  {
    name: "Original",
    component: ChartOriginal,
  },
  {
    name: "Trading View",
    component: "TradingViewChart", // dynamic external
  },
  {
    name: "Depth",
    component: ChartDepth,
    props: ["bids", "asks"],
  },
];
