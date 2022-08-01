<i18n src="@/i18n/orders.json"></i18n>
<template>
  <div>
    <div class="flex px-6 py-4 h-full mx-2 my-5">
      <div
        class="font-montserrat leading-6 text-2xl font-normal mx-4 my-1 mr-12"
      >
        {{ $t("orderTitle") }}
      </div>
      <div class="flex">
        <BaseToggleButton
          v-for="(label, index) in labels"
          :key="label.name + index"
          :ref="label.name"
          :activate="selectedOrderType === label.value"
          :count="ordersByStatusCount[label.value]"
          :data-testid="`order_status_${label.value}_tab`"
          size="medium"
          class="mx-2"
          @click="() => updateOrderType(label.value)"
        >
          {{ $tc(label.name, ordersByStatusCount[label.value]) }}
        </BaseToggleButton>
      </div>
    </div>
    <div class="h-12 border-b grid grid-cols-12 items-center shadow-md">
      <div
        class="flex items-center h-full"
        :class="`${currentSite.isSupplierView ? 'col-span-12' : 'col-span-4'}`"
      >
        <div
          class="h-full flex items-center justify-center"
          style="width: 80px"
        >
          <BaseSVG name="search-line" />
        </div>
        <div
          class="flex justify-start w-full p-1 rounded"
          :class="`${currentSite.isSupplierView ? '' : 'border-r'}`"
          style="height: 90%"
        >
          <div
            class="flex items-center w-full h-full bg-white border focus-within:border-blue-400 rounded"
          >
            <input
              :value="searchKeyword"
              class="leading-8 rounded-lg px-2 w-full"
              :placeholder="`${$t('search')}...`"
              data-testid="search_orders_page"
              @input="debounce(() => updateSearchKeyword($event.target.value))"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center h-full w-full col-span-8">
        <OrderSuppliersDropdown @handleChange="updateSelectedSuppliers" />
        <OrderTimelinePicker @handleChange="updateSelectedDateRange" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  SetupContext,
  computed,
  watch
} from "@vue/composition-api";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseToggleButton from "@/components/base/components/button/BaseToggleButton.vue";
import OrderSuppliersDropdown from "@/orders/components/OrderSuppliersDropdown.vue";
import OrderTimelinePicker from "@/orders/components/OrderTimelinePicker.vue";

import { supplierOrdersHeaders, userOrdersHeaders } from "@/orders/constants";
import { useOrdersSearch } from "@/orders/composables";
import { fetchOrdersCountByStatus } from "@/orders/backend";
import { useBaseResources } from "@/forecasts-review/store";
import { createDebounce } from "@/orders/composables/utils";

export default defineComponent({
  name: "OrdersFilterHeader",
  components: {
    BaseSVG,
    BaseToggleButton,
    OrderSuppliersDropdown,
    OrderTimelinePicker
  },
  setup(_, context: SetupContext) {
    const {
      searchKeyword,
      selectedSuppliers,
      updateSearchKeyword,
      selectedOrderType,
      updateOrderType,
      ordersByStatusCount,
      updateOrdersByStatusCount,
      updateSelectedSuppliers,
      updateSelectedDateRange
    } = useOrdersSearch();
    const { currentSite } = useBaseResources(context);
    const labels = computed(() => {
      return currentSite.value.isSupplierView
        ? supplierOrdersHeaders
        : userOrdersHeaders;
    });
    const setupOrdersByStatus = async () => {
      const ordersByStatus = await fetchOrdersCountByStatus(
        currentSite.value.id
      );
      if (ordersByStatus) updateOrdersByStatusCount(ordersByStatus);
    };

    watch(currentSite, setupOrdersByStatus);

    setupOrdersByStatus();

    return {
      currentSite,
      selectedOrderType,
      updateOrderType,
      searchKeyword,
      selectedSuppliers,
      updateSearchKeyword,
      labels,
      ordersByStatusCount,
      updateSelectedSuppliers,
      updateSelectedDateRange,
      debounce: createDebounce()
    };
  }
});
</script>
