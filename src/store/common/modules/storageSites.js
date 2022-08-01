import StorageSitesService from "@/services/storageSites.service";
import NotificationService from "@/services/notification.service";
import Vue from "vue";
import { store } from "@/store/store";

const state = {
  storageSitesById: {}
};

const getters = {
  getStorageSitesById: state => id => {
    return state.storageSitesById[id];
  }
};

const mutations = {
  updateStorageSitesById: (state, storageSitesById) => {
    Vue.set(state, "storageSitesById", storageSitesById);
  }
};

const actions = {
  fetchStorageSites: async ({ commit }) => {
    try {
      const currentSiteId = store.getters["common/getCurrentSite"].id;
      const storageSites = await StorageSitesService.fetchCurrentStorageSites(
        currentSiteId,
        { only: ["id", "name"] }
      );
      let storageSitesById = storageSites.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});
      commit("updateStorageSitesById", storageSitesById);
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
