<template>
  <div class="overflow-y-auto">
    <OrdersFilterHeader data-testid="orders-filter-header" />
    <div class="bg-white relative py-4 px-1">
      <OrdersList data-testid="orders-list" />
    </div>
  </div>
</template>

<script lang="ts">
import { ORDER_TYPE_VALUE } from "@/orders/constants";
import { computed, defineComponent, SetupContext } from "@vue/composition-api";
import OrdersFilterHeader from "@/orders/components/OrdersFilterHeader.vue";
import OrdersList from "@/orders/components/OrdersList.vue";
import { useOrdersSearch } from "@/orders/composables";
import { Site } from "@/objects/site";

export default defineComponent({
  name: "OrdersPage",
  components: {
    OrdersFilterHeader,
    OrdersList
  },
  setup(_, context: SetupContext) {
    const { getters } = context.root.$store;
    const { updateOrderType } = useOrdersSearch();
    const currentSite = computed<Site>(() => getters["common/getCurrentSite"]);
    const selectDefaultOrderType = () => {
      const defaultSelected = currentSite.value.isSupplierView
        ? ORDER_TYPE_VALUE.SALES_ORDER
        : ORDER_TYPE_VALUE.PLANNED;
      updateOrderType(defaultSelected);
    };

    selectDefaultOrderType();
    return {
      updateOrderType
    };
  }
});
</script>
