import Vue from "vue";
import dayjs from "@/dayjs";

const state = {
  submittedSources: {},
  submittedProducts: {},
  submittedStartDate: null,
  submittedEndDate: null
};

const getters = {
  getSubmittedEndDate: state => {
    return dayjs(state.submittedEndDate);
  }
};

const mutations = {
  updateSubmittedOptions: (
    state,
    {
      submittedSources,
      submittedProducts,
      submittedStartDate,
      submittedEndDate
    }
  ) => {
    Vue.set(state, "submittedSources", submittedSources);
    Vue.set(state, "submittedProducts", submittedProducts);
    Vue.set(state, "submittedStartDate", submittedStartDate);
    Vue.set(state, "submittedEndDate", submittedEndDate);
  }
};

const actions = {
  updateSubmittedOptions: ({ commit, rootState, rootGetters }) => {
    const submittedOptions = {
      submittedSources: rootState.data.selectedOptions.selectedSources,
      submittedProducts: rootGetters["common/getSelectedProducts"],
      submittedStartDate: rootGetters["data/getSelectedStartDate"],
      submittedEndDate: rootGetters["data/getSelectedEndDate"]
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
