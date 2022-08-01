import Vue from "vue";
import NotificationService from "@/services/notification.service";
import DataService from "@/services/data.service";
import { Data } from "@/objects/data";

const getDefaultState = () => {
  return {
    isLoading: false,
    chartData: {}
  };
};

// initial state
const state = getDefaultState();

const getters = {
  getHasDataToShow: state => state.chartData?.labels?.length > 0 ?? false,
  getIsLoading: state => {
    return state.isLoading;
  }
};

const mutations = {
  resetSources(state) {
    Vue.set(state, "stock", []);
    Vue.set(state, "historicalDemand", []);
    Vue.set(state, "orders", []);
    Vue.set(state, "latestStockQt", {});
  },
  updateIsLoading: (state, isLoading) => {
    Vue.set(state, "isLoading", isLoading);
  },
  updateChartData: (state, chartData) => {
    Vue.set(state, "chartData", chartData);
  },
  resetState(state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState());
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  updateDataPage: async ({ commit, dispatch, rootState }) => {
    commit("updateIsLoading", true);
    try {
      dispatch("data/updateSubmittedOptions", null, { root: true });
      commit("resetSources");
      const productSiteIds = Object.values(
        rootState.data.submittedOptions.submittedProducts
      ).map(product => product.id);
      const startDate = rootState.data.submittedOptions.submittedStartDate;
      const endDate = rootState.data.submittedOptions.submittedEndDate;
      const submittedSources = rootState.data.submittedOptions.submittedSources;
      const sources = Object.keys(submittedSources).filter(
        source => submittedSources[source]
      );
      let chartData = await DataService.fetchChartData({
        productSiteIds,
        startDate,
        endDate,
        sources
      });
      chartData = Data.formatDataForDataChart(chartData, sources);
      commit("updateChartData", chartData);
    } catch (error) {
      NotificationService.error(error.message);
      throw error;
    }
    commit("updateIsLoading", false);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
