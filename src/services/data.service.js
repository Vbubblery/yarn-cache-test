import SupervisorService from "@/services/supervisor.service";
import { store } from "@/store/store";

const DataService = {
  async fetchChartData(payload) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.post(
      `/api/v1/sites/${siteId}/data`,
      {
        product_site_ids: payload.productSiteIds,
        start_date: payload.startDate,
        end_date: payload.endDate,
        sources: payload.sources
      }
    );
    const { chart } = data;
    return chart;
  }
};

export default DataService;
