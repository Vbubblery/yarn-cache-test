import SupervisorService from "@/services/supervisor.service";
import { store } from "@/store/store";
import NotificationService from "@/services/notification.service";
import { i18n } from "@/i18n/i18n@next";

export const STOCK_STATUS = {
  OUT_OF_STOCK: "outOfStock",
  ABOVE_MAX: "aboveMax",
  BELOW_MIN: "belowMin",
  ALL_GOOD: "allGood"
};

export const getStatusByValue = (value, index, min, max) => {
  if (index === 0) {
    return undefined;
  }
  if (value <= 0) {
    return STOCK_STATUS.OUT_OF_STOCK;
  } else if (value > max[index]) {
    return STOCK_STATUS.ABOVE_MAX;
  } else if (value < min[index]) {
    return STOCK_STATUS.BELOW_MIN;
  } else {
    return STOCK_STATUS.ALL_GOOD;
  }
};

export const getStockStatusByValue = stock => {
  const minValues = stock.minValues || [];
  const maxValues = stock.maxValues || [];
  if (!minValues || !maxValues) return null;
  return stock.values.map((value, index) => ({
    value,
    status: getStatusByValue(value, index, minValues, maxValues),
    isPast: index === 0
  }));
};

export const StorageSitesLoader = {
  async fetch(payload) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const storageSitesDetailsURI = `/api/v1/sites/${siteId}/planning/storage_sites`;
    try {
      const { data } = await SupervisorService.post(storageSitesDetailsURI, {
        product_site_ids: payload.productIds,
        tag_ids: payload.tagIds,
        period_type: payload.periodType,
        start_date: payload.startDate,
        end_date: payload.endDate,
        decimal_precision: payload.decimalPrecision
      });
      return data;
    } catch {
      NotificationService.error(i18n.t("planning.error.storageSites"));
    }
  }
};

export const TransfersLoader = {
  async fetch(payload) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const transfersDetailsURI = `/api/v1/sites/${siteId}/planning/transfers`;
    try {
      const { data } = await SupervisorService.post(transfersDetailsURI, {
        product_site_ids: payload.productIds,
        tag_ids: payload.tagIds,
        period_type: payload.periodType,
        start_date: payload.startDate,
        end_date: payload.endDate,
        decimal_precision: payload.decimalPrecision
      });
      return data;
    } catch {
      NotificationService.error(i18n.t("planning.error.transfers"));
    }
  }
};

export const ExpiredStockLoader = {
  async fetch(payload) {
    const site = store.getters["common/getCurrentSite"];
    if (!site.hasShelfLife || !payload.shouldLoadExpiredStock) return;
    const expiredStockDetailsURI = `/api/v1/sites/${site.id}/planning/expired_stock`;
    try {
      const { data } = await SupervisorService.post(expiredStockDetailsURI, {
        product_site_ids: payload.productIds,
        tag_ids: payload.tagIds,
        period_type: payload.periodType,
        start_date: payload.startDate,
        end_date: payload.endDate,
        decimal_precision: payload.decimalPrecision
      });
      return data;
    } catch {
      NotificationService.error(i18n.t("planning.error.expiredStock"));
    }
  }
};

export const StocksLoader = {
  async fetch(payload) {
    const [expiredStockData, storageSitesData, transfersData] =
      await Promise.all([
        ExpiredStockLoader.fetch(payload),
        StorageSitesLoader.fetch(payload),
        TransfersLoader.fetch(payload)
      ]);
    return { ...expiredStockData, ...storageSitesData, ...transfersData };
  }
};
