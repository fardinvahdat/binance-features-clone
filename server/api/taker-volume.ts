// server/api/taker-volume.ts
export default defineEventHandler(async (event) => {
  const { symbol } = getQuery(event);
  // Ensure the correct full path is used: /futures/data/...
  const BINANCE_API_URL =
    "https://fapi.binance.com/futures/data/takerBuySellVol";

  if (!symbol) {
    setResponseStatus(event, 400);
    return { error: "Symbol query parameter is required." };
  }

  try {
    const response = await $fetch<any[]>(BINANCE_API_URL, {
      params: {
        symbol: (symbol as string).toUpperCase(),
        period: "24h", // Standard 24h period
        limit: 1, // Only need the latest entry
      },
    });

    // Binance may return an empty array [] on error or for some symbols,
    // which leads to crashes if you try to access response[response.length - 1].
    if (!response || response.length === 0) {
      console.warn(`Taker Volume returned empty data for ${symbol}.`);
      setResponseStatus(event, 404);
      return { error: `No Taker Volume data found for ${symbol}.` };
    }

    return response;
  } catch (error: any) {
    // Log the full error from Binance
    console.error(
      `[CRITICAL ERROR] Binance Taker Volume API rejected request for ${symbol}. Full error:`,
      error.data || error.message
    );
    setResponseStatus(event, 500);
    return {
      error: "Failed to fetch Taker Volume. Check symbol or API status.",
    };
  }
});
