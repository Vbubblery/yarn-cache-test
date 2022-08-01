import helper from "@/helper/helper";
import { ORDER_FREEZE_STATUS } from "@/components/base/table/utils/orders";
import {
  relatedSourcesBySourceName,
  ROW_TYPE,
  SOURCE_NAME
} from "@/components/base/table/utils/base";
export const getTypeBySourceName = (sourceName, isParent) => {
  if (isParent) {
    return ROW_TYPE.MULTI_ROW;
  }
  switch (true) {
    case sourceName === SOURCE_NAME.ORDERS:
    case sourceName === SOURCE_NAME.MY_FORECAST:
    case sourceName === SOURCE_NAME.STATUS_3_SUPPLIES:
    case sourceName.startsWith(SOURCE_NAME.ORDERS):
    case sourceName.startsWith(SOURCE_NAME.TRANSFER):
      return ROW_TYPE.INPUT;
    default:
      return undefined;
  }
};

export const getAsideColorBySourceName = sourceName => {
  switch (sourceName) {
    case SOURCE_NAME.STOCK:
      return "#AF48FF";
    case SOURCE_NAME.STATUS_3_SUPPLIES:
      return "#0A6EE3";
    case SOURCE_NAME.STOCK_EXPIRED:
      return "#F76800";
    case SOURCE_NAME.SAFETY_MINIMUM:
    case SOURCE_NAME.SAFETY_MAXIMUM:
      return "#EAFEE6";
    default:
      return undefined;
  }
};

export const getIndentBySourceName = sourceName => {
  switch (true) {
    case sourceName === SOURCE_NAME.STOCK_EXPIRED:
    case sourceName === SOURCE_NAME.STATUS_3_SUPPLIES:
    case sourceName.startsWith(`${SOURCE_NAME.ORDERS}-`):
    case sourceName.startsWith(`${SOURCE_NAME.STOCK}-`):
      return true;
    default:
      return false;
  }
};

export const getIconBySourceName = sourceName => {
  switch (true) {
    case sourceName.startsWith(`${SOURCE_NAME.STOCK}-`):
      return {
        name: "checkbox-circle-fill",
        color: "#7C95B5"
      };
    case sourceName === SOURCE_NAME.STOCK_COVERAGE:
      return {
        name: "calendar-check-fill",
        color: "#637691"
      };
    case sourceName === SOURCE_NAME.SAFETY_MINIMUM:
    case sourceName === SOURCE_NAME.SAFETY_MAXIMUM:
      return {
        name: "rectangle-flowlity-3",
        color: "#EAFEE6",
        stroke: "#B1F0A2"
      };
    case sourceName.startsWith(`${SOURCE_NAME.ORDERS}-`):
      return {
        name: "truck-fill",
        color: "#7C95B5"
      };
    default:
      return undefined;
  }
};

export const getCollapsedBySourceName = sourceName => {
  switch (sourceName) {
    case SOURCE_NAME.ORDERS:
      return false;
    default:
      return true;
  }
};

export const getIsMediumFontBySourceName = sourceName => {
  switch (true) {
    case sourceName === SOURCE_NAME.ORDERS:
      return true;
    default:
      return false;
  }
};

export const updateRelatedSourcesWithChildren = (
  sourceName,
  startPos,
  data,
  options,
  hasStockWithBacklog
) => {
  sourceName = sourceName.split("-")[0];
  const relatedSources = relatedSourcesBySourceName[sourceName] || [];
  relatedSources.forEach(source => {
    const children = Object.keys(data).filter(key =>
      key.startsWith(`${source}`)
    );
    children.forEach(child => {
      if (
        data[child]?.parent !== SOURCE_NAME.STOCK ||
        +data[child]?.storageSite === options.defaultStorageSiteId
      ) {
        for (let i = startPos; i < data[child].values.length; i++) {
          const newValue =
            (data[child]?.values[i - 1] ?? 0) +
            (data[SOURCE_NAME.ORDERS]?.values[i] ?? 0) -
            (data[SOURCE_NAME.FINAL_FORECAST]?.values[i] ?? 0) -
            (data[SOURCE_NAME.STOCK_EXPIRED]?.values[i] ?? 0);
          data[child].values[i] = hasStockWithBacklog
            ? newValue
            : Math.max(newValue, 0);
        }
      }
    });
  });
  return data;
};
export const checkIfIsWeekend = (date, periodType) => {
  return helper.isWeekend(date, periodType);
};

