import {
  useMarketStore,
  TradingRules,
  FundingHistoryItem,
  LeverageBracket,
  OpenInterest,
  TakerVolume,
  ChartDataPoint,
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
  const PERIOD = "5m"; // Use 5-minute interval as seen in the screenshot
  const LIMIT = 100; // Keep limit reasonable for testing

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

  const fetchTradingDataHistory = async (symbol: string) => {
    try {
      await Promise.all([
        // 1. Open Interest Statistics
        fetchAndProcess(
          `/api/trading-data/oi-hist?symbol=${symbol}&period=${PERIOD}&limit=${LIMIT}`,
          (data: any[]) =>
            data.map((d) => ({
              time: d.timestamp,
              value: parseFloat(d.sumOpenInterestValue), // National Value (USD/USDT) for the line chart
              value2: parseFloat(d.sumOpenInterest), // Open Interest (Contracts) for the bar chart
            })),
          marketStore.setOiData
        ),

        // 2. Top Trader Long/Short Ratio (Accounts)
        fetchAndProcess(
          `/api/trading-data/top-account-ratio?symbol=${symbol}&period=${PERIOD}&limit=${LIMIT}`,
          (data: any[]) =>
            data.map((d) => ({
              time: d.timestamp,
              value: parseFloat(d.longShortRatio),
            })),
          marketStore.setTopAccountRatioData
        ),

        // 3. Top Trader Long/Short Ratio (Positions)
        fetchAndProcess(
          `/api/trading-data/top-position-ratio?symbol=${symbol}&period=${PERIOD}&limit=${LIMIT}`,
          (data: any[]) =>
            data.map((d) => ({
              time: d.timestamp,
              value: parseFloat(d.longShortRatio),
            })),
          marketStore.setTopPositionRatioData
        ),

        // 4. Long/Short Ratio (All Traders)
        fetchAndProcess(
          `/api/trading-data/all-ratio?symbol=${symbol}&period=${PERIOD}&limit=${LIMIT}`,
          (data: any[]) =>
            data.map((d) => ({
              time: d.timestamp,
              value: parseFloat(d.longShortRatio),
            })),
          marketStore.setAllTraderRatioData
        ),

        // 5. Taker Buy/Sell Volume
        fetchAndProcess(
          `/api/trading-data/taker-volume-hist?symbol=${symbol}&period=${PERIOD}&limit=${LIMIT}`,
          (data: any[]) =>
            data.map((d) => ({
              time: d.timestamp,
              value: parseFloat(d.takerBuyVol), // Volume for bar chart 1
              value2: parseFloat(d.takerSellVol), // Volume for bar chart 2
            })),
          marketStore.setTakerVolData
        ),

        // 6. Basis (Requires futures Klines and Index Price Klines - Using a dedicated endpoint for Basis)
        fetchAndProcess(
          `/api/trading-data/basis?symbol=${symbol}&period=${PERIOD}&limit=${LIMIT}`,
          (data: any[]) =>
            data
              .map((d) => ({
                time: d.timestamp,
                value: parseFloat(d.indexPrice), // Index Price
                value2: parseFloat(d.basis), // Basis
              }))
              .filter((_, i) => i % 2 === 0), // Basis endpoint is heavy, filter data points
          marketStore.setBasisData
        ),
      ]);
      console.log("All Trading Data history fetched successfully.");
    } catch (error) {
      console.error("Error fetching trading data history:", error);
    }
  };

  // Helper function for fetching and processing
  const fetchAndProcess = async (
    url: string,
    processor: (data: any[]) => ChartDataPoint[],
    setter: (data: ChartDataPoint[]) => void
  ) => {
    try {
      const data: any = await $fetch(url);

      // CRITICAL FIX: Check if the response is a valid array of historical points
      if (!Array.isArray(data) || data.length === 0) {
        // Log a warning if the API returned an unexpected or empty structure
        console.warn(
          `[Data Check] API returned invalid/empty data for ${url.split("?")[0]}. Raw response:`,
          data
        );
        setter([]);
        return;
      }

      // Binance returns newest data first, reverse it for chart display
      setter(processor(data).reverse());
    } catch (error: any) {
      console.error(
        `[Fetch Error] Failed to fetch ${url.split("?")[0]}:`,
        error.data || error.message
      );
      // Ensure the store is cleared on fetch failure to prevent rendering issues
      setter([]);
    }
  };

  return {
    fetchExchangeInfo,
    fetchFundingRateHistory,
    fetchLeverageTiers,
    fetchOpenInterest,
    fetchTakerVolume,
    fetchTradingDataHistory,
  };
};
