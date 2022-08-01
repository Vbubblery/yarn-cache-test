<template>
  <MultiSelectDropdown
    v-model="selectedCriticalities"
    :items="criticalities"
    :popper-distance="5"
    popper-class="w-[400px]"
    class="min-w-[80px] overflow-hidden"
    @deselect:all="deselectAllProductsFiltersAlerts"
  >
    <template #default="{ shown }">
      <BaseButton
        :type="selectedCriticalities.length === 0 ? 'action' : 'selection'"
        :active="shown"
        class="w-full"
        condensed
        icon="alert-fill"
      >
        {{ alertStatusesDropdownTitle }}
      </BaseButton>
    </template>
    <template #header>
      <div class="flex items-center justify-between mt-4 px-4">
        <p class="text-base text-original-500">
          {{ $t("dropdown.alerts") }}
        </p>
        <p class="text-base text-original-500 text-left">
          {{ $t("dropdown.products") }}
        </p>
      </div>
    </template>
    <template #itemContent="{ item, selectedItemsIds }">
      <div class="flex justify-between items-center">
        <div class="max-w-[80%] truncate">
          <BaseLabelCheckbox
            :label="item.name"
            :value="selectedItemsIds.includes(item.id)"
          />
        </div>
        <div class="justify-end">
          {{ new Intl.NumberFormat("fr-FR").format(item.productCount) }}
        </div>
      </div>
    </template>
  </MultiSelectDropdown>
</template>

<script lang="ts">
import MultiSelectDropdown from "@/components/base/components/dropdown/MultiSelectDropdown.vue";
import { defineComponent, SetupContext, nextTick } from "@vue/composition-api";
import { useBaseResources } from "@/forecasts-review//store";
import { useProductsFiltersAlerts } from "@/forecasts-review/composables/productFiltersAlerts";
import { PLANNING_DEMAND_VIEW } from "@/forecasts-review/typings";
import BaseLabelCheckbox from "@/components/base/components/BaseLabelCheckbox.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default defineComponent({
  name: "ForecastReviewAlertStatusDropdown",
  components: {
    MultiSelectDropdown,
    BaseButton,
    BaseLabelCheckbox
  },
  props: {},
  emits: [],
  setup: (_props, context: SetupContext) => {
    const { currentSite, planningDemandView } = useBaseResources(context);
    const {
      alertStatusesDropdownTitle,
      criticalities,
      selectedCriticalities,
      deselectAllProductsFiltersAlerts,
      updateSelectedCriticalities
    } = useProductsFiltersAlerts(currentSite);
    return {
      alertStatusesDropdownTitle,
      criticalities,
      selectedCriticalities,
      PLANNING_DEMAND_VIEW,
      planningDemandView,
      nextTick,
      updateSelectedCriticalities,
      deselectAllProductsFiltersAlerts
    };
  }
});
</script>
