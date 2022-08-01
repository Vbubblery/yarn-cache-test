import {
  getOptionsForOrders,
  getOptionsForStatus3Supplies,
  getOptionsForDemand,
  getOrdersValues,
  getStatus3SuppliesValues,
  allOrdersCalc,
  getAllOrdersValues
} from "./orders";
import {
  computeStockCoverage,
  getOptionsForStockCoverage,
  getStockCoverageValues
} from "./stockCoverage";
import { getStockStatusByValue, StocksLoader } from "./stocks";
import { getOptionsForTransfers, getTransfersValues } from "./transfers";
import {
  DEMAND_SOURCE_NAMES,
  getMyForecastValues,
  getOptionsForMyForecast,
  MyForecastLoader,
  myForecastCalc,
  pastDemandCalc,
  getPastDemandValues
} from "./demand";
import helper from "@/helper/helper";

export const ROW_TYPE = {
  INPUT: "input",
  MULTI_ROW: "multi-row"
};

export const SAVING_STATUS = {
  PENDING: "pending",
  DONE: "done",
  NONE: undefined
};

export const SOURCE_NAME = {
  STOCK: "stock",
  SAFETY_MINIMUM: "minimum",
  SAFETY_MAXIMUM: "maximum",
  ORDERS: "orders",
  STATUS_3_SUPPLIES: "status3Supplies",
  TRANSFER: "transfer",
  TOTAL_DEMAND_FORECAST: "totalDemandForecast",
  STOCK_COVERAGE: "stockCoverage",
  FLOWLITY_DEMAND: "flowlityDemand",
  MY_FORECAST: "clientDemand",
  FINAL_FORECAST: "finalForecast",
  STOCK_EXPIRED: "stockExpired",
  ...DEMAND_SOURCE_NAMES
};

export const TRIGGER = {
  TRANSFER: "transfer",
  UPDATE_VALUE: "updateValue"
};

export const isNotPast = (forecastValueIdx, periods, periodType) => {
  return (
    helper.isFutureDate(periods[forecastValueIdx], periodType) ||
    helper.isDateStrCurrentPeriod(periods[forecastValueIdx], periodType)
  );
};

export const isNotInDemandFrozenHorizon = (headerIndex, headers) => {
  return headers?.[headerIndex]?.isInDemandFrozenHorizon === false;
};

export const isNotPastOrCurrent = (forecastValueIdx, periods, periodType) => {
  return helper.isFutureDate(periods[forecastValueIdx], periodType);
};

export const formatPlanningValues = (sourceName, item, options) => {
  item.values[0] = sourceName.startsWith(SOURCE_NAME.STOCK)
    ? item.values[0]
    : NaN;
  switch (true) {
    case sourceName === SOURCE_NAME.STOCK:
      return getStockStatusByValue(item, options);
    case sourceName === SOURCE_NAME.ORDERS:
    case sourceName.startsWith(SOURCE_NAME.ORDERS):
      return getOrdersValues(item, options);
    case sourceName === SOURCE_NAME.STATUS_3_SUPPLIES:
      return getStatus3SuppliesValues(item, options);
    case sourceName.startsWith(SOURCE_NAME.TRANSFER):
      return getTransfersValues(item, options);
    case sourceName === SOURCE_NAME.STOCK_COVERAGE:
      return getStockCoverageValues(item, options);
    default:
      return item.values.map((value, index) => ({
        value,
        isPast: index === 0
      }));
  }
};

export const formatDemandValues = (sourceName, item, options) => {
  switch (true) {
    case sourceName === SOURCE_NAME.MY_DEMAND_FORECAST:
    case sourceName.startsWith(SOURCE_NAME.MY_DEMAND_FORECAST):
      return getMyForecastValues(item, options);
    case sourceName === SOURCE_NAME.ALL_ORDERS:
      return getAllOrdersValues(item, options);
    case sourceName === SOURCE_NAME.PAST_DEMAND:
    case sourceName.startsWith(SOURCE_NAME.PAST_DEMAND):
      return getPastDemandValues(item, options);
    default:
      return item.values.map((value, index) => ({
        value,
        isPast: !isNotPast(index, options.periods, options.periodType)
      }));
  }
};

