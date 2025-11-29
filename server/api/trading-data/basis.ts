export default defineEventHandler(async (event) => {
  const { symbol, period, limit } = getQuery(event);
  const url = "https://fapi.binance.com/futures/data/basis";

  try {
    const response = await $fetch(url, {
      params: {
        pair: (symbol as string).toUpperCase(),
        period: period as string,
        limit: limit as string,
        contractType: "PERPETUAL", // <-- CRITICAL FIX: Mandatory parameter
      },
    });
    return response;
  } catch (error: any) {
    console.error("Error fetching Basis History:", error.data || error.message);
    setResponseStatus(event, 500);
    return { error: "Failed to fetch Basis History." };
  }
});
