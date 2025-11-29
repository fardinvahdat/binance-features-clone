import {
  useMarketStore,
  TradingRules,
  FundingHistoryItem,
  LeverageBracket,
  OpenInterest,
  TakerVolume,
} from "~/stores/market";

// Function to safely extract symbol trading rules from Binance exchangeInfo
const extractTradingRules = (
  exchangeInfo: any,
  symbol: string
): TradingRules | null => {
  if (!exchangeInfo || !exchangeInfo.symbols) return null;

  const symbolData = exchangeInfo.symbols.find((s: any) => s.symbol === symbol);

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
    minNotional: minNotionalFilter ? parseFloat(minNotionalFilter.notional) : 0,

    // Order Limits
    maxNumOrders: maxOrdersFilter ? parseFloat(maxOrdersFilter.limit) : 0,
    maxNumAlgoOrders: maxAlgoOrdersFilter
      ? parseFloat(maxAlgoOrdersFilter.limit)
      : 0,
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

  const fetchFundingRateHistory = async (
    symbol: string,
    limit: number = 50
  ) => {
    const marketStore = useMarketStore();
    try {
      // NOTE: We rely on a proxy route: /api/funding-history
      const proxyUrl = `/api/funding-history?symbol=${symbol}&limit=${limit}`;

      const response = await $fetch<any[]>(proxyUrl);

      // Map the API response to the store's FundingHistoryItem interface
      const history: FundingHistoryItem[] = response
        .map((item) => ({
          fundingRate: parseFloat(item.fundingRate),
          fundingTime: item.fundingTime,
          markPrice: 0, // Mark price not available in funding history API
        }))
        .reverse(); // Reverse to display newest last (if desired, or keep as-is)

      marketStore.setFundingHistory(history);
    } catch (error) {
      console.error("Error fetching funding rate history:", error);
      marketStore.setFundingHistory([]);
    }
  };

  const fetchLeverageTiers = async (symbol: string) => {
    try {
      // NOTE: We rely on a proxy route: /api/leverage-bracket
      const proxyUrl = `/api/leverage-bracket?symbol=${symbol}`;

      const response = await $fetch<any[]>(proxyUrl);

      // Response is an array of objects, each containing a 'brackets' array
      const symbolData = response.find(
        (data) => data.symbol === symbol.toUpperCase()
      );

      if (symbolData && symbolData.brackets) {
        const tiers: LeverageBracket[] = symbolData.brackets.map((b: any) => ({
          bracket: b.bracket,
          initialLeverage: b.initialLeverage,
          notionalCap: parseFloat(b.notionalCap),
          notionalFloor: parseFloat(b.notionalFloor),
          maintMarginRatio: parseFloat(b.maintMarginRatio),
        }));
        marketStore.setLeverageTiers(tiers);
      } else {
        marketStore.setLeverageTiers([]);
      }
    } catch (error) {
      console.error("Error fetching leverage tiers:", error);
      marketStore.setLeverageTiers([]);
    }
  };

  const fetchOpenInterest = async (symbol: string) => {
    try {
      const proxyUrl = `/api/open-interest?symbol=${symbol}`; // NEW PROXY

      const response = await $fetch<any>(proxyUrl); // This endpoint returns a single object

      marketStore.setOpenInterestData({
        openInterest: parseFloat(response.openInterest),
        timestamp: response.timestamp,
      });
    } catch (error) {
      console.error("Error fetching open interest:", error);
    }
  };

  const fetchTakerVolume = async (symbol: string) => {
    try {
      const proxyUrl = `/api/taker-volume?symbol=${symbol}`; // NEW PROXY

      const response = await $fetch<any[]>(proxyUrl); // This endpoint returns an array

      // We only need the latest (last element)
      const latest = response[response.length - 1];

      marketStore.setTakerVolumeData({
        buyVolume: parseFloat(latest.buySellRatio), // Note: This API returns a ratio
        sellVolume: parseFloat(latest.takerSellVolume),
        timestamp: latest.timestamp,
      });
    } catch (error) {
      console.error("Error fetching taker volume:", error);
    }
  };

  return {
    fetchExchangeInfo,
    fetchFundingRateHistory,
    fetchLeverageTiers,
    fetchOpenInterest,
    fetchTakerVolume,
  };
};
