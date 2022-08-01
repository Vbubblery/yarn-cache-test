<template>
  <MultiSelectDropdown
    v-model="selectedSuppliers"
    searchable
    :items="suppliersList"
    :popper-distance="5"
    :search-text="searchTextSuppliers"
    popper-class="w-[400px]"
    class="min-w-[80px] overflow-hidden"
    @deselect:all="deselectAllSuppliers"
    @update:input="searchTextSuppliers = $event"
  >
    <template #default="{ shown }">
      <BaseButton
        :type="selectedSuppliers.length === 0 ? 'action' : 'selection'"
        :active="shown"
        class="w-full"
        condensed
        icon="truck-fill"
      >
        {{ supplierTitle }}</BaseButton
      >
    </template>
    <template #header>
      <div
        v-if="!suppliersAreLoading && suppliersList.length === 0"
        class="text-left mt-4 text-base text-original-500 pl-4 py-2"
      >
        {{ $t("forecastsReview.noSuppliers") }}
      </div>
    </template>
    <template #contentFooter>
      <div class="flex justify-center">
        <BaseSpinner
          v-if="suppliersAreLoading"
          class="text-gray-400 mx-auto my-4"
        />
        <BaseInfiniteScroller
          v-if="hasMoreSuppliers"
          :page="currentPageSuppliers"
          @observed="iteratePageSuppliers"
        />
      </div>
    </template>
  </MultiSelectDropdown>
</template>

<script lang="ts">
import MultiSelectDropdown from "@/components/base/components/dropdown/MultiSelectDropdown.vue";
import { useProductsSuppliers } from "@/forecasts-review/composables/productFilterSuppliers";
import {
  defineComponent,
  ref,
  SetupContext,
  watch
} from "@vue/composition-api";
import { useBaseResources } from "@/forecasts-review//store";
import BaseSpinner from "@/components/base/components/BaseSpinner.vue";
import BaseInfiniteScroller from "@/components/contents/common/BaseInfiniteScroller.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default defineComponent({
  name: "ForecastReviewSuppliersDropdown",
  components: {
    BaseButton,
    BaseSpinner,
    BaseInfiniteScroller,
    MultiSelectDropdown
  },
  props: {},
  emits: [],
  setup: (_props, context: SetupContext) => {
    const { currentSite } = useBaseResources(context);
    const isSupplierView = ref(currentSite.value.isSupplierView);
    // get the composable from the props.
    const {
      currentPageSuppliers,
      suppliersAreLoading,
      supplierTitle,
      hasMoreSuppliers,
      suppliersList,
      searchTextSuppliers,
      selectedSuppliers,
      suppliersCount,
      deselectAllSuppliers,
      getDropdownProductsSuppliers,
      fetchSuppliersWithDebounce,
      iteratePageSuppliers,
      resetProductsSuppliersState
    } = useProductsSuppliers();
    getDropdownProductsSuppliers();
    watch(currentSite, () => {
      deselectAllSuppliers();
      resetProductsSuppliersState();
      getDropdownProductsSuppliers();
    });
    watch(searchTextSuppliers, () => {
      resetProductsSuppliersState();
      fetchSuppliersWithDebounce();
    });
    watch(currentPageSuppliers, () => {
      fetchSuppliersWithDebounce();
    });
    return {
      currentPageSuppliers,
      currentSite,
      suppliersAreLoading,
      supplierTitle,
      hasMoreSuppliers,
      isSupplierView,
      suppliersList,
      searchTextSuppliers,
      selectedSuppliers,
      suppliersCount,
      deselectAllSuppliers,
      iteratePageSuppliers
    };
  }
});
</script>
