export default defineEventHandler(async (event) => {
  const { symbol } = getQuery(event);
  const BINANCE_API_URL = "https://fapi.binance.com/fapi/v1/openInterest";

  try {
    const response = await $fetch(BINANCE_API_URL, {
      params: { symbol: (symbol as string).toUpperCase() },
    });
    return response;
  } catch (error) {
    console.error("Error fetching open interest:", error);
    setResponseStatus(event, 500);
    return { error: "Failed to fetch Open Interest." };
  }
});
