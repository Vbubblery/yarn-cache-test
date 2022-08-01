import SupervisorService from "@/services/supervisor.service";
import helper from "@/helper/helper";
import NotificationService from "@/services/notification.service";
import { store } from "@/store/store";

const PlanningService = {
  async fetchPlanningData(payload) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.post(
      `/api/v1/sites/${siteId}/planning`,
      {
        product_site_ids: payload.productSiteIds,
        tag_ids: payload.tagIds,
        period_type: payload.periodType,
        start_date: payload.startDate,
        end_date: payload.endDate,
        sources: payload.sources,
        site_id: siteId,
        is_aggregated: payload.isAggregated,
        with_chart: payload.withChart,
        with_table: payload.withTable,
        page: payload.page,
        per_page: 10
      }
    );
    return data;
  },
  formatTransferPayload({
    productId,
    quantity,
    period,
    periodType,
    fromId,
    toId
  }) {
    let transfersToUpdate = [];
    if (periodType === "day") {
      transfersToUpdate.push({
        date: period,
        updated_date: helper.todayStr(),
        quantity,
        product_site_id: parseInt(productId),
        from_storage_site_id: parseInt(fromId),
        to_storage_site_id: parseInt(toId)
      });
    } else {
      const allDates = helper.createPeriodsArrayBetweenTwoDates(
        helper.periodStartSinceToday(period, periodType),
        helper.dateStrToLastDate(period, periodType),
        "day"
      );
      transfersToUpdate = allDates.map((day, index) => ({
        date: day,
        updated_date: helper.todayStr(),
        quantity: index === 0 ? quantity : null,
        product_site_id: parseInt(productId),
        from_storage_site_id: parseInt(fromId),
        to_storage_site_id: parseInt(toId)
      }));
    }
    return transfersToUpdate;
  },
  formatSupplyPayload({ productId, supplierId, quantity, period, periodType }) {
    let suppliesToUpdate = [];
    if (periodType === "day") {
      suppliesToUpdate.push({
        product_site: parseInt(productId),
        supplier: parseInt(supplierId),
        quantity,
        date: period
      });
    } else {
      const allDates = helper.createPeriodsArrayBetweenTwoDates(
        helper.periodStartSinceToday(period, periodType),
        helper.dateStrToLastDate(period, periodType),
        "day"
      );
      suppliesToUpdate = allDates.map((day, index) => ({
        product_site: parseInt(productId),
        supplier: parseInt(supplierId),
        quantity: index === 0 ? quantity : null,
        date: day
      }));
    }
    return suppliesToUpdate;
  },
  async updatePlanning(payload) {
    const siteId = store.getters["common/getCurrentSite"].id;
    try {
      return await SupervisorService.put(
        `/api/v1/sites/${siteId}/planning`,
        payload
      );
    } catch (error) {
      NotificationService.error(error.message);
      throw error;
    }
  },
  async createOrUpdateTransfer({
    productId,
    quantity,
    period,
    periodType,
    fromId,
    toId
  }) {
    let transfersToUpdate = [];
    if (periodType === "day") {
      transfersToUpdate.push({
        date: period,
        updated_date: helper.todayStr(),
        quantity,
        product_site_id: parseInt(productId),
        from_storage_site_id: parseInt(fromId),
        to_storage_site_id: parseInt(toId)
      });
    } else {
      const allDates = helper.createPeriodsArrayBetweenTwoDates(
        helper.periodStartSinceToday(period, periodType),
        helper.dateStrToLastDate(period, periodType),
        "day"
      );
      transfersToUpdate = allDates.map((day, index) => ({
        date: day,
        updated_date: helper.todayStr(),
        quantity: index === 0 ? quantity : null,
        product_site_id: parseInt(productId),
        from_storage_site_id: parseInt(fromId),
        to_storage_site_id: parseInt(toId)
      }));
    }
    const siteId = store.getters["common/getCurrentSite"].id;
    try {
      await Promise.all(
        transfersToUpdate.map(async transferData => {
          return await SupervisorService.post(
            `/api/v1/sites/${siteId}/transfers`,
            transferData
          );
        })
      );
    } catch (error) {
      NotificationService.error(error.message);
      throw error;
    }
  }
  //END TO REMOVE
};

export default PlanningService;
