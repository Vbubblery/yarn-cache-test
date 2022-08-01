<template>
  <SingleSelectDropdown
    v-if="customers && selectedCustomer"
    v-model="selectedCustomer"
    :items="customers"
    :popper-distance="5"
    popper-class="w-[400px]"
    class="min-w-[80px] overflow-hidden"
    @select:item="
      selectedCustomer => updateSelectedCustomerSiteId(selectedCustomer.id)
    "
  >
    <template #default="{ shown }">
      <BaseButton
        :type="!selectedCustomer ? 'action' : 'selection'"
        :active="shown"
        class="w-full"
        condensed
        icon="group-fill"
      >
        {{ $t("forecastsReview.customer") }}
        {{ selectedCustomer ? `: ${displayTitle}` : "" }}</BaseButton
      >
    </template>
  </SingleSelectDropdown>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  SetupContext,
  watch
} from "@vue/composition-api";
import SingleSelectDropdown from "@/components/base/components/dropdown/SingleSelectDropdown.vue";
import { useBaseResources } from "@/forecasts-review/store";
import { useForecastsReviewCustomers } from "@/forecasts-review/composables/forecastsReviewCustomers";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import { useI18n } from "vue-i18n-composable";

export default defineComponent({
  name: "ForecastsReviewCustomerDropdown",
  components: { BaseButton, SingleSelectDropdown },
  setup: (_, context: SetupContext) => {
    const { t } = useI18n();
    const { currentSite, updateSelectedCustomerSiteId } =
      useBaseResources(context);

    const { customers, selectedCustomer, initCustomers, getCustomers } =
      useForecastsReviewCustomers(context);

    const displayTitle = computed(() => {
      return selectedCustomer
        ? selectedCustomer?.value?.name
        : t("forecastsReview.selectCustomer");
    });

    watch(currentSite, async () => {
      customers.value = [];
      await getCustomers();
      updateSelectedCustomerSiteId(customers?.value?.[0]?.id ?? null);
    });

    // CREATED
    initCustomers();

    return {
      customers,
      displayTitle,
      selectedCustomer,
      updateSelectedCustomerSiteId
    };
  }
});
</script>
