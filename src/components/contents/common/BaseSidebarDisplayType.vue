<i18n>
{
  "en": {
    "aggregated": "Aggregated",
    "nonAggregated": "Non aggregated",
    "2products": "At least 2 products should be selected",
    "lessThan10": "Only when less than 10 products selected"
  },
  "fr": {
    "aggregated": "Aggregé",
    "nonAggregated": "Non aggregé",
    "2products": "Au moins 2 produits doivent être sélectionnés",
    "lessThan10": "Uniquement lorsque moins de 10 produits sélectionnés"
  }
}
</i18n>

<template>
  <div>
    <div class="mb-2">
      <a-radio-group :value="getHasSelectedAggregated" @change="onRadioChange">
        <a-tooltip
          placement="bottom"
          :title="cannotAggregate ? $t('2products') : ''"
          :get-popup-container="getPopupContainer"
        >
          <a-radio :disabled="cannotAggregate" :value="true">
            {{ $t("aggregated") }}
          </a-radio>
        </a-tooltip>

        <a-radio :value="false">
          {{ $t("nonAggregated") }}
        </a-radio>
      </a-radio-group>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Radio, Tooltip } from "ant-design-vue";

export default {
  name: "BaseSidebarDisplayType",
  components: {
    "a-radio-group": Radio.Group,
    "a-radio": Radio,
    "a-tooltip": Tooltip
  },
  computed: {
    ...mapGetters("common", [
      "getHasSelectedAggregated",
      "getSelectedMultipleMethod",
      "getSelectedProducts",
      "getCurrentSite"
    ]),
    cannotAggregate() {
      return (
        this.getSelectedMultipleMethod === "name" &&
        this.selectedProductsLength < 2
      );
    },
    selectedProductsLength() {
      return Object.keys(this.getSelectedProducts || {}).length;
    }
  },
  watch: {
    selectedProductsLength(newValue) {
      if (newValue <= 1) {
        this.updateHasSelectedAggregated(false);
      }
    }
  },
  methods: {
    ...mapActions("common", ["updateHasSelectedAggregated"]),
    onRadioChange(e) {
      this.updateHasSelectedAggregated(e.target.value);
    },
    getPopupContainer(trigger) {
      return trigger.parentElement;
    }
  }
};
</script>
