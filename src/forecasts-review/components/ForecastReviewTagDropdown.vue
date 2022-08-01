<template>
  <MultiSelectDropdown
    v-model="selectedProductsFiltersTags"
    searchable
    :items="tags"
    :popper-distance="5"
    :search-text="searchTextTags"
    popper-class="w-[400px]"
    class="min-w-[80px] overflow-hidden"
    @deselect:all="deselectAllProductsFiltersTags"
    @update:input="searchTextTags = $event"
  >
    <template #default="{ shown }">
      <BaseButton
        :type="
          selectedProductsFiltersTags.length === 0 ? 'action' : 'selection'
        "
        :active="shown"
        class="w-full"
        condensed
        icon="price-tag-3-fill"
      >
        {{ tagDropdownSubTitle }}
      </BaseButton>
    </template>
    <template #header>
      <div
        v-if="tags.length > 0"
        class="flex items-center justify-between mt-4 px-4"
      >
        <p class="text-base text-original-500">
          {{ `${$t("dropdown.tags")} (${tagsCount || tags.length})` }}
        </p>
        <p class="text-base text-original-500 text-left">
          {{ $t("dropdown.products") }}
        </p>
      </div>
      <div
        v-else-if="!tagsAreLoading"
        class="text-left mt-4 text-base text-original-500 pl-4 py-2"
      >
        {{ $t("forecastsReview.noTags") }}
      </div>
    </template>
    <template #itemContent="{ item, selectedItemsIds }">
      <div
        class="flex items-center justify-between"
        :class="[
          {
            'text-original-800': !selectedItemsIds.includes(item.id),
            'text-black': selectedItemsIds.includes(item.id)
          }
        ]"
      >
        <div class="max-w-[80%] truncate">
          <BaseLabelCheckbox
            :label="item.name"
            :value="selectedItemsIds.includes(item.id)"
          />
        </div>
        <div class="justify-end">
          {{ new Intl.NumberFormat("fr-FR").format(item.products_ids.length) }}
        </div>
      </div>
    </template>
    <template #contentFooter>
      <div class="flex justify-center">
        <BaseSpinner v-if="tagsAreLoading" class="text-gray-400 mx-auto my-4" />
        <BaseInfiniteScroller
          v-if="hasMoreTags"
          :page="currentPageTags"
          @observed="iteratePageTags"
        />
      </div>
    </template>
  </MultiSelectDropdown>
</template>

<script lang="ts">
import MultiSelectDropdown from "@/components/base/components/dropdown/MultiSelectDropdown.vue";
import {
  defineComponent,
  ref,
  SetupContext,
  watch
} from "@vue/composition-api";
import { useBaseResources } from "@/forecasts-review//store";
import BaseSpinner from "@/components/base/components/BaseSpinner.vue";
import BaseInfiniteScroller from "@/components/contents/common/BaseInfiniteScroller.vue";
import BaseLabelCheckbox from "@/components/base/components/BaseLabelCheckbox.vue";
import { useProductsFiltersTags } from "../composables/productFiltersTags";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default defineComponent({
  name: "ForecastReviewTagDropdown",
  components: {
    BaseButton,
    BaseSpinner,
    BaseInfiniteScroller,
    BaseLabelCheckbox,
    MultiSelectDropdown
  },
  props: {},
  emits: [],
  setup: (_props, context: SetupContext) => {
    const { currentSite } = useBaseResources(context);
    const isSupplierView = ref(currentSite.value.isSupplierView);
    // get the composable from the props.
    const {
      currentPageTags,
      hasMoreTags,
      tags,
      tagDropdownSubTitle,
      tagsAreLoading,
      searchTextTags,
      selectedProductsFiltersTags,
      tagsCount,
      deselectAllProductsFiltersTags,
      getDropdownTags,
      fetchTagsWithDebounce,
      iteratePageTags,
      resetTagsState
    } = useProductsFiltersTags();

    getDropdownTags();
    watch(currentSite, () => {
      deselectAllProductsFiltersTags();
      getDropdownTags();
    });
    watch(searchTextTags, () => {
      resetTagsState();
      fetchTagsWithDebounce();
    });
    watch(currentPageTags, () => {
      fetchTagsWithDebounce();
    });
    return {
      currentPageTags,
      currentSite,
      hasMoreTags,
      isSupplierView,
      tags,
      tagDropdownSubTitle,
      tagsAreLoading,
      searchTextTags,
      selectedProductsFiltersTags,
      tagsCount,
      deselectAllProductsFiltersTags,
      iteratePageTags
    };
  }
});
</script>
