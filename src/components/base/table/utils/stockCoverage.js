export const getOptionsForStockCoverage = options => ({
  isAggregated: options.isAggregated,
  stocks: options.tableData.stock.values,
  totalDemandForecast: options.totalDemandForecast
});
export const computeStockCoverage = (stock, totalDemandForecast) => {
  if (!totalDemandForecast) return "∞";
  if (!stock || stock <= 0) return 0;
  return Math.trunc(365 / (totalDemandForecast / stock));
};

export const getStockCoverageValues = (stockCoverages, options) => {
  return stockCoverages.values.map((_, index) => ({
    value: options.stocks[index],
    totalDemandForecast: options.totalDemandForecast,
    isPast: index === 0
  }));
};
