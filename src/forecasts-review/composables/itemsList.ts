import dayjs from "@/dayjs";
import {
  CONFIG_NAME,
  IAlert,
  IAlertCriticality,
  IConfig,
  ConfigItems,
  ITag,
  IProductSupplier
} from "@/forecasts-review/typings";
import { fetchProducts, fetchTags } from "@/forecasts-review/composables/data";
import { Ref, ref, computed } from "@vue/composition-api";

export const useItemsListHandlers = (
  configs: { product: IConfig; tag: IConfig },
  updateConfigs: (configName: CONFIG_NAME, opts: Partial<IConfig>) => void,
  currentConfig: Ref<IConfig>,
  selectedProductsFiltersTags: Ref<ITag[]>,
  selectedSuppliers: Ref<IProductSupplier[]>,
  selectedCustomerId: Ref<number | null>
) => {
  const isProductsLoading = ref(true);
  const isTagsLoading = ref(true);
  const isLoading = computed(() => {
    return isProductsLoading.value || isTagsLoading.value;
  });

  const getProducts = async (
    filterProduct: IConfig,
    filterSelectedCriticalities: Array<IAlertCriticality> | null
  ) => {
    isProductsLoading.value = true;
    const { res, total, pages } = await fetchProducts(
      filterProduct,
      filterSelectedCriticalities ?? [],
      selectedProductsFiltersTags.value,
      selectedSuppliers.value,
      selectedCustomerId.value
    );
    filterProduct.pages = pages;
    filterProduct.selectableItemCount = total;
    filterProduct.items = res ?? [];
    isProductsLoading.value = false;
  };

  const formatAlerts = (alerts: Array<IAlert>) => {
    const colors: Record<string, string> = {
      "0": "#f76800",
      "1": "#e91010",
      "2": "#f76800",
      "3": "#0a6ee3"
    };

    const texts: Record<string, string> = {
      "0": "expiringStocks",
      "1": "outOfStock",
      "2": "belowMin",
      "3": "aboveMax"
    };

    if (alerts && alerts[0].criticality === null) alerts = [];

    let highestCriticalityColor = colors["3"];

    const formattedAlerts = alerts?.map((alert: IAlert) => {
      if (alert.criticality === 1) highestCriticalityColor = colors["1"];
      if (
        (alert.criticality === 0 || alert.criticality === 2) &&
        highestCriticalityColor !== colors["1"]
      )
        highestCriticalityColor = colors["2"];

      const color = colors[`${alert.criticality}`];
      const text = texts[`${alert.criticality}`];
      return {
        ...alert,
        displayStartDate: dayjs(alert.start_date).format("DD-MM-YYYY"),
        color,
        text
      };
    });
    return [{ alerts: formattedAlerts, highestCriticalityColor }];
  };

  const setItemsPerPage = (itemsCount: number) => {
    updateConfigs(currentConfig.value.name, {
      itemsPerPage: itemsCount,
      currentPage: 1
    });
  };

  const handlePageChange = (pageNumber: number) => {
    updateConfigs(currentConfig.value.name, { currentPage: pageNumber });
  };

  const getTags = async (config?: IConfig) => {
    isTagsLoading.value = true;
    const { res, total, pages } = await fetchTags(config ?? configs.tag);
    updateConfigs(CONFIG_NAME.TAG, {
      pages,
      selectableItemCount: total,
      items: res ?? []
    });
    isTagsLoading.value = false;
  };

  const handleSelectChange = (selectedItems: ConfigItems) => {
    updateConfigs(currentConfig.value.name, { selectedItems });
  };

  const switchSelectionAll = () => {
    if (currentConfig.value.selectedItems.length === 0) {
      // when none has been selected
      updateConfigs(currentConfig.value.name, {
        selectedItems: currentConfig.value.items.slice()
      });
    } else {
      // when all has been selected
      // OR a few (not all) has been selected
      updateConfigs(currentConfig.value.name, {
        selectedItems: []
      });
    }
  };

  const handleProductChange = (positionIncrease: number) => {
    const { currentPage, pages, items, selectedItems } =
      configs[currentConfig.value.name];
    const curItem = selectedItems[0];
    const nextPosition =
      items.findIndex(item => item.id === curItem.id) + positionIncrease;
    if (nextPosition >= items.length && currentPage + 1 <= pages)
      handlePageChange(currentPage + 1);
    else if (nextPosition < 0 && currentPage - 1 >= 1) {
      handlePageChange(currentPage - 1);
    } else if (nextPosition >= 0 && nextPosition < items.length) {
      updateConfigs(currentConfig.value.name, {
        selectedItems: [items[nextPosition]]
      });
    }
  };

  return {
    isLoading,
    handleSelectChange,
    getTags,
    handlePageChange,
    setItemsPerPage,
    formatAlerts,
    getProducts,
    handleProductChange,
    switchSelectionAll
  };
};
