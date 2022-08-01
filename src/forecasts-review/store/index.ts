import { computed, SetupContext, ComputedRef } from "@vue/composition-api";
import { PLANNING_DEMAND_VIEW } from "@/forecasts-review/typings";
import { Site } from "@/objects/site";

export const useBaseResources = (context: SetupContext) => {
  const store = context.parent?.$store || null;

  const getMe = computed<{ locale: string }>(
    () => store?.getters["common/getMe"]
  );
  const planningDemandView: ComputedRef<PLANNING_DEMAND_VIEW> = computed(
    () => store?.getters["common/getDefaultView"]
  );
  const currentSite = computed<Site>(
    () => store?.getters["common/getCurrentSite"]
  );
  const tablesData = computed(() => store?.getters["demand/getTablesData"]);
  const demandGetChartData = computed(
    () => store?.getters["demand/getChartData"]
  );
  const demandGetIsLoadingChart = computed(
    () => store?.getters["demand/getIsLoadingChart"]
  );
  const demandGetIsLoadingTables = computed(
    () => store?.getters["demand/getIsLoadingTables"]
  );
  const planningGetChartData = computed(
    () => store?.getters["planning/getChartData"]
  );
  const planningGetIsLoadingChart = computed(
    () => store?.getters["planning/getIsLoadingChart"]
  );
  const planningGetIsLoadingTables = computed(
    () => store?.getters["planning/getIsLoadingTables"]
  );
  const selectedTagIds = computed(
    () => store?.getters["common/getSelectedTags"]
  );
  const selectedCustomerId = computed(() =>
    currentSite.value.isSupplierView
      ? store?.getters["demand/getSelectedCustomerSiteId"]
      : null
  );
  const updateDefaultView = (view: PLANNING_DEMAND_VIEW) => {
    store?.commit("common/updateDefaultView", view);
  };
  const updateSelectedProducts = (items: object[]) => {
    store?.dispatch("common/updateSelectedProducts", items);
  };
  const updateSelectedTags = (items: object[]) => {
    store?.dispatch("common/updateSelectedTags", items);
  };
  const updateDataType = (itemType: string) => {
    store?.commit("common/updateDataType", itemType);
  };
  const resetDemandState = () => {
    store?.commit("demand/resetState");
  };
  const updateDemandPage = (pageNum: number) => {
    store?.commit("demand/updatePage", pageNum);
  };
  const updateDemandTableOnly = (onlyTable: boolean) => {
    store?.commit("demand/updateOnlyTable", onlyTable);
  };
  const fetchData = (
    selectedView: undefined | PLANNING_DEMAND_VIEW = undefined
  ) => {
    const currentView = selectedView ?? planningDemandView.value;
    store?.dispatch(
      currentView === PLANNING_DEMAND_VIEW.DEMAND
        ? "demand/fetchDemandData"
        : "planning/updatePlanningData"
    );
  };
  const updateSelectedCustomerSiteId = (customerSiteId: number | null) => {
    store?.commit("demand/updateSelectedCustomerSiteId", customerSiteId);
  };
  return {
    getMe,
    planningDemandView,
    updateDefaultView,
    currentSite,
    tablesData,
    demandGetChartData,
    demandGetIsLoadingChart,
    demandGetIsLoadingTables,
    planningGetChartData,
    planningGetIsLoadingChart,
    planningGetIsLoadingTables,
    selectedCustomerId,
    selectedTagIds,
    updateSelectedProducts,
    updateSelectedTags,
    updateDataType,
    resetDemandState,
    updateDemandPage,
    updateDemandTableOnly,
    fetchData,
    updateSelectedCustomerSiteId
  };
};
