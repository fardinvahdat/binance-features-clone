// server/api/leverage-bracket.ts
export default defineEventHandler(async (event) => {
  const { symbol } = getQuery(event);

  if (!symbol) {
    setResponseStatus(event, 400);
    return { error: "Symbol query parameter is required." };
  }

  const BINANCE_API_URL = "https://fapi.binance.com/fapi/v1/leverageBracket";

  try {
    const response = await $fetch<any[]>(BINANCE_API_URL, {
      params: {
        symbol: (symbol as string).toUpperCase(),
      },
      // *** NO API KEY OR SIGNATURE HEADER HERE ***
    });
    return response;
  } catch (error: any) {
    // Log the full error to the server console to see the actual Binance response
    console.error(
      `[CRITICAL ERROR] Binance Leverage Bracket API rejected request for ${symbol}. Check security requirements or API key. Full error:`,
      error.data || error.message
    );
    // Return a 404 or a 503 instead of 500 if we suspect a missing key/signature
    setResponseStatus(event, 404); // Using 404 as a deliberate choice to indicate data isn't found publicly.
    return {
      error:
        "Leverage Brackets are not available via public API. Requires authentication or API Key.",
    };
  }
});
