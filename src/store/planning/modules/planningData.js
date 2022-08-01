import Vue from "vue";
import helper from "@/helper/helper";
import PlanningService from "@/services/planning.service";
import NotificationService from "@/services/notification.service";

const getDefaultState = () => {
  return {
    isLoadingChart: false,
    isLoadingTables: false,
    tablesData: {},
    chartData: {},
    onlyTable: false,
    page: 1,
    noData: false
  };
};

// initial state
const state = getDefaultState();

const getters = {
  getIsLoadingChart: state => {
    return state.isLoadingChart;
  },
  getIsLoadingTables: state => {
    return state.isLoadingTables;
  },
  getTablesData: state => {
    return state.tablesData;
  },
  getChartData: state => {
    return state.chartData;
  },
  getPage: state => {
    return state.page;
  },
  getOnlyTable: state => {
    return state.onlyTable;
  },
  getNoData: state => {
    return state.noData;
  }
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
  updateTablesData: (state, payload) => {
    if (!payload || payload.length === 0) return;
    Vue.set(state, "tablesData", payload);
  },
  updateChartData: (state, payload) => {
    if (!payload || helper.isEmpty(payload)) return;
    if (!!payload.labels.length) payload.labels[0] = "currentDay";
    const sources = [
      {
        name: "intervalMax",
        backgroundColor: "rgba(234, 254, 230,0.61)",
        borderColor: "rgba(70, 182, 44, 0.61)",
        borderDash: [4, 8],
        type: "line"
      },
      {
        name: "intervalMin",
        backgroundColor: "rgba(234, 254, 230,0.61)",
        borderColor: "rgba(70, 182, 44, 0.61)",
        borderDash: [4, 8],
        type: "line"
      },
      {
        name: "Stock",
        backgroundColor: "#AF48FF",
        borderColor: "#AF48FF",
        borderWidth: 1,
        type: "line"
      },
      {
        name: "firmOrders",
        backgroundColor: "rgba(74, 133, 202, 1)",
        borderColor: "rgba(74, 133, 202, 1)",
        stack: "orders",
        type: "bar",
        barPercentage: 0.5
      },
      {
        name: "allOrders",
        backgroundColor: "rgba(163, 205, 255, 1)",
        borderColor: "rgba(163, 205, 255, 1)",
        stack: "orders",
        type: "bar",
        barPercentage: 0.5
      }
    ];
    if ((payload.datasets || []).findIndex(d => d.label === "Expired") > 0) {
      sources.splice(3, 0, {
        name: "Expired",
        backgroundColor: "rgba(255,144,64,0.9)",
        borderColor: "rgba(255,144,64,0.9)",
        type: "bar",
        barPercentage: 0.5,
        stack: "expired"
      });
    }
    const datasets =
      payload.datasets?.map((d, i) => {
        if (
          sources[i]?.name === "firmOrders" ||
          sources[i]?.name === "allOrders"
        )
          d.data[0] = NaN;
        return {
          ...d,
          source: sources[i]?.name ?? "",
          backgroundColor: sources[i]?.backgroundColor ?? d.backgroundColor,
          borderColor: sources[i]?.borderColor ?? d.borderColor,
          fill: i === 0 ? "+1" : false,
          pointHitRadius: 0,
          pointRadius: 0,
          borderDash: sources[i]?.borderDash ?? [(3, 4)],
          borderWidth: sources[i]?.borderWidth ?? 1,
          borderCapStyle: "round",
          stack: sources[i].stack,
          type: sources[i].type,
          barPercentage: sources[i].barPercentage
        };
      }) ?? [];
    Vue.set(state, "chartData", { ...payload, datasets });
  },
  updatePage: (state, page) => {
    Vue.set(state, "page", page);
  },
  updateOnlyTable: (state, onlyTable) => {
    Vue.set(state, "onlyTable", onlyTable);
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
  updateChartDataFromTableData: (
    state,
    { indexFrom, status3SuppliesDelta, plannedSuppliesDelta, stockDelta }
  ) => {
    const clonedChartData = { ...state.chartData };
    const currentChartStockData = clonedChartData.datasets.find(p =>
      p.source.includes("Stock")
    );
    const currentChartStatus3SuppliesData = clonedChartData.datasets.find(
      p => p.source === "firmOrders"
    );
    const currentChartPlannedSuppliesData = clonedChartData.datasets.find(
      p => p.source === "allOrders"
    );
    for (let i = indexFrom; i < currentChartStockData.data.length; i++) {
      currentChartStockData.data[i] += stockDelta;
    }
    currentChartStatus3SuppliesData.data[indexFrom] += status3SuppliesDelta;
    currentChartPlannedSuppliesData.data[indexFrom] += plannedSuppliesDelta;
    Vue.set(state, "chartData", clonedChartData);
  },
  resetChartData: (
    state,
    { stockDeltas, ordersDeltas, status3SuppliesDeltas }
  ) => {
    const clonedChartData = { ...state.chartData };
    const currentChartStockData = clonedChartData.datasets.find(p =>
      p.source.includes("Stock")
    );
    const currentChartStatus3SuppliesData = clonedChartData.datasets.find(
      p => p.source === "firmOrders"
    );
    const currentChartPlannedSuppliesData = clonedChartData.datasets.find(
      p => p.source === "allOrders"
    );
    if (stockDeltas) {
      currentChartStockData.data = currentChartStockData.data.map(
        (val, index) => val + stockDeltas[index]
      );
    }
    if (ordersDeltas) {
      currentChartPlannedSuppliesData.data =
        currentChartPlannedSuppliesData.data.map(
          (val, index) => val + ordersDeltas[index]
        );
    }
    if (status3SuppliesDeltas) {
      currentChartStatus3SuppliesData.data =
        currentChartStatus3SuppliesData.data.map(
          (val, index) => val + status3SuppliesDeltas[index]
        );
    }
    Vue.set(state, "chartData", clonedChartData);
  },
  updateNoData: (state, bool) => {
    Vue.set(state, "noData", bool);
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  updatePlanningData: async (
    { rootState, rootGetters, commit, dispatch },
    page = null
  ) => {
    try {
      commit("updatePage", page || 1);
      dispatch("planning/updateSubmittedOptions", null, { root: true });
      commit("updateNoData", false);
      const options = rootState.planning.submittedOptions;
      const sources = Object.keys(options.submittedSources);
      const params = {
        startDate: options.submittedStartDate,
        endDate: options.submittedEndDate,
        periodType: options.submittedPeriodType,
        sources: sources.filter(s => options.submittedSources[s]),
        isAggregated: false,
        withChart: page == null,
        withTable: true,
        page: page || 1
      };
      if (rootGetters["common/getDataType"] === "product") {
        const products = Object.values(options.submittedProducts);
        params.productSiteIds = products.map(p => p.id);
      } else {
        params.tagIds = Object.values(options.submittedTags).map(t => t.id);
      }

      commit("updateIsLoadingChart", params.withChart);
      commit("updateIsLoadingTables", params.withTable);

      if (params.withChart) {
        // load aggregated chart separately in disaggregated mode
        const tableChart = await PlanningService.fetchPlanningData({
          ...params,
          withTable: false,
          isAggregated: true
        });
        if (!helper.isEmpty(tableChart.chart)) {
          commit("updateChartData", tableChart.chart);
        }
        commit("updateIsLoadingChart", false);
        params.withChart = false;
        params.isAggregated = false;
      }
      const tableChart = await PlanningService.fetchPlanningData(params);
      if (!tableChart.table.length && helper.isEmpty(tableChart.chart))
        commit("updateNoData", true);
      if (tableChart.table) commit("updateTablesData", tableChart.table);
      commit("updateIsLoadingTables", false);
    } catch (error) {
      NotificationService.error(error.message);
      throw error;
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
