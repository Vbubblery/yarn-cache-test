<template>
  <div class="flex items-center px-6 py-2 border-b border-blue-600">
    <BaseCheckbox
      v-if="selectedItemsQuantity === totalItems"
      :value="selectedItemsQuantity === totalItems"
      class="mr-[22px]"
      @input="$emit('input')"
    />
    <BaseSemiSelector v-else class="mr-[22px]" @click="$emit('input')" />

    <p class="font-base font-medium min-w-[170px]">
      {{ selectedItemsQuantity }}
      {{
        selectedViewType === "product"
          ? $tc("forecastsReview.products", selectedItemsQuantity)
          : $tc("forecastsReview.tagsCountable", selectedItemsQuantity)
      }}
      {{ $tc("forecastsReview.selected", selectedItemsQuantity) }}
    </p>
    <div class="w-[1px] h-[47px] bg-original-300 mr-4" />
    <BaseButton @click="$emit('view')">
      {{
        selectedItemsQuantity === 1
          ? $tc("forecastsReview.viewDetails")
          : $tc("forecastsReview.viewAggregatedDetails")
      }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api/dist/vue-composition-api";
import BaseCheckbox from "@/components/base/components/BaseCheckbox.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import BaseSemiSelector from "@/components/base/components/BaseSemiSelector.vue";

export default defineComponent({
  name: "ForecastReviewTableHeader",
  components: { BaseSemiSelector, BaseButton, BaseCheckbox },
  props: {
    selectedItemsQuantity: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    selectedViewType: {
      type: String,
      required: true
    }
  },
  emits: ["input", "view"]
});
</script>
