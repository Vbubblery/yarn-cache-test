import { CONFIG_NAME, IConfig } from "@/forecasts-review/typings";
import { computed, reactive, ref, Ref } from "@vue/composition-api";
const configs: {
  product: IConfig;
  tag: IConfig;
} = reactive({
  product: reactive({
    name: CONFIG_NAME.PRODUCT,
    items: [],
    pages: 1,
    currentPage: 1,
    itemsPerPage: 20,
    selectableItemCount: 0,
    searchText: "",
    selectedItems: []
  }),
  tag: reactive({
    name: CONFIG_NAME.TAG,
    items: [],
    pages: 1,
    currentPage: 1,
    itemsPerPage: 20,
    selectableItemCount: 0,
    searchText: "",
    selectedItems: []
  })
});
const selectedViewType: Ref<CONFIG_NAME> = ref(CONFIG_NAME.PRODUCT);
const isForecastsReviewModalOpen = ref(false);
const backupConfig: Ref<IConfig | undefined> = ref();
export const useForecastsReviewNavigation = () => {
  const currentConfig = computed(() => {
    return configs[selectedViewType.value];
  });
  const updateSelectedViewType = (viewType: CONFIG_NAME) => {
    selectedViewType.value = viewType;
  };
  const openForecastsReviewModal = () => {
    isForecastsReviewModalOpen.value = true;
  };
  const handleModalClose = () => {
    //reset the backup content while closing modal
    if (backupConfig.value) {
      configs[selectedViewType.value] = backupConfig.value;
      backupConfig.value = undefined;
    }
    isForecastsReviewModalOpen.value = false;
  };
  const updateConfigs = (configName: CONFIG_NAME, opts: Partial<IConfig>) => {
    configs[configName] = { ...configs[configName], ...opts };
  };

  return {
    configs,
    updateConfigs,
    backupConfig,
    isForecastsReviewModalOpen,
    openForecastsReviewModal,
    currentConfig,
    handleModalClose,
    selectedViewType,
    updateSelectedViewType
  };
};
