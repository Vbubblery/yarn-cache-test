<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <ForecastsReviewPageHeader :page-title="pageTitle" />
    <ForecastsReviewList :selected-view-type="selectedViewType" />
    <ForecastsReviewModal
      v-if="isForecastsReviewModalOpen"
      :current-config="currentConfig"
      @close="handleModalClose"
      @change-product="handleProductChange"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  SetupContext,
  nextTick
} from "@vue/composition-api";
import { useForecastsReviewNavigation } from "@/forecasts-review/composables/forecastsReviewNavigation";
import ForecastsReviewModal from "./components/ForecastsReviewModal.vue";
import ForecastsReviewPageHeader from "@/forecasts-review/components/ForecastsReviewPageHeader.vue";
import ForecastsReviewList from "@/forecasts-review/components/ForecastsReviewList.vue";
import { useBaseResources } from "@/forecasts-review/store";
import { useItemsListHandlers } from "@/forecasts-review/composables/itemsList";
import { useProductsFiltersTags } from "@/forecasts-review/composables/productFiltersTags";
import { useProductsSuppliers } from "@/forecasts-review/composables/productFilterSuppliers";

export default defineComponent({
  name: "ForecastsReviewPage",
  components: {
    ForecastsReviewPageHeader,
    ForecastsReviewList,
    ForecastsReviewModal
  },
  setup(_, context: SetupContext) {
    const { planningDemandView } = useBaseResources(context);

    const pageTitle = computed(() => `${planningDemandView.value}_forecast`);

    const {
      configs,
      updateConfigs,
      currentConfig,
      handleModalClose,
      selectedViewType,
      isForecastsReviewModalOpen
    } = useForecastsReviewNavigation();

    const { selectedCustomerId } = useBaseResources(context);

    const { selectedProductsFiltersTags } = useProductsFiltersTags();
    const { selectedSuppliers } = useProductsSuppliers();
    const { handleProductChange } = useItemsListHandlers(
      configs,
      updateConfigs,
      currentConfig,
      selectedProductsFiltersTags,
      selectedSuppliers,
      selectedCustomerId
    );

    return {
      isForecastsReviewModalOpen,
      pageTitle,
      selectedViewType,
      configs,
      currentConfig,
      handleModalClose,
      nextTick,
      handleProductChange
    };
  },
  beforeUnmount() {
    this.handleModalClose();
  }
});
</script>

<style lang="scss" scoped>
.sidebar-btn {
  padding: 5px 30px;
  border-radius: 30px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
}
.sidebar-btn-active {
  background-color: #ecf5ff;
  color: #0053b5;
}
.sidebar-btn:focus {
  outline: none;
}
.page-title {
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 24px;
}

#search-block-title {
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;
  color: #767676;
}
.dropdown {
  width: 40%;
}
.dropdown-title {
  color: #0a6ee3;
}
.desc {
  opacity: 0.5;
  display: block;
  width: 100%;
  font-size: 14px;
  margin: 3px 0 0 0;
  cursor: default;
}
</style>
