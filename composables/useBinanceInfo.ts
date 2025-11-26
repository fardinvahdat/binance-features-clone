import { useMarketStore, TradingRules } from "~/stores/market";

// Function to safely extract symbol trading rules from Binance exchangeInfo
const extractTradingRules = (
  exchangeInfo: any,
  symbol: string
): TradingRules | null => {
  if (!exchangeInfo || !exchangeInfo.symbols) return null;

  const symbolData = exchangeInfo.symbols.find(
    (s: any) => s.symbol === symbol
  );

  if (!symbolData) return null;

  // Helper to find a specific filter property
  const getFilter = (filterType: string) =>
    symbolData.filters.find((f: any) => f.filterType === filterType);

  // Extracting details from filters
  const priceFilter = getFilter("PRICE_FILTER");
  const lotSizeFilter = getFilter("LOT_SIZE");
  const minNotionalFilter = getFilter("MIN_NOTIONAL");
  const maxOrdersFilter = getFilter("MAX_NUM_ORDERS");
  const maxAlgoOrdersFilter = getFilter("MAX_NUM_ALGO_ORDERS");


  return {
    symbol: symbolData.symbol,
    status: symbolData.status,
    baseAsset: symbolData.baseAsset,
    quoteAsset: symbolData.quoteAsset,
    contractType: symbolData.contractType,

    // Price Rules
    pricePrecision: symbolData.pricePrecision,
    tickSize: priceFilter ? parseFloat(priceFilter.tickSize) : 0,
    minPrice: priceFilter ? parseFloat(priceFilter.minPrice) : 0,
    maxPrice: priceFilter ? parseFloat(priceFilter.maxPrice) : 0,

    // Quantity Rules
    quantityPrecision: symbolData.quantityPrecision,
    stepSize: lotSizeFilter ? parseFloat(lotSizeFilter.stepSize) : 0,
    minQty: lotSizeFilter ? parseFloat(lotSizeFilter.minQty) : 0,
    maxQty: lotSizeFilter ? parseFloat(lotSizeFilter.maxQty) : 0,

    // Notional Rules
    minNotional: minNotionalFilter
      ? parseFloat(minNotionalFilter.notional)
      : 0,

    // Order Limits
    maxNumOrders: maxOrdersFilter ? parseFloat(maxOrdersFilter.limit) : 0,
    maxNumAlgoOrders: maxAlgoOrdersFilter ? parseFloat(maxAlgoOrdersFilter.limit) : 0,
  };
};

export const useBinanceInfo = () => {
  const marketStore = useMarketStore();

  const fetchExchangeInfo = async (symbol: string) => {
    try {
      // Hardcoded path relative to the current origin (the Nuxt server)
      const proxyUrl = `/api/exchange-info`;

      const response = await $fetch<any>(proxyUrl); // Removed baseURL

      const rules = extractTradingRules(response, symbol);

      if (rules) {
        marketStore.tradingRules = rules;
      } else {
        console.warn(`Rules not found for symbol: ${symbol}`);
        marketStore.tradingRules = null;
      }
    } catch (error) {
      console.error("Error fetching exchange info/trading rules:", error);
      marketStore.tradingRules = null;
    }
  };
  return {
    fetchExchangeInfo,
    // ... (Other returns)
  };
};
