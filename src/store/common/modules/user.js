import Vue from "vue";
import SupervisorService from "@/services/supervisor.service";
import NotificationService from "@/services/notification.service";
import { User } from "@/objects/user";
import fr_FR from "ant-design-vue/lib/locale-provider/fr_FR";
import en_US from "ant-design-vue/lib/locale-provider/en_US";
import dayjs from "@/dayjs";
import { i18n } from "@/i18n/i18n@next";
import router from "@/router/router";
import { NoUserError } from "@/objects/errors/Auth";
import throwEndpointError from "@/objects/errors/Endpoint";
import helper from "@/helper/helper";

const state = {
  me: null,
  users: {},
  usersByCompany: {},
  usersBySite: {},
  access_token: null,
  antLocale: fr_FR,
  usersLoading: false
};

const getters = {
  getMe: state => {
    return state.me;
  },
  getUser: state => id => {
    return state.users[id];
  },
  getUsers: state => {
    return state.users;
  },
  getUsersByCompany: state => company => {
    return state.usersByCompany[company];
  },
  getUsersBySite: state => site => {
    return state.usersBySite[site];
  },
  getAccessToken: state => {
    return state.access_token;
  }
};

const mutations = {
  initMe: (state, user) => {
    Vue.set(state, "me", user);
  },
  usersLoading: (state, loading) => {
    Vue.set(state, "usersLoading", loading);
  },
  addUser: (state, user) => {
    Vue.set(state.users, user.id, user);
    let company = state.usersByCompany[user.company];
    if (company) Vue.set(state.usersByCompany[user.company], user.id, user);
    else {
      company = {};
      company[user.id] = user;
      Vue.set(state.usersByCompany, user.company, company);
    }
    user.sites.forEach(site => {
      let tmp = state.usersBySite[site];
      if (tmp) Vue.set(state.usersBySite[site], user.id, user);
      else {
        tmp = {};
        tmp[user.id] = user;
        Vue.set(state.usersBySite, site, tmp);
      }
    });
  },
  updateUser: (state, user) => {
    let companyId = user.company;
    let sites = user.sites;
    if (user.id === state.me.id) {
      Vue.set(state, "me", user);
      companyId = user.company.id;
      sites = user.sites.map(site => site.id);
    }
    Vue.set(state.users, user.id, user);
    if (state.usersByCompany[companyId])
      Vue.set(state.usersByCompany[companyId], user.id, user);
    sites.forEach(siteId => {
      if (state.usersBySite[siteId])
        Vue.set(state.usersBySite[siteId], user.id, user);
    });
  },
  deleteUserFromSite: (state, user, site) => {
    Vue.delete(state.usersBySite[site], user.id);
  },
  deleteUser: (state, user) => {
    if (user == state.me) Vue.delete(state, "me");
    Vue.delete(state.users, user.id);
    Vue.delete(state.usersByCompany[user.company], user.id);
    user.sites.forEach(site => {
      Vue.delete(state.usersBySite[site], user.id);
    });
  },
  updateAccessToken: (state, access_token) => {
    state.access_token = access_token;
  },
  updateAntLocale: (state, antLocale) => {
    Vue.set(state, "antLocale", antLocale);
  },
  resetUsers: state => {
    Vue.set(state, "users", {});
    Vue.set(state, "usersByCompany", {});
    Vue.set(state, "usersBySite", {});
  }
};

