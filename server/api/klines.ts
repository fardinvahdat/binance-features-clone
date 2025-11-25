import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const symbol = (query.symbol as string) || "BTCUSDT";
  const interval = (query.interval as string) || "1m";
  const limit = Number(query.limit) || 1000;

  const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        error: `Binance error: ${response.status} - ${await response.text()}`,
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server-side klines fetch error:", error);
    return { error: `Proxy failed: ${error.message}` };
  }
});
