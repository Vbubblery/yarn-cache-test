import { SOURCE_NAME } from "@/components/base/table/utils/base";
import SupervisorService from "@/services/supervisor.service";
import { store } from "@/store/store";

const DemandService = {
  async fetchDemandData(payload) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.post(
      `/api/v1/sites/${siteId}/demand`,
      {
        product_site_ids: payload.productSiteIds,
        tag_ids: payload.tagIds,
        site_id: payload.siteId,
        period_type: payload.periodType,
        start_date: payload.startDate,
        end_date: payload.endDate,
        is_aggregated: payload.isAggregated,
        customer_id: payload.customerId,
        page: payload.page,
        per_page: payload.perPage || 10
      }
    );
    return data;
  },
  //TO IMPROVE: use a single request instead of Promise.all
  async updateMyForecast(payload) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { [SOURCE_NAME.MY_DEMAND_FORECAST]: forecastValues } = payload;
    const formattedBody = forecastValues.map(forecast => ({
      product_site_ids: payload.productSiteIds,
      tag_ids: payload.tagIds,
      start_date: forecast.start_date,
      end_date: forecast.end_date,
      site_id: payload.siteId,
      customer_id: payload.customerId,
      value: forecast.value
    }));
    const data = [];
    for (const body of formattedBody) {
      const response = await SupervisorService.put(
        `/api/v1/sites/${siteId}/demand/myforecast`,
        body
      );
      data.push(response);
    }
    return data;
  }
};

export default DemandService;
