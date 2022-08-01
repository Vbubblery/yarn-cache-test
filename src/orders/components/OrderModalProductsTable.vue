<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <div class="grid pt-6 grid-cols-24 text-sm text-fl-dark-grey">
      <div
        class="col-start-2 p-2 pl-0"
        :class="currentSite.isSupplierView ? 'col-span-13' : 'col-span-8'"
      >
        {{ $t("orders.reference") }}
      </div>
      <div class="col-span-3 p-2 text-right">
        {{ $t("orders.quantity") }}
      </div>
      <div v-if="!currentSite.isSupplierView" class="col-span-3 p-2 text-right">
        {{ $t("orders.daysOfCoverage") }}
      </div>
      <div class="col-span-2 p-2 text-right">
        {{ $t("orders.lotSize") }}
      </div>
      <div class="col-span-2 p-2 text-right">
        {{ $t("orders.moq") }}
      </div>
      <div class="col-span-3 p-2 pr-8 text-right">
        {{ $t("orders.value") }}
      </div>
    </div>
    <div class="flex-1 overflow-auto pt-[1px] pb-1">
      <OrderModalProductsTableItem
        v-for="supply in order.supplies"
        :key="`${order.id}-${supply.id}`"
        :order="order"
        :supply="supply"
        :is-editing="isEditing"
        :view="view"
        :editable-supplies="editableSupplies"
        :editable-supply-quantity="editableSupplies[supply.productId]"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Site } from "@/objects/site";
import { Order } from "@/objects/order";
import { computed, defineComponent } from "@vue/composition-api";
import OrderModalProductsTableItem from "@/orders/components/OrderModalProductsTableItem.vue";

export default defineComponent({
  name: "OrderModalProductsTable",
  components: {
    OrderModalProductsTableItem
  },
  props: {
    order: {
      required: true,
      type: Object as () => Order
    },
    isEditing: {
      required: true,
      type: Boolean
    },
    editableSupplies: {
      required: true,
      type: Object as () => Record<string, number>
    },
    view: {
      required: true,
      type: String
    }
  },
  setup(_, context) {
    const store = context.root.$store;
    const currentSite = computed<Site>(
      () => store.getters["common/getCurrentSite"]
    );

    return {
      currentSite
    };
  }
});
</script>
