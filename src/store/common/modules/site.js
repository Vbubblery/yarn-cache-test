import SupervisorService from "@/services/supervisor.service";
import Vue from "vue";
import { Site } from "@/objects/site";
import NotificationService from "@/services/notification.service";

const state = {
  currentSite: null,
  sites: {},
  sitesByCompany: {},
  sitesLoading: false
};

const getters = {
  getCurrentSite: state => {
    return state.currentSite;
  },
  getSite: state => id => {
    return state.sites[id];
  },
  getSites: state => {
    return state.sites;
  },
  getSitesByCompany: state => company => {
    return state.sitesByCompany[company];
  }
};

const mutations = {
  initCurrentSite: (state, site) => {
    Vue.set(state, "currentSite", site);
  },
  sitesLoading: (state, loading) => {
    Vue.set(state, "sitesLoading", loading);
  },
  addSite: (state, site) => {
    Vue.set(state.sites, site.id, site);
    let company = state.sitesByCompany[site.company];
    if (company) Vue.set(state.sitesByCompany[site.company], site.id, site);
    else {
      company = {};
      company[site.id] = site;
      Vue.set(state.sitesByCompany, site.company, company);
    }
  },
  updateSite: (state, site) => {
    if (site.id === state.currentSite.id) Vue.set(state, "currentSite", site);
    Vue.set(state.sites, site.id, site);
    Vue.set(state.sitesByCompany[site.company], site.id, site);
  },
  deleteSite: (state, site) => {
    if (site.id === state.currentSite.id) Vue.delete(state, "currentSite");
    Vue.delete(state.sites, site.id);
    let sites = state.sitesByCompany[site.company];
    delete sites[site.id];
    if (Object.keys(sites).length === 0)
      Vue.delete(state.sitesByCompany, site.company);
    else Vue.set(state.sitesByCompany, site.company, sites);
  },
  resetSites: state => {
    Vue.set(state, "sites", {});
    Vue.set(state, "sitesByCompany", {});
  }
};

const actions = {
  initCurrentSite: ({ commit, dispatch }, id) => {
    return new Promise((resolve, reject) => {
      dispatch("resetUsers");
      dispatch("data/resetState", null, { root: true });
      dispatch("planning/resetState", null, { root: true });
      dispatch("demand/resetState", null, { root: true });
      dispatch("common/updateSelectedProducts", {}, { root: true });
      dispatch("common/updateSelectedTags", {}, { root: true });
      dispatch("dashboard/updateSelectedTagId", null, { root: true });
      dispatch("fetchSite", id)
        .then(async site => {
          commit("initCurrentSite", site);
          await dispatch("fetchStorageSites");
          resolve(site);
        })
        .catch(error => {
          NotificationService.error(error.message);
          reject(error);
          throw error;
        });
    });
  },
  fetchSite: ({ getters, commit }, siteId) => {
    return new Promise((resolve, reject) => {
      if (!siteId) {
        reject("No siteId provided");
        return;
      }
      let site = getters.getSite(siteId);
      if (site) {
        resolve(site);
        return;
      }
      SupervisorService.get(`/api/v1/sites/${siteId}`, {
        exclude: [
          "products_sites",
          "alerts_on",
          "default_users",
          "maintenances",
          "export_name",
          "external_id",
          "fixed_forecast_horizon",
          "linked_partners",
          "supplier_sites"
        ]
      })
        .then(res => {
          const model = res.data.site;
          let site = Site.create(model);
          if (!site) {
            reject("Could not validate the site");
            return;
          }
          commit("addSite", site);
          resolve(site);
        })
        .catch(error => {
          NotificationService.error(error.message);
          reject(error);
          throw error;
        });
    });
  },
  fetchCompanySites: ({ getters, commit }, companyId = null) => {
    return new Promise((resolve, reject) => {
      commit("sitesLoading", true);
      companyId = companyId || getters.getMe.company.id;
      SupervisorService.get(`/api/v1/companies/${companyId}/sites`, {
        exclude: ["products_sites"]
      })
        .then(res => {
          commit("sitesLoading", false);
          const results = res.data.sites;
          results.forEach(model => {
            let site = Site.create(model);
            if (!site) {
              reject("Could not validate the site");
              return;
            }
            commit("addSite", site);
            resolve(site);
          });
        })
        .catch(error => {
          NotificationService.error(error.message);
          commit("sitesLoading", false);
          reject(error);
          throw error;
        });
    });
  },
  updateSite: async ({ commit, getters }, site) => {
    let users = site.users.map(userId => ({ id: userId }));
    const siteData = {
      users,
      name: site.name,
      address: site.address,
      currency: site.currency,
      demand_distribution_week: site.demandDistributionWeek
    };
    if (getters.getMe.superAdmin) {
      siteData.show_future_dashboard = site.showFutureDashboard;
      siteData.has_shelf_life = site.hasShelfLife;
      siteData.has_stock_with_backlog = site.hasStockWithBacklog;
    }
    await SupervisorService.put("/api/v1/sites/" + site.id, siteData)
      .then(res => {
        const model = res.data.site;
        let site = Site.create(model);
        if (!site) {
          NotificationService.error("Could not validate the site");
          return;
        }
        NotificationService.info("Site has been updated");
        commit("updateSite", site);
      })
      .catch(error => {
        NotificationService.error(error.message);
        throw error;
      });
  },
  deleteSite: ({ getters, commit, dispatch }, site) => {
    commit("deleteSite", site);
    if (!getters.getSitesByCompany(site.company))
      dispatch("deleteCompany", getters.getCompanies[site.company]);
  },
  fetchAllSites: ({ getters, commit }) => {
    const companyId = getters.getMe.company.id;
    SupervisorService.get(`/api/v1/companies/${companyId}/sites`)
      .then(res => {
        const results = res.data.sites;
        results.forEach(model => {
          model.users = [];
          model.products = [];
          let site = Site.create(model);
          if (site && !getters.getSite(site.id)) commit("addSite", site);
        });
      })
      .catch(error => {
        NotificationService.error(error.message);
        throw error;
      });
  },
  resetSites: ({ commit }) => {
    commit("resetSites");
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
