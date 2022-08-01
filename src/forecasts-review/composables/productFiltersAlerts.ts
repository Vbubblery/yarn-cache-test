import { ref, computed, Ref } from "@vue/composition-api";
import { IAlertCriticality } from "@/forecasts-review/typings";
import { ISite } from "@/typings/site";
import { i18n } from "@/i18n/i18n@next";
import { fetchProductCountPerAlertCriticality } from "@/forecasts-review/composables/data";

const selectedCriticalities = ref<Array<IAlertCriticality>>([]);
const criticalities = ref<Array<IAlertCriticality>>([]);

export const useProductsFiltersAlerts = (currentSite: Ref<ISite>) => {
  const updateCriticalities = async () => {
    criticalities.value = [
      ...(currentSite.value.hasShelfLife
        ? [{ id: 0, name: i18n.t("forecastsReview.expiringStocks").toString() }]
        : []),
      { id: 1, name: i18n.t("forecastsReview.outOfStock").toString() },
      { id: 2, name: i18n.t("forecastsReview.belowMin").toString() },
      { id: 3, name: i18n.t("forecastsReview.aboveMax").toString() }
    ];
    const productCountPerAlertCriticality =
      await fetchProductCountPerAlertCriticality();
    criticalities.value = criticalities.value.map(criticality => ({
      ...criticality,
      productCount:
        productCountPerAlertCriticality[criticality.id]?.productCount ?? 0
    }));
  };
  updateCriticalities();

  const alertStatusesDropdownTitle = computed(() => {
    const selectedCriticalitiesCount = selectedCriticalities.value?.length ?? 0;
    if (selectedCriticalitiesCount === 0) return i18n.t("productSearch.alerts");
    if (selectedCriticalitiesCount === 1) {
      const selectedCriticality = criticalities.value.find(
        criticality => criticality.id === selectedCriticalities.value?.[0].id
      );
      const criticalityName = selectedCriticality?.name
        ? selectedCriticality?.name
        : "";
      return i18n.t(criticalityName);
    }
    return i18n.tc("productSearch.selectedAlerts", selectedCriticalitiesCount);
  });

  const updateSelectedCriticalities = (selection: Array<IAlertCriticality>) => {
    selectedCriticalities.value = selection;
  };

  const deselectAllProductsFiltersAlerts = () => {
    selectedCriticalities.value = [];
  };

  return {
    criticalities,
    selectedCriticalities,
    alertStatusesDropdownTitle,
    updateCriticalities,
    updateSelectedCriticalities,
    deselectAllProductsFiltersAlerts
  };
};
