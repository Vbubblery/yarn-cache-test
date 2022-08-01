import Vue from "vue";

const state = {
  submittedSources: {},
  submittedProducts: {},
  submittedTags: {},
  submittedMultipleMethod: null,
  submittedEndDate: null,
  submittedPeriodType: null,
  updatingCount: 0,
  tablesWithChanges: []
};

const getters = {
  getSubmittedOptions: state => state,
  getUpdatingCount: state => state.updatingCount,
  getHasTablesWithChanges: state => state.tablesWithChanges.length > 0
};

const mutations = {
  setUpdatingCount: (state, count) => {
    Vue.set(state, "updatingCount", state.updatingCount + count);
  },
  addToTablesWithChanges: (state, tableId) => {
    if (!state.tablesWithChanges.includes(tableId))
      state.tablesWithChanges.push(tableId);
  },
  removeFromTablesWithChanges: (state, tableId) => {
    if (state.tablesWithChanges.includes(tableId)) {
      const filteredTablesWithChanges = state.tablesWithChanges.filter(
        item => item !== tableId
      );
      Vue.set(state, "tablesWithChanges", filteredTablesWithChanges);
    }
  },
  resetTablesWithChanges: state => {
    Vue.set(state, "tablesWithChanges", []);
  },
  updateSubmittedOptions: (
    state,
    {
      submittedSources,
      submittedProducts,
      submittedEndDate,
      submittedPeriodType,
      submittedMultipleMethod,
      submittedTags,
      onlyTable,
      planningPage
    }
  ) => {
    Vue.set(state, "submittedSources", submittedSources);
    Vue.set(state, "submittedProducts", submittedProducts);
    Vue.set(state, "submittedEndDate", submittedEndDate);
    Vue.set(state, "submittedPeriodType", submittedPeriodType);
    Vue.set(state, "submittedMultipleMethod", submittedMultipleMethod);
    Vue.set(state, "submittedTags", submittedTags);
    Vue.set(state, "onlyTable", onlyTable);
    Vue.set(state, "planningPage", planningPage);
  }
};

const actions = {
  updateSubmittedOptions: ({ commit, rootState, rootGetters }) => {
    const submittedOptions = {
      submittedSources: rootState.planning.selectedOptions.selectedSources,
      submittedProducts: rootGetters["common/getSelectedProducts"],
      submittedEndDate: rootGetters["planning/getSelectedEndDate"],
      submittedPeriodType: rootGetters["planning/getSelectedPeriodType"],
      submittedMultipleMethod: rootGetters["common/getSelectedMultipleMethod"],
      submittedTags: rootGetters["common/getSelectedTags"],
      onlyTable: rootGetters["planning/getOnlyTable"],
      planningPage: rootGetters["planning/getPage"]
    };
    commit("updateSubmittedOptions", submittedOptions);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
