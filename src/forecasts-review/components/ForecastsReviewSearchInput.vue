<template>
  <BaseInput
    v-model.trim="currentConfig.searchText"
    clearable
    class="min-w-[256px]"
    icon="search-line"
    :placeholder="$t('search')"
  />
</template>

<script lang="ts">
import { defineComponent, SetupContext } from "@vue/composition-api";
import { useForecastsReviewNavigation } from "@/forecasts-review/composables/forecastsReviewNavigation";
import { useBaseResources } from "@/forecasts-review/store";

import BaseInput from "@/components/base/components/BaseInput.vue";

export default defineComponent({
  name: "ForecastsReviewSearchInput",
  components: {
    BaseInput
  },
  setup(_, context: SetupContext) {
    const { currentSite } = useBaseResources(context);
    const { selectedViewType, currentConfig } = useForecastsReviewNavigation();
    return { currentSite, selectedViewType, currentConfig };
  }
});
</script>
