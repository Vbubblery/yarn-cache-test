<i18n>
{
  "en": {
    "orders": "My Supply",
    "demand": "My Demand",
    "stock": "Stock"
  },
  "fr": {
    "orders": "Mon Plan",
    "demand": "Ma Demande",
    "stock": "Stock"
  }
}
</i18n>

<template>
  <div class="flex flex-col">
    <a-checkbox
      class="m-0 ml-[8px]"
      :checked="getSelectedSources.stock"
      @change="toggleSelectedSource('stock')"
    >
      <span class="text-gray-600">{{ $t("stock") }}</span>
    </a-checkbox>
    <a-checkbox
      class="m-0"
      :checked="getSelectedSources.historicalDemand"
      @change="toggleSelectedSource('historicalDemand')"
    >
      <span class="text-gray-600">{{ $t("demand") }}</span>
    </a-checkbox>
    <a-checkbox
      class="m-0"
      :checked="getSelectedSources.orders"
      @change="toggleSelectedSource('orders')"
    >
      <span class="text-gray-600">{{ $t("orders") }}</span>
    </a-checkbox>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Checkbox } from "ant-design-vue";
import { dataDisplayName } from "@/dictionary/translationTable";

export default {
  name: "DataSidebarSources",
  components: {
    "a-checkbox": Checkbox
  },
  computed: {
    ...mapGetters("data", ["getSelectedSources"])
  },
  methods: {
    ...mapActions("data", ["toggleSelectedSource"]),
    displaySource(source) {
      return dataDisplayName[source];
    }
  }
};
</script>
