import Vue from "vue";
import AlertsService from "@/services/alerts.api.service";
import NotificationService from "@/services/notification.service";
import { i18n } from "@/i18n/i18n@next";

const state = {
  dataJobsIsRunning: false,
  dataJobsLastCompletionTime: null
};

const mutations = {
  setDataJobsIsRunning: (state, isRunning) => {
    Vue.set(state, "dataJobsIsRunning", isRunning);
  },
  setDataJobsLastCompletionTime: (state, time) => {
    Vue.set(state, "dataJobsLastCompletionTime", time);
  }
};

const actions = {
  getDataJobStatus: async ({ commit }, siteId) => {
    try {
      const { data: dataJobsStatusInfo } = await AlertsService.getDataJobStatus(
        siteId
      );
      commit("setDataJobsIsRunning", dataJobsStatusInfo?.is_running);
      commit(
        "setDataJobsLastCompletionTime",
        dataJobsStatusInfo?.last_completion_time
      );
    } catch {
      NotificationService.error(
        i18n.t("dataJobsAlerts.error.subscriptionError")
      );
    }
  }
};

export default {
  state,
  mutations,
  actions
};
