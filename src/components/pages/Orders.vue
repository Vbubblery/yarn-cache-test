<template>
  <div>
    <orders-filter-header @change:order-type="changeOrderType" />
    <div class="bg-white relative min-h-screen my-2">
      <orders-list :order-type-value="orderTypeValue" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ORDER_TYPE_VALUE } from "@/orders/constants";

export default {
  name: "Orders",
  components: {
    "orders-filter-header": () => import("@/orders/components/OrderHeader.vue"),
    "orders-list": () => import("@/orders/components/OrdersList.vue")
  },
  data() {
    return {
      orderTypeValue: undefined
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite"])
  },
  // TODO: we launch the call to get the orders two times because we change also the status in the Header comp
  // to solve this we should handle the status in vuex
  created() {
    const defaultSelected = this.getCurrentSite.isSupplierView
      ? ORDER_TYPE_VALUE.SALES_ORDER
      : ORDER_TYPE_VALUE.PLANNED;
    this.changeOrderType(defaultSelected);
  },
  methods: {
    changeOrderType(value) {
      this.orderTypeValue = value;
    }
  }
};
</script>
