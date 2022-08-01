import Vue from "vue";

const state = {
  submittedCustomerSiteId: null,
  submittedCustomerCompanyId: null,
  submittedCustomerProductsSiteId: null,
  submittedProducts: {},
  submittedTags: {},
  submittedMultipleMethod: null,
  submittedStartDate: null,
  submittedEndDate: null,
  submittedPeriodType: null,
  isUpdating: false,
  forceReload: true,
  updatingCount: 0,
  tablesWithChanges: []
};

const getters = {
  getSubmittedEndDate: state => {
    return state.submittedEndDate;
  },
  getSubmittedOptions: state => state,
  getIsUpdating: state => state.isUpdating,
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
  setIsUpdating: (state, status) => {
    Vue.set(state, "isUpdating", status);
  },
  setForceReload: (state, status) => {
    Vue.set(state, "forceReload", status);
  },
  updateSubmittedOptions: (
    state,
    {
      submittedCustomerSiteId,
      submittedCustomerCompanyId,
      submittedCustomerProductsSiteId,
      submittedMultipleMethod,
      submittedProducts,
      submittedTags,
      submittedStartDate,
      submittedEndDate,
      submittedPeriodType,
      onlyTable,
      demandPage
    }
  ) => {
    Vue.set(state, "submittedCustomerSiteId", submittedCustomerSiteId);
    Vue.set(state, "submittedCustomerCompanyId", submittedCustomerCompanyId);
    Vue.set(
      state,
      "submittedCustomerProductsSiteId",
      submittedCustomerProductsSiteId
    );
    Vue.set(state, "submittedMultipleMethod", submittedMultipleMethod);
    Vue.set(state, "submittedProducts", submittedProducts);
    Vue.set(state, "submittedTags", submittedTags);
    Vue.set(state, "submittedStartDate", submittedStartDate);
    Vue.set(state, "submittedEndDate", submittedEndDate);
    Vue.set(state, "submittedPeriodType", submittedPeriodType);
    Vue.set(state, "onlyTable", onlyTable);
    Vue.set(state, "demandPage", demandPage);
  }
};

const actions = {
  updateSubmittedOptions: ({ commit, rootState, rootGetters }) => {
    const submittedOptions = {
      submittedCustomerSiteId: rootGetters["common/getCurrentSite"]
        .isSupplierView
        ? rootState.demand.selectedOptions.selectedCustomerSiteId
        : null,
      submittedMultipleMethod: rootGetters["common/getSelectedMultipleMethod"],
      submittedProducts: rootGetters["common/getSelectedProducts"],
      submittedTags: rootGetters["common/getSelectedTags"],
      submittedStartDate: rootGetters["demand/getSelectedStartDate"],
      submittedEndDate: rootGetters["demand/getSelectedEndDate"],
      submittedPeriodType: rootState.demand.selectedOptions.selectedPeriodType,
      onlyTable: rootGetters["demand/getOnlyTable"],
      demandPage: rootGetters["demand/getPage"]
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
