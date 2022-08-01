import SupervisorService from "@/services/supervisor.service";
import NotificationService from "@/services/notification.service";

import Vue from "vue";
import { Company } from "@/objects/company";

const state = {
  company: null,
  companies: {}
};

const getters = {
  getCompany: state => {
    return state.company;
  },
  getCompanies: state => {
    return state.companies;
  }
};

const mutations = {
  initCompany: (state, company) => {
    Vue.set(state, "company", company);
    Vue.set(state.companies, company.id, company);
  },
  addCompany: (state, company) => {
    Vue.set(state.companies, company.id, company);
  },
  updateCompany: (state, company) => {
    if (state.company.id === company.id) Vue.set(state, "company", company);
    Vue.set(state.companies, company.id, company);
  },
  deleteCompany: (state, company) => {
    if (state.company.id === company.id) Vue.delete(state, "company");
    Vue.delete(state.companies, company.id);
  }
};

const actions = {
  initCompany: ({ getters, commit, dispatch }, company) => {
    const companyId = company.id;
    return new Promise((resolve, reject) => {
      dispatch("addCompany", companyId)
        .then(async company => {
          commit("initCompany", company);
          const defaultSiteId =
            getters.getMe.company.id === companyId
              ? getters.getMe.defaultSiteId
              : company.sites[0];
          await dispatch("initCurrentSite", defaultSiteId);
          if (company.name === "Flowlity") dispatch("fetchCompanies");
          if (company.name === "Flowlity") dispatch("fetchAllSites");
          await dispatch("fetchCompanySites", company.id);
          resolve(company);
        })
        .catch(error => {
          NotificationService.error(error.message);
          reject(error);
          throw error;
        });
    });
  },
  addCompany: ({ getters, commit }, companyId) => {
    return new Promise((resolve, reject) => {
      if (!companyId) {
        reject("No companyId provided");
        return;
      }
      let company = getters.getCompanies[companyId];
      if (company) {
        resolve(company);
        return;
      }
      SupervisorService.get(`/api/v1/companies/${companyId}`, {
        exclude: [
          "tags",
          "promotions",
          "suppliers",
          "sftp_export_path",
          "sftp_user",
          "sftp_host",
          "sftp_password"
        ]
      })
        .then(res => {
          const model = res.data.company;
          let company = Company.create(model);
          if (!company) {
            reject("Could not validate the company");
            return;
          }
          commit("addCompany", company);
          resolve(company);
        })
        .catch(error => {
          NotificationService.error(error.message);
          reject(error);
          throw error;
        });
    });
  },
  updateCompany: async ({ commit, dispatch }, company) => {
    let users = company.users;
    let sites = company.sites;
    await SupervisorService.put("/api/v1/companies/" + company.id, {
      name: company.name
    })
      .then(res => {
        const model = res.data.company;
        company = Company.create(model);
        if (!company) {
          NotificationService.error("Could not validate the company");
          return;
        }
        let tmpUsers = model.users.map(user => user.id);
        users.forEach(user => {
          if (!tmpUsers.includes(user)) dispatch("deleteUser", user);
        });
        sites.forEach(site => {
          if (!model.sites.includes(site)) dispatch("deleteSite", site);
        });
        commit("updateCompany", company);
        NotificationService.info("Successfully updated Company");
      })
      .catch(error => {
        NotificationService.error(error.message);
        throw error;
      });
  },
  deleteCompany: ({ commit }, company) => {
    commit("deleteCompany", company);
  },
  fetchCompanies: ({ getters, commit }) => {
    SupervisorService.get("/api/v1/companies?per_page=999999")
      .then(res => {
        const results = res.data.results;
        results.forEach(model => {
          model.users = [];
          let company = Company.create(model);
          if (company && company.id !== getters.getCompany.id)
            commit("addCompany", company);
        });
      })
      .catch(error => {
        NotificationService.error(error.message);
        throw error;
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