export const getOptionsBySourceName = (sourceName, options) => {
  switch (true) {
    case sourceName === SOURCE_NAME.ORDERS:
    case sourceName.startsWith(SOURCE_NAME.ORDERS):
      return getOptionsForOrders(options);
    case sourceName === SOURCE_NAME.STATUS_3_SUPPLIES:
      return getOptionsForStatus3Supplies(options);
    case sourceName === SOURCE_NAME.FIRM_ORDERS ||
      sourceName === SOURCE_NAME.ALL_ORDERS ||
      sourceName === SOURCE_NAME.PAST_DEMAND:
    case sourceName.startsWith(SOURCE_NAME.PAST_DEMAND):
      return getOptionsForDemand(options);
    case sourceName.startsWith(SOURCE_NAME.TRANSFER):
      return getOptionsForTransfers(options);
    case sourceName === SOURCE_NAME.STOCK_COVERAGE:
      return getOptionsForStockCoverage(options);
    case sourceName.startsWith(SOURCE_NAME.MY_DEMAND_FORECAST):
      options.isChild = sourceName !== SOURCE_NAME.MY_DEMAND_FORECAST;
      return getOptionsForMyForecast(options);
    default:
      return {
        periodType: options.periodType,
        periods: options.periods
      };
  }
};

export const defaultTableValueFormatting = value => {
  const val = +value;
  return Math.abs(val) > 10
    ? Math.round(val)
    : Math.ceil(val * 100) / 100;
};

export const defaultCalc = value => {
  if (value === "∞") return value;
  if (isNaN(value)) return "-";
  else if (!value) return value;
  return defaultTableValueFormatting(value);
};

export const computedCalcBySource = {
  [SOURCE_NAME.STOCK]: item => defaultCalc(item.value ?? item),
  [SOURCE_NAME.STATUS_3_SUPPLIES]: item => defaultCalc(item.value ?? item),
  [SOURCE_NAME.ORDERS]: item => {
    return defaultCalc(
      // TODO: item should always be an object to standardize the treatment
      item instanceof Object ? item.value : item
    );
  },
  [SOURCE_NAME.TRANSFER]: item => defaultCalc(item.value),
  [SOURCE_NAME.STOCK_COVERAGE]: item =>
    defaultCalc(computeStockCoverage(item.value, item.totalDemandForecast)),
  [SOURCE_NAME.MY_DEMAND_FORECAST]: item =>
    myForecastCalc(item, defaultTableValueFormatting),
  [SOURCE_NAME.ALL_ORDERS]: item => allOrdersCalc(item.value, item.isPast),
  [SOURCE_NAME.PAST_DEMAND]: item =>
    pastDemandCalc(item.value, item.isPastOrCurrent),
  [SOURCE_NAME.MY_FORECAST]: item => defaultCalc(item.value)
};

export const relatedSourcesBySourceName = {
  [SOURCE_NAME.ORDERS]: [SOURCE_NAME.STOCK],
  [SOURCE_NAME.STOCK]: [SOURCE_NAME.STOCK_COVERAGE]
};

export const createSubItemsLoader = sourceName => {
  switch (sourceName) {
    case SOURCE_NAME.STOCK:
      return StocksLoader;
    case SOURCE_NAME.FIRM_ORDERS:
    case SOURCE_NAME.ALL_ORDERS:
    case SOURCE_NAME.FINAL_DEMAND_FORECAST:
    case SOURCE_NAME.FLOWLITY_DEMAND_FORECAST:
    case SOURCE_NAME.SALES_ORDERS:
    case SOURCE_NAME.PAST_DEMAND:
    case SOURCE_NAME.MY_DEMAND_FORECAST:
    case SOURCE_NAME.EXTERNAL_DEMAND_FORECAST:
      return MyForecastLoader;
    default:
      return {
        fetch() {
          throw new Error(
            `No corresponding SubItemsLoader found for this source "${sourceName}"`
          );
        }
      };
  }
};