export const checkIfIsCurrentPeriod = (date, periodType) => {
  return helper.isDateStrCurrentPeriod(date, periodType);
};
export const isMoq = (supplier, isAggregated, orders, moq) => {
  if (isAggregated || !supplier) return null;
  if (!orders) return null;
  return moq[supplier];
};
export const isLotSize = (supplier, isAggregated, orders, lotSize) => {
  if (isAggregated || !supplier) return null;
  if (!orders) return null;
  return lotSize[supplier];
};

export const leadTimes = leadTime => {
  return Object.keys(leadTime).reduce((obj, supplierId) => {
    const days = leadTime[supplierId];
    // we need to remove one day because the Flowlity recommendation computation is also doing that
    obj[supplierId] = helper.addDaysToToday(days - 1);
    return obj;
  }, {});
};

export const getDisplayName = (sourceName, sourceContent, storageSites) => {
  let displayName = "";
  if (sourceContent.isTransfer) {
    displayName = `${"transfer"} ${
      storageSites(sourceContent.trFrom).name
    } -> ${storageSites(sourceContent.trTo).name}`;
  } else if (sourceContent.supplier && sourceName !== SOURCE_NAME.ORDERS) {
    // show only supplier in suffix
    displayName = "";
  } else if (sourceContent.storageSite && sourceContent.storageSite != 0) {
    displayName = storageSites(sourceContent.storageSite).name;
  } else {
    displayName = sourceName;
  }
  if (
    displayName &&
    sourceContent.suffix &&
    !sourceContent.suffix.includes("(")
  )
    sourceContent.suffix = ` (${sourceContent.suffix})`;
  return displayName + (sourceContent.suffix || "");
};

export const frozenPeriods = (leadTime, periods, periodType, leadTimes) => {
  return Object.keys(leadTime).reduce((obj, supplierId) => {
    const res = periods.filter(period => {
      return helper.isDateStrBetweenDates(
        periodType,
        period,
        helper.currentPeriodStartDate(periodType),
        leadTimes?.[supplierId]
      );
    });
    obj[supplierId] = res;
    return obj;
  }, {});
};

export const isFrozen = (index, supplier, options) => {
  const date = options.periods[index];
  if (options.isAggregated || !supplier) return null;
  if (isPartlyFrozen(date, supplier, options))
    return ORDER_FREEZE_STATUS.PARTIAL;
  if (options.frozenPeriods[supplier]?.includes(date))
    return ORDER_FREEZE_STATUS.TOTAL;
  return null;
};

export const isPartlyFrozen = (date, supplier, options) => {
  const periodType = options.periodType;
  const leadTime = options.leadTimes?.[supplier];
  const lastDayOfMonth = helper.dateStrToLastDate(date, periodType);

  if (options.isAggregated || periodType === "day") return false;
  // if leadTimeDate is sunday (index 0 in dayjs) the period is not partly but fully frozen
  if (periodType === "week" && leadTime?.day() === 0) return false;
  // if leadTimeDate is last day of month the period is not partly but fully frozen
  if (periodType === "month" && lastDayOfMonth.isSame(leadTime)) return false;
  const startDate = helper.periodStartOrEnd(date, periodType, "start");
  const endDate = helper.periodStartOrEnd(date, periodType, "end");
  return helper.dateIsBetween(
    leadTime?.format("YYYY-MM-DD"),
    startDate,
    endDate,
    "[]"
  );
};
