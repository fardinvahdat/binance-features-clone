/**
 * Nuxt Server API Route: /api/exchange-info
 * Purpose: Proxy request to Binance Futures REST API to fetch exchange metadata.
 * This should be defined as a GET handler (export default defineEventHandler).
 */
export default defineEventHandler(async (event) => {
  const BINANCE_FUTURES_API_URL =
    "https://fapi.binance.com/fapi/v1/exchangeInfo";

  try {
    // Use $fetch on the server side to make the external request
    const response = await $fetch(BINANCE_FUTURES_API_URL);

    // Return the response data directly to the client
    return response;
  } catch (error) {
    // Handle API errors gracefully
    console.error("Error fetching from Binance Exchange Info:", error);

    // Set the response status code and return an error object
    setResponseStatus(event, 500);
    return {
      error: "Failed to fetch Binance exchange information",
    };
  }
});
