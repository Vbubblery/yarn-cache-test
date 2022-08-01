<template>
  <div class="z-30 bg-white flex justify-between w-full pt-6 px-6 pb-4">
    <div class="flex items-center h-full mr-8">
      <div class="leading-6 text-2xl min-w-[86px] mr-5">
        {{ $t(`forecastsReview.${pageTitle}`) }}
      </div>
      <ForecastsReviewPageHeaderRadio v-if="!currentSite.isSupplierView" />
    </div>
    <div class="overflow-hidden flex h-full items-center gap-x-4">
      <template
        v-if="!currentSite.isSupplierView && currentConfig.name === 'product'"
      >
        <ForecastReviewTagDropdown />
        <ForecastReviewSupplierDropdown />
        <ForecastReviewAlertStatusDropdown
          v-if="planningDemandView === PLANNING_DEMAND_VIEW.PLANNING"
        />
      </template>
      <ForecastsReviewCustomerDropdown v-else />
      <ForecastsReviewSearchInput />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from "@vue/composition-api";
import { useForecastsReviewNavigation } from "@/forecasts-review/composables/forecastsReviewNavigation";
import { useBaseResources } from "@/forecasts-review/store";
import { PLANNING_DEMAND_VIEW } from "@/forecasts-review/typings";
import ForecastsReviewPageHeaderRadio from "@/forecasts-review/components/ForecastsReviewPageHeaderRadio.vue";
import ForecastsReviewSearchInput from "@/forecasts-review/components/ForecastsReviewSearchInput.vue";
import ForecastsReviewCustomerDropdown from "@/forecasts-review/components/ForecastsReviewCustomerDropdown.vue";
import ForecastReviewTagDropdown from "@/forecasts-review/components/ForecastReviewTagDropdown.vue";
import ForecastReviewSupplierDropdown from "@/forecasts-review/components/ForecastReviewSupplierDropdown.vue";
import ForecastReviewAlertStatusDropdown from "@/forecasts-review/components/ForecastReviewAlertStatusDropdown.vue";

export default defineComponent({
  name: "PageHeader",
  components: {
    ForecastsReviewSearchInput,
    ForecastsReviewPageHeaderRadio,
    ForecastsReviewCustomerDropdown,
    ForecastReviewSupplierDropdown,
    ForecastReviewTagDropdown,
    ForecastReviewAlertStatusDropdown
  },
  props: {
    pageTitle: {
      type: String,
      required: true
    }
  },
  setup(_, context: SetupContext) {
    const { currentSite, planningDemandView } = useBaseResources(context);
    const { selectedViewType, updateSelectedViewType, currentConfig } =
      useForecastsReviewNavigation();

    return {
      currentSite,
      currentConfig,
      PLANNING_DEMAND_VIEW,
      planningDemandView,
      selectedViewType,
      updateSelectedViewType
    };
  }
});
</script>

<style lang="scss" scoped>
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
