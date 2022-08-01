import Vue from "vue";
import dayjs from "@/dayjs";
import { store } from "@/store/store";
import {
  DEFAULT_DEMAND_HORIZONS,
  PERIOD_TYPES,
  subtractFromDate,
  addToDate,
  currentDate
} from "@/helper/date";

const state = {
  selectedCustomerSiteId: null,
  selectedPeriodType: PERIOD_TYPES.WEEK,
  selectedStartDate: subtractFromDate(
    currentDate(),
    DEFAULT_DEMAND_HORIZONS.PAST.MONTHS,
    PERIOD_TYPES.MONTH
  ),
  selectedEndDate: addToDate(
    currentDate(),
    DEFAULT_DEMAND_HORIZONS.FUTURE.MONTHS,
    PERIOD_TYPES.MONTH
  )
};

const getters = {
  getSelectedCustomerSiteId: state => {
    return state.selectedCustomerSiteId;
  },
  getSelectedPeriodType: state => {
    return state.selectedPeriodType;
  },
  getSelectedStartDate: state => {
    return state.selectedStartDate;
  },
  getSelectedEndDate: state => {
    return state.selectedEndDate;
  }
};

const mutations = {
  updateSelectedCustomerSiteId: (state, selectedCustomerSiteId) => {
    Vue.set(state, "selectedCustomerSiteId", selectedCustomerSiteId);
  },
  updateSelectedStartDate: (state, selectedStartDate) => {
    Vue.set(state, "selectedStartDate", selectedStartDate);
  },
  updateSelectedEndDate: (state, selectedEndDate) => {
    Vue.set(state, "selectedEndDate", selectedEndDate);
  },
  updateSelectedPeriodType: (state, selectedPeriodType) => {
    Vue.set(state, "selectedPeriodType", selectedPeriodType);
  }
};

const actions = {
  updateSelectedCustomerSiteId: async ({ commit }, selectedCustomerSiteId) => {
    commit("updateSelectedCustomerSiteId", selectedCustomerSiteId);
    store.dispatch("common/updateSelectedProducts", {}, { root: true });
    await store.dispatch(
      "common/fetchProducts",
      { pattern: "", customerId: selectedCustomerSiteId },
      { root: true }
    );
  },
  updateSelectedPeriodType: ({ commit }, payload) => {
    commit("updateSelectedPeriodType", payload);
  },
  updateSelectedStartDate: ({ commit }, payload) => {
    commit("updateSelectedStartDate", payload);
  },
  updateSelectedEndDate: ({ commit }, payload) => {
    commit("updateSelectedEndDate", payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
