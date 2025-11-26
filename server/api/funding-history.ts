/**
 * Nuxt Server API Route: /api/funding-history
 * Purpose: Proxy request to Binance Futures REST API to fetch historical funding rates.
 */
export default defineEventHandler(async (event) => {
  const { symbol, limit } = getQuery(event);

  if (!symbol) {
    setResponseStatus(event, 400);
    return { error: "Symbol query parameter is required." };
  }

  const BINANCE_API_URL = "https://fapi.binance.com/fapi/v1/fundingRate";

  try {
    const response = await $fetch<any[]>(BINANCE_API_URL, {
      params: {
        symbol: (symbol as string).toUpperCase(),
        limit: limit || 100, // Default to 100 entries
      },
    });

    return response;
  } catch (error) {
    console.error(`Error fetching funding history for ${symbol}:`, error);
    setResponseStatus(event, 500);
    return {
      error: "Failed to fetch historical funding rates from Binance.",
    };
  }
});
