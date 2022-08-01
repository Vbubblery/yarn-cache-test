import Vue from "vue";
import Vuex from "vuex";
// Modules
import common from "./common/common";
import data from "./data/data";
import planning from "./planning/planning";
import orders from "./orders/orders";
import demand from "./demand/demand";
import alerts from "./alerts/alerts";
import dashboard from "./dashboard/dashboard";

Vue.use(Vuex);
let store;
try {
  store = new Vuex.Store({
    modules: {
      data,
      common,
      planning,
      orders,
      demand,
      alerts,
      dashboard
    },
    mutations: {
      reset(state) {
        Object.keys(state).forEach(key => {
          Object.assign(state[key], initialState[key]);
          if (!Object.prototype.hasOwnProperty.call(initialState, key)) {
            delete state[key];
          }
        });
      }
    }
  });
  const initialState = JSON.parse(JSON.stringify(store.state));
  // eslint-disable-next-line no-empty
} catch (error) {}

export { store };
