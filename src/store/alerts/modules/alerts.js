import AlertsService from "@/services/alerts.api.service";

const actions = {
  computingAlerts: async (_, { productSiteIds = null }) => {
    await AlertsService.computingAlerts({ productSiteIds });
  }
};

export default {
  actions
};
