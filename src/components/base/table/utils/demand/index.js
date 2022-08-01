import { store } from "@/store/store";

export const DEMAND_SOURCE_NAMES_REGULAR_VIEW = {
  MY_DEMAND_FORECAST: "demandForecastClient",
  EXTERNAL_DEMAND_FORECAST: "demandForecastExternal",
  FLOWLITY_DEMAND_FORECAST: "demandForecastFlowlity",
  FINAL_DEMAND_FORECAST: "demandFinalForecast",
  SALES_ORDERS: "salesOrders",
  PAST_DEMAND: "historicalDemand"
};

export const DEMAND_SOURCE_NAMES_SUPPLIER_VIEW = {
  PAST_DEMAND: "historicalDemand",
  FIRM_ORDERS: "firmOrders",
  ALL_ORDERS: "allOrders"
};

export const DEMAND_SOURCE_NAMES = {
  ...DEMAND_SOURCE_NAMES_REGULAR_VIEW,
  ...DEMAND_SOURCE_NAMES_SUPPLIER_VIEW
};

export const DemandSourcesTranslator = {
  _sourceTranslation: {
    backToFront: {},
    frontToBack: {}
  },

  _addFrontAndBackNames(frontName, backName) {
    this._sourceTranslation.backToFront[backName] = frontName;
    this._sourceTranslation.frontToBack[frontName] = backName;
  },

  init() {
    if ((store.getters["common/getCurrentSite"] || {}).isSupplierView) {
      this._addFrontAndBackNames("historicalDemand", "demand");
      this._addFrontAndBackNames("firmOrders", "firm_orders");
      this._addFrontAndBackNames("allOrders", "all_orders");
    } else {
      this._addFrontAndBackNames(
        DEMAND_SOURCE_NAMES_REGULAR_VIEW.PAST_DEMAND,
        "demand"
      );
      this._addFrontAndBackNames(
        DEMAND_SOURCE_NAMES_REGULAR_VIEW.SALES_ORDERS,
        "sales_orders"
      );
      this._addFrontAndBackNames(
        DEMAND_SOURCE_NAMES_REGULAR_VIEW.FINAL_DEMAND_FORECAST,
        "demand_final_forecast"
      );
      this._addFrontAndBackNames(
        DEMAND_SOURCE_NAMES_REGULAR_VIEW.FLOWLITY_DEMAND_FORECAST,
        "demand_forecast_flowlity"
      );
      this._addFrontAndBackNames(
        DEMAND_SOURCE_NAMES_REGULAR_VIEW.MY_DEMAND_FORECAST,
        "demand_forecast_client"
      );
      this._addFrontAndBackNames(
        DEMAND_SOURCE_NAMES_REGULAR_VIEW.EXTERNAL_DEMAND_FORECAST,
        "demand_forecast_external"
      );
    }
  },

  translate(name, direction) {
    if (!["back", "front"].includes(direction))
      throw new Error("direction can either be 'front' or 'back'");
    const dictName = direction === "back" ? "frontToBack" : "backToFront";
    return this._sourceTranslation[dictName][name];
  }
};

export const getIsMediumFontBySourceName = sourceName => {
  switch (true) {
    case sourceName === DEMAND_SOURCE_NAMES_REGULAR_VIEW.FINAL_DEMAND_FORECAST:
    case sourceName.startsWith(
      `${DEMAND_SOURCE_NAMES_REGULAR_VIEW.FINAL_DEMAND_FORECAST}-`
    ):
      return true;
    default:
      return false;
  }
};

export {
  getMyForecastValues,
  getOptionsForMyForecast,
  MyForecastLoader,
  myForecastCalc
} from "./myForecast";

export { pastDemandCalc, getPastDemandValues } from "./pastDemand";
