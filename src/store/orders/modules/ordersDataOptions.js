import Vue from "vue";

const getDefaultState = () => ({
  statusIdFilter: 1,
  sort: "asc",
  keywordSearch: ""
});

const state = getDefaultState();

const getters = {
  getStatusIdFilter: state => state.statusIdFilter,
  getSort: state => state.sort,
  getStatusIdFilterForRequest: state => {
    const { sort } = state;
    if (!sort) return;
    return { name: "date", sort };
  },
  getKeywordSearch: state => state.keywordSearch
};

const mutations = {
  updateStatusIdFilter: (state, payload) =>
    Vue.set(state, "statusIdFilter", payload),
  updateSort: (state, payload) => Vue.set(state, "sort", payload),
  updateKeywordSearch: (state, payload) =>
    Vue.set(state, "keywordSearch", payload.toLowerCase()),
  resetState: state => Object.assign(state, getDefaultState())
};

const actions = {
  updateStatusIdFilter: ({ commit }, payload) =>
    commit("updateStatusIdFilter", payload),
  updateSort: ({ commit }, payload) => {
    commit("updateSort", payload);
  },
  updateKeywordSearch: ({ commit }, payload) => {
    commit("updateKeywordSearch", payload);
  },
  resetState: ({ commit }) => commit("resetState")
};
export default {
  state,
  getters,
  mutations,
  actions
};
