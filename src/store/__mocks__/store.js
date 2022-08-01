import Vue from "vue";
import Vuex from "vuex";

import common from "./common/common";
import data from "./data/data";
import planning from "./planning/planning";
import orders from "./orders/orders";
import demand from "./demand/demand";
import alerts from "./alerts/alerts";
import dashboard from "./dashboard/dashboard";

Vue.use(Vuex);

export const state = {};

export const getters = {};

export const modules = {
  data,
  common,
  planning,
  orders,
  demand,
  alerts,
  dashboard
};

export const mutations = {
  reset: jest.fn()
};

export const actions = {};

export function createMocks(
  custom = { state: {}, getters: {}, mutations: {}, actions: {}, modules: {} }
) {
  const mockState = Object.assign({}, state, custom.state);
  const mockGetters = Object.assign({}, getters, custom.getters);
  const mockMutations = Object.assign({}, mutations, custom.mutations);
  const mockActions = Object.assign({}, actions, custom.actions);
  const mockModules = Object.assign({}, modules, custom.modules);

  return {
    state: mockState,
    getters: mockGetters,
    mutations: mockMutations,
    actions: mockActions,
    modules: mockModules,
    store: new Vuex.Store({
      state: mockState,
      getters: mockGetters,
      mutations: mockMutations,
      actions: mockActions,
      modules: mockModules
    })
  };
}

export const store = createMocks().store;
