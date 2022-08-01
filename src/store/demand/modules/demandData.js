import Vue from "vue";

import NotificationService from "@/services/notification.service";
import DemandService from "@/services/demand.service";
import helper from "@/helper/helper";
import { SOURCE_NAME } from "@/components/base/table/utils/base";
import dayjs from "@/dayjs";

const getDefaultState = () => {
  return {
    isLoadingChart: false,
    isLoadingTables: false,
    tablesData: [],
    dataType: "product",
    selectedSourcesList: ["historicalDemand"],
    chartData: {},
    onlyTable: false,
    page: 1,
    per_page: 10,
    beginDate: dayjs(),
    noData: false,
    units: []
  };
};

// initial state
const state = getDefaultState();

const getters = {
  getIsLoadingChart: state => state.isLoadingChart,
  getIsLoadingTables: state => state.isLoadingTables,
  getTablesData: state => state.tablesData,
  getChartData: state => state.chartData,
  getPage: state => state.page,
  getOnlyTable: state => state.onlyTable,
  getNoData: state => state.noData,
  getUnits: state => state.units,
  getBeginDate: state => state.beginDate
};

const mutations = {
  resetState(state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState());
  },
  updateIsLoadingChart: (state, isLoading) => {
    Vue.set(state, "isLoadingChart", isLoading);
  },
  updateIsLoadingTables: (state, isLoading) => {
    Vue.set(state, "isLoadingTables", isLoading);
  },
  updateChartData: (state, payload) => {
    Vue.set(state, "chartData", payload);
  },
  updateTablesData: (state, payload) => {
    Vue.set(state, "tablesData", payload);
  },
  updateBeginDate: (state, beginDate) => {
    Vue.set(state, "beginDate", beginDate);
  },
  updateChartDataFromTableData: (state, { value, periodId }) => {
    const clonedChartData = { ...state.chartData };
    clonedChartData.datasets.forEach(dataset => {
      if (dataset.source === SOURCE_NAME.FINAL_DEMAND_FORECAST) {
        dataset.data[periodId] = value;
      }
    });
    Vue.set(state, "chartData", clonedChartData);
  },
  updatePage: (state, page) => {
    Vue.set(state, "page", page);
  },
  updateOnlyTable: (state, onlyTable) => {
    Vue.set(state, "onlyTable", onlyTable);
  },

  updateNoData: (state, bool) => {
    Vue.set(state, "noData", bool);
  },
  updateUnits: (state, units) => {
    Vue.set(state, "units", units);
  },
  switchUnitChartData: (state, payload) => {
    const { v1, v2 } = payload;
    const chartData = helper.clone(state.chartData);
    const datasets = chartData.datasets;
    datasets.map(dataset => {
      dataset.data = dataset.data.map(d => {
        if (d) return (d / v2) * v1;
        else return d;
      });
    });
    Vue.set(state, "chartData", chartData);
  },
  resetChartData: (state, dataToUse) => {
    const clonedChartData = { ...state.chartData };
    const currentChartData = clonedChartData.datasets.find(
      p => p.source === SOURCE_NAME.FINAL_DEMAND_FORECAST
    );
    currentChartData.data = currentChartData.data.map(
      (val, index) => val + dataToUse[index]
    );
    Vue.set(state, "chartData", clonedChartData);
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  updateTablesData: ({ commit }, payload) => {
    commit("updateTablesData", payload);
  },
  formatChartData: ({ commit, rootGetters }, payload) => {
    if (!payload || !payload.length) {
      commit("updateChartData", null);
      return;
    }

    // the graph always contains aggregated data - check all units are the same
    if (payload?.length > 0)
      commit("updateUnits", payload[0].units?.units ?? []);
    const datasetsObj = {};
    const sourceTranslation = {};
    if (rootGetters["common/getCurrentSite"].isSupplierView) {
      sourceTranslation.firm_orders = {
        source: "firmOrders",
        color: "#2DCCD9",
        borderColor: "#2DCCD9"
      };
      sourceTranslation.all_orders = {
        source: "allOrders",
        color: "#7607CD",
        borderColor: "#7607CD"
      };
      sourceTranslation.demand = {
        source: "supplierDemand",
        color: "#505050",
        borderColor: "#505050"
      };
    } else {
      sourceTranslation.demand = {
        source: "historicalDemand",
        color: "#0053B5",
        borderColor: "#0053B5"
      };
      sourceTranslation.demand_final_forecast = {
        source: "demandFinalForecast",
        color: "#D0518E",
        borderColor: "#D0518E"
      };
      sourceTranslation.demand_forecast_flowlity = {
        source: "demandForecastFlowlity",
        color: "#1A8700",
        borderColor: "#1A8700"
      };
      sourceTranslation.max_forecast_flowlity = {
        source: "maxFlowPred",
        color: "rgba(234, 254, 230, 0.81)",
        borderColor: "#46B62C"
      };
      sourceTranslation.min_forecast_flowlity = {
        source: "minFlowPred",
        color: "rgba(234, 254, 230, 0.81)",
        borderColor: "#46B62C"
      };
    }
    const timebucket = payload[0].timebucket;
    const periods = payload.length ? payload[0].periods : [];
    Object.keys(sourceTranslation).map(source => {
      const chartValues = [];
      let currentPeriod = periods[0];
      periods.map((period, index) => {
        const isFuture = helper.isFutureDate(period, timebucket);
        const isCurrent = helper.isDateStrCurrentPeriod(period, timebucket);
        const isPast = !isFuture && !isCurrent;
        if (isCurrent) currentPeriod = period;
        const sum = (a, b) => a + b;
        let val = payload.map(p => p[source][index]).reduce(sum, 0);
        if (
          (source === "demand" && isFuture) ||
          ([
            "max_forecast_flowlity",
            "min_forecast_flowlity",
            "all_orders"
          ].includes(source) &&
            isPast)
        ) {
          val = null;
        }

        chartValues.push(val);
      });
      const dataset = {
        source: sourceTranslation[source].source,
        data: chartValues,
        backgroundColor: sourceTranslation[source].color,
        borderColor: sourceTranslation[source].borderColor,
        borderWidth: [
          "max_forecast_flowlity",
          "min_forecast_flowlity"
        ].includes(source)
          ? 1
          : 1.5,
        pointHitRadius: 0,
        pointRadius: 0,
        borderDash: ["max_forecast_flowlity", "min_forecast_flowlity"].includes(
          source
        )
          ? [4, 8]
          : undefined,
        borderCapStyle: [
          "max_forecast_flowlity",
          "min_forecast_flowlity"
        ].includes(source)
          ? "round"
          : undefined,
        fill: source === "max_forecast_flowlity" ? "+1" : false,
        dottedFromLabel: [
          "max_forecast_flowlity",
          "min_forecast_flowlity",
          "demand"
        ].includes(source)
          ? undefined
          : helper.tableHeaderDateDisplay(currentPeriod, timebucket)
      };
      datasetsObj[source] = dataset;
    });
    commit("updateChartData", {
      labels: payload[0].periods,
      datasets: Object.values(datasetsObj),
      timebucket
    });
  },
  formatTablesData: ({ rootState, rootGetters, commit }, payload) => {
    const tablesData = payload.map(p => {
      let sources = state.selectedSourcesList.slice();
      const data = {
        historicalDemand: { values: p.demand, asideColor: "#0053B5" }
      };
      if (rootGetters["common/getCurrentSite"].isSupplierView) {
        sources.unshift("allOrders");
        data.allOrders = { values: p.all_orders, asideColor: "#7607CD" };
        sources.unshift("firmOrders");
        data.firmOrders = { values: p.firm_orders, asideColor: "#2DCCD9" };
      } else {
        sources.push(
          "demandFinalForecast",
          ...(rootGetters["common/getCurrentSite"].displayFirmOrdersInDemand
            ? ["salesOrders"]
            : []),
          "demandForecastClient",
          "demandForecastFlowlity",
          ...(rootGetters["common/getCurrentSite"].displayDemandForecastExternal
            ? ["demandForecastExternal"]
            : []),
        );
        if (rootGetters["common/getCurrentSite"].displayFirmOrdersInDemand) {
          data.salesOrders = {
            indent: true,
            values: p.sales_orders,
            icon: { name: "shopping-cart-fill", color: "#637691" }
          };
        }
        data.demandForecastClient = {
          indent: true,
          values: p.demand_forecast_client,
          icon: { name: "file-edit-fill", color: "#637691" }
        };
        data.demandFinalForecast = {
          indent: false,
          values: p.demand_final_forecast,
          asideColor: "#D0518E"
        };
        if (
          rootGetters["common/getCurrentSite"].displayDemandForecastExternal
        ) {
          data.demandForecastExternal = {
            indent: false,
            values: p.demand_forecast_external,
            icon: {
              name: "rectangle-flowlity-3",
              color: "#BF5300"
            }
          };
        }
        data.demandForecastFlowlity = {
          indent: true,
          values: p.demand_forecast_flowlity,
          icon: { name: "rectangle-flowlity", color: "#46B62C" }
        };
      }
      return {
        isAggregated: p.isAggregated || false,
        data: data,
        periodType: rootState.demand.submittedOptions.submittedPeriodType,
        periods: p.periods,
        productId: p.product_site_id,
        name: p.name,
        units: p.units,
        demandType: p.demand_type,
        sources: sources,
        total: p.total,
        productSiteIds: p.productSiteIds,
        tagIds: p.tagIds,
        productData: p.isAggregated
          ? null
          : {
              id: p.product_site_id,
              name: p.name,
              externalId: p.external_id,
              demandFrozenHorizonDaysCount: p.nb_days_mto,
              isMto: p.is_mto
            }
      };
    });
    commit("updateTablesData", tablesData);
  },
  fetchDemandData: async ({ commit, rootState, rootGetters, dispatch }) => {
    dispatch("demand/updateSubmittedOptions", null, { root: true });
    commit("updateNoData", false);
    const options = rootState.demand.submittedOptions;
    try {
      const periodType = options.submittedPeriodType;
      const params = {
        siteId: rootGetters["common/getCurrentSite"].id,
        periodType,
        startDate: options.submittedStartDate,
        endDate: options.submittedEndDate,
        isAggregated: false,
        customerId: rootGetters["demand/getSelectedCustomerSiteId"],
        page: options.demandPage
      };

      if (rootGetters["common/getDataType"] === "product") {
        const products = Object.values(options.submittedProducts);
        params.productSiteIds = products.map(p => p.id);
        params.isAggregated = products.length >= 2;
      } else {
        params.tagIds = Object.values(options.submittedTags).map(tag => tag.id);
        params.isAggregated = true;
      }
      if (options.forceReload) {
        commit("updateIsLoadingChart", !options.onlyTable);
        commit("updateIsLoadingTables", true);
      }

      const fetchChart = !options.onlyTable && !params.isAggregated;
      if (fetchChart) {
        // load aggregated chart separately in dissagregated mode
        const result = await DemandService.fetchDemandData({
          ...params,
          isAggregated: true
        });
        await dispatch("formatChartData", result.basic_data);
        commit("updateIsLoadingChart", false);
      }

      const result = await DemandService.fetchDemandData(params);
      if (!result.basic_data.length) commit("updateNoData", true);
      else if (params.isAggregated) {
        result.basic_data[0].productSiteIds = params.productSiteIds;
        result.basic_data[0].tagIds = params.tagIds;
      }
      if (!fetchChart && !options.onlyTable)
        await dispatch("formatChartData", result.basic_data);
      await dispatch("formatTablesData", result.basic_data);
    } catch (error) {
      NotificationService.error(error.message);

      throw error;
    }
    if (options.forceReload) {
      commit("updateIsLoadingChart", false);
      commit("updateIsLoadingTables", false);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
