import DemandService from "@/services/demand.service";
import {
  DEMAND_SOURCE_NAMES_REGULAR_VIEW,
  DEMAND_SOURCE_NAMES_SUPPLIER_VIEW,
  DemandSourcesTranslator
} from "./index";
import { isNotPast, isNotInDemandFrozenHorizon } from "../base";
import { store } from "@/store/store";

export const getMyForecastValues = (myForecastValues, options) => {
  return myForecastValues.values.map((value, index) => {
    return {
      value,
      isByFlowlity: false,
      status: undefined,
      isFrozen: false,
      isPast: !isNotPast(index, options.periods, options.periodType),
      isEditable:
        (!options.isAggregated || (options.isAggregated && !options.isChild)) &&
        options.access &&
        isNotPast(index, options.periods, options.periodType) &&
        isNotInDemandFrozenHorizon(index, options?.headers)
    };
  });
};

export const getOptionsForMyForecast = options => ({
  isChild: options.isChild,
  periodType: options.periodType,
  periods: options.periods,
  isAggregated: options.isAggregated,
  access: options.access
});

export const myForecastCalc = (item, roundFunc) => {
  if (isNaN(item.value)) return "-";
  if (!item.value) return item.value;
  return roundFunc(item.value);
};

export const MyForecastLoader = {
  _totalSubItems: null,

  _updateTotalSubItems(backendData) {
    this._totalSubItems = backendData[0].total;
  },
  _formatData(productsData) {
    DemandSourcesTranslator.init();
    const result = {};
    const isSupplierView = (store.getters["common/getCurrentSite"] || {})
      .isSupplierView;
    productsData.forEach(productData => {
      Object.values(
        isSupplierView
          ? DEMAND_SOURCE_NAMES_SUPPLIER_VIEW
          : DEMAND_SOURCE_NAMES_REGULAR_VIEW
      ).forEach(sourceName => {
        const translatedSourceName = DemandSourcesTranslator.translate(
          sourceName,
          "back"
        );
        const subItemName = sourceName + "-" + productData.name;
        result[subItemName] = {
          displayName: productData.name,
          values: productData[translatedSourceName],
          parent: sourceName,
          productId: productData.product_site_id
        };
      });
    });
    return result;
  },

  getTotalSubItems() {
    return this._totalSubItems;
  },
  async fetch(payload) {
    const { basic_data } = await DemandService.fetchDemandData(payload);
    this._updateTotalSubItems(basic_data);
    return this._formatData(basic_data);
  }
};
