import Vue from "vue";
import dayjs from "@/dayjs";

const state = {
  selectedSources: {
    stock: true,
    historicalDemand: true,
    orders: true
  },
  hasSelectedSourcesError: false,
  selectedStartDate: dayjs().subtract(6, "month"),
  selectedEndDate: dayjs()
};

const getters = {
  getSelectedSources: state => {
    return state.selectedSources;
  },
  getHasSelectedSourcesError: state => {
    return state.hasSelectedSourcesError;
  },
  getSelectedStartDate: state => {
    return dayjs(state.selectedStartDate);
  },
  getSelectedEndDate: state => {
    return dayjs(state.selectedEndDate);
  }
};

const mutations = {
  updateSelectedSources: (state, selectedSources) => {
    Vue.set(state, "selectedSources", selectedSources);
  },
  updateHasSelectedSourcesError: (state, hasSourcesError) => {
    Vue.set(state, "hasSelectedSourcesError", hasSourcesError);
  },
  updateSelectedStartDate: (state, selectedStartDate) => {
    Vue.set(state, "selectedStartDate", selectedStartDate);
  },
  updateSelectedEndDate: (state, selectedEndDate) => {
    Vue.set(state, "selectedEndDate", selectedEndDate);
  }
};

const actions = {
  toggleSelectedSource: ({ commit, getters }, source) => {
    commit("updateHasSelectedSourcesError", false);
    const selectedSources = getters.getSelectedSources;
    selectedSources[source] = !selectedSources[source];
    commit("updateSelectedSources", selectedSources);
  },
  updateHasSelectedSourcesError: ({ commit }, payload) => {
    commit("updateHasSelectedSourcesError", payload);
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