const actions = {
  initMe: async ({ commit, dispatch }) => {
    try {
      const { data } = await SupervisorService.get("/api/v1/users/me").catch(
        throwEndpointError
      );

      if (helper.isEmpty(data)) {
        throw new NoUserError("This user could not be found.");
      }

      const user = User.create(data);

      commit("initMe", user);
      await dispatch("initCompany", user.company);

      if (user.locale !== i18n.locale)
        dispatch("updateUserLocaleInApp", user.locale);
    } catch (error) {
      NotificationService.error(error.message);
      setTimeout(() => router.app.$auth.logout(), 5000);
    }
  },
  updateUserLocale: async ({ dispatch }, newLocale) => {
    try {
      dispatch("updateUserLocaleInApp", newLocale);
      dispatch("updateUserLocaleInBack", newLocale);
    } catch (error) {
      NotificationService.error(error.message);
      throw error;
    }
  },
  updateUserLocaleInBack: async ({ getters, state }, newLocale) => {
    try {
      await SupervisorService.put(
        `/api/v1/sites/${getters.getCurrentSite.id}/users/${state.me.id}`,
        {
          locale: newLocale
        }
      );
      if (newLocale === "en")
        NotificationService.success(
          "Your language choice was successfuly saved"
        );
      if (newLocale === "fr")
        NotificationService.success(
          "Votre choix de langue a bien été enregistré"
        );
    } catch (error) {
      NotificationService.error(
        "Something went wrong, we could not save your language choice"
      );
      throw error;
    }
  },
  updateUserLocaleInApp: async ({ commit }, newLocale) => {
    try {
      // update VueI18n locale
      i18n.locale = newLocale;

      // update Ant + dayjs locales
      if (newLocale === "fr") {
        commit("updateAntLocale", fr_FR);
        dayjs.updateLocale(newLocale);
      }
      if (newLocale === "en") {
        commit("updateAntLocale", en_US);
        dayjs.updateLocale(newLocale, {
          weekStart: 1
        });
      }
    } catch (error) {
      NotificationService.error(error.message);
      throw error;
    }
  },
  async postUser({ commit }, { user, sites = [] }) {
    const userData = {
      company: user.company,
      email: user.email,
      name: user.name,
      tel_office: user.telOffice,
      title: user.title,
      password: user.password,
      is_admin: user.admin
    };
    if (sites.length) userData.sites = sites;
    await SupervisorService.post("/api/v1/users", userData)
      .then(res => {
        const model = res.data.user;
        let user = User.create(model);
        if (!user) {
          NotificationService.error("Could not validate the user");
          return;
        }
        commit("addUser", user);
        NotificationService.info("User has been created");
      })
      .catch(error => {
        NotificationService.error(error.response.data.message);
        throw error;
      });
  },
  updateUser: async ({ commit, getters }, { user, passwordChange = null }) => {
    let passwordUpdateError = false;
    const userData = {
      name: user.name,
      tel_office: user.telOffice,
      title: user.title,
      is_active: user.isActive,
      sites: user.sites
    };
    if (passwordChange) {
      await SupervisorService.post(
        "/api/v1/users/change_password",
        passwordChange
      )
        .then(() => {
          NotificationService.info("Password has been updated");
        })
        .catch(error => {
          NotificationService.error(error.request.responseText);
          passwordUpdateError = true;
          throw error;
        });
    }
    if (!passwordUpdateError) {
      await SupervisorService.put(
        "/api/v1/sites/" + getters.getCurrentSite.id + "/users/" + user.id,
        userData
      )
        .then(res => {
          const model = res.data.user;
          let updatedUser = User.create(model);
          if (!updatedUser) {
            NotificationService.error("Could not validate the user");
            return;
          }
          NotificationService.info("User has been updated");
          commit("updateUser", user);
        })
        .catch(error => {
          NotificationService.error(error.message);
          throw error;
        });
    }
  },
  deleteUser: async ({ commit, getters }, user, site = null) => {
    if (site) commit("deleteUserFromSite", user, site);
    else if (!user.id) return;
    await SupervisorService.delete("/api/v1/users/" + user.id)
      .then(() => {
        user.sites.forEach(siteId => {
          const site = getters.getSite(siteId);
          site.users = site.users.filter(userId => {
            return userId !== user.id;
          });
        });
        commit("deleteUser", user);
        NotificationService.info("User has been deleted");
      })
      .catch(error => {
        NotificationService.error(error.message);
        throw error;
      });
  },
  updateAccessToken: ({ commit }, payload) => {
    commit("updateAccessToken", payload);
  },
  fetchUsers: ({ getters, commit }) => {
    return new Promise((resolve, reject) => {
      commit("usersLoading", true);
      const url = getters.getMe.admin
        ? "/api/v1/sites/" + getters.getCurrentSite.id + "/users"
        : "/api/v1/users/me";
      SupervisorService.get(url, {
        exclude: ["default_site", "is_demo_user", "locale"]
      })
        .then(res => {
          commit("usersLoading", false);
          const results = getters.getMe.admin ? res.data.results : [res.data];
          const users = [];
          results.forEach(model => {
            let user = User.create(model);
            if (!user) {
              reject("Could not validate the user");
              return;
            }
            // get users from all company if admin,
            // otherwise get only user related to my sites
            if (
              getters.getMe.admin ||
              user.sites.includes(getters.getCurrentSite.id)
            ) {
              commit("addUser", user);
            }
            users.push(user);
          });
          resolve(users);
        })
        .catch(error => {
          NotificationService.error(error.message);
          commit("usersLoading", false);
          reject(error);
          throw error;
        });
    });
  },
  resetUsers: ({ commit }) => {
    commit("resetUsers");
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
