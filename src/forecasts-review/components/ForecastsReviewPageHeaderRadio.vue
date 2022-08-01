<template>
  <BaseButtonsGroup
    :value="selectedViewType"
    :tabs="tabsOptions"
    @input="updateSelectedViewType"
  />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useForecastsReviewNavigation } from "@/forecasts-review/composables/forecastsReviewNavigation";
import BaseButtonsGroup from "@/components/base/components/BaseButtonsGroup.vue";
import { useI18n } from "vue-i18n-composable";

export default defineComponent({
  components: {
    BaseButtonsGroup
  },
  setup() {
    const { t } = useI18n();
    const tabsOptions = [
      {
        id: "product",
        name: t("forecastsReview.searchProduct"),
        icon: "list-check"
      },
      {
        id: "tag",
        name: t("forecastsReview.searchTag"),
        icon: "price-tag-3-fill"
      }
    ];
    const { selectedViewType, updateSelectedViewType } =
      useForecastsReviewNavigation();
    return { selectedViewType, updateSelectedViewType, tabsOptions };
  }
});
</script>
