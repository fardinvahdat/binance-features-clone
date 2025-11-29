export default defineEventHandler(async (event) => {
  const { symbol, period, limit } = getQuery(event);
  const url =
    "https://fapi.binance.com/futures/data/globalLongShortAccountRatio";
  try {
    const response = await $fetch(url, { params: { symbol, period, limit } });
    return response;
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: "Failed to fetch All Trader Long/Short Ratio." };
  }
});
