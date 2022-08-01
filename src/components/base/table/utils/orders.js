import { frozenPeriods, isFrozen, isMoq, isLotSize } from "./planning";
import { defaultTableValueFormatting, isNotPast } from "./base.js";

export const ORDER_STATUS = {
  VALIDATED: "validated",
  LOCKED: "locked"
};
export const ORDER_FREEZE_STATUS = {
  PARTIAL: "partlyFrozen",
  TOTAL: "fullyFrozen"
};

export const getOrderStatus = status => {
  switch (status) {
    case 2:
      return ORDER_STATUS.VALIDATED;
    case 3:
    case 4:
      return ORDER_STATUS.LOCKED;
    default:
      return undefined;
  }
};

export const getOptionsForOrders = options => {
  const { leadTimes, periods, periodType, productData } = options;
  return {
    periodType,
    periods,
    frozenPeriods: frozenPeriods(
      productData?.leadTime || {},
      periods,
      periodType,
      leadTimes
    ),
    isAggregated: options.isAggregated,
    access: options.access,
    leadTimes: options.leadTimes,
    units: options.productData?.units,
    moq: options.productData?.moq,
    lotSize: options.productData?.lotSize
  };
};

export const getOptionsForStatus3Supplies = options => {
  const { periods, periodType, isAggregated, access } = options;
  return {
    periodType,
    periods,
    isAggregated,
    access,
    units: options.productData?.units
  };
};

export const getOptionsForDemand = options => ({
  periodType: options.periodType,
  periods: options.periods,
  isAggregated: options.isAggregated,
  access: options.access
});

export const getOrdersValues = (orders, options) => {
  if (orders.isParent) {
    return orders.values.map((value, index) => ({
      value,
      isPast: index === 0
    }));
  }

  const {
    isAggregated,
    moq: moqBySupplier,
    lotSize: lotSizeBySupplier,
    ...otherOptions
  } = options;
  const { editedBy, orderStatus, supplier, isParent } = orders;
  return orders.values.map((value, index) => {
    const status = orderStatus && getOrderStatus(orderStatus[index]);
    const isByFlowlity = editedBy && editedBy[index] === "flowlity";
    const frozenStatus = isFrozen(index, supplier, options);
    const moq = isMoq(supplier, isAggregated, orders, moqBySupplier);
    const lotSize = isLotSize(
      supplier,
      isAggregated,
      orders,
      lotSizeBySupplier
    );
    return {
      value,
      isByFlowlity,
      status,
      moq,
      lotSize,
      isPast: index === 0,
      tooltip: supplier !== null || supplier !== undefined,
      isEditable: options.access && !isAggregated && !isParent && index > 0,
      ...(!isNaN(value) && { isFrozen: frozenStatus }),
      ...otherOptions
    };
  });
};

export const getStatus3SuppliesValues = (supplies, options) => {
  const { isAggregated, access, ...otherOptions } = options;
  return supplies.values.map((value, index) => {
    return {
      value,
      isPast: index === 0,
      isEditable: access && !isAggregated && index > 0,
      ...otherOptions
    };
  });
};

export const getAllOrdersValues = (allOrders, options) => {
  return allOrders.values.map((value, index) => {
    return {
      value,
      isPast: !isNotPast(index, options.periods, options.periodType)
    };
  });
};

export const allOrdersCalc = (value, isPast) => {
  if (isPast) return null;
  else if (!value) return 0;
  return defaultTableValueFormatting(value);
};
