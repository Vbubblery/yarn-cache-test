<template>
  <div
    class="grid"
    :style="{
      gridTemplateColumns: `repeat(${
        formattedData.length - hiddenItemsCount
      }, 104px)`
    }"
  >
    <template v-for="(item, index) in formattedData">
      <InputLineCell
        v-if="index >= hiddenItemsCount"
        :key="`cell-${index}`"
        :value="item"
        :step="data.values[index].lotSize"
        :is-disabled="data.values[index].isEditable === false || !isEditable"
        :is-past="data.values[index].isPast"
        :is-frozen="data.values[index].isFrozen"
        :original-value="data.originalValues && data.originalValues[index]"
        :should-display-original-value="
          data.changedIndexList && data.changedIndexList.includes(index)
        "
        :should-display-flowlity-logo="
          data.values[index].isByFlowlity && data.values[index].isEditable
        "
        :should-display-orders-tooltip="
          data.values[index].isEditable && name.startsWith('orders')
        "
        :moq-value="data.values[index].moq"
        :units="data.values[index].units"
        :period-type="data.periodType"
        @event:input="value => liveUpdate(value, index)"
        @event:change="value => updateValue(value, index)"
        @event:enter="saveWithEnter"
      />
    </template>
  </div>
</template>

<script lang="js">
import InputLineCell from "@/components/base/table/lineItems/InputLineCell.vue";
import { computedCalcBySource, defaultCalc } from "../utils/base";

export default {
  name: "InputLineItem",
  components: { InputLineCell },
  props: {
    data: {
      required: true,
      type: Object,
      default: () => ({})
    },
    name: {
      required: false,
      type: String,
      default: ""
    },
    type: {
      required: false,
      type: String,
      default: "basic"
    },
    isLast: {
      required: false,
      type: Boolean,
      default: false
    },
    hiddenItemsCount: {
      type: Number,
      required: false,
      default: 0
    },
    isEditable: {
      type: Boolean,
      default: true
    }
  },
emits: ["update:value", "update:preview", "save:data", "reset:value"],
  computed: {
    formattedData() {
      const availableComputedCalcs = Object.keys(computedCalcBySource);
      return this.data.values.map(item => {
        const name = this.name.split("-")[0];
        return availableComputedCalcs.includes(name)
          ? computedCalcBySource[name](item)
          : defaultCalc(item);
      });
    }
  },
  methods: {
    updateValue(newValue, index) {
      newValue = newValue === "" ? null : +newValue;
      this.$emit("update:value", {
        newValue,
        index,
        sourceName: this.name
      });
    },
    resetValue(index) {
      this.$emit("reset:value", {
        index,
        sourceName: this.name
      });
    },
    saveWithEnter() {
      this.$emit("save:data");
    },
    liveUpdate(newValue, index) {
      newValue = newValue === "" ? null : newValue;
      const oldValue = this.data.values[index].value;
      if (newValue === null || oldValue === null || +newValue !== +oldValue) {
        this.$emit("update:preview", {
          newValue: newValue < 0 ? oldValue : newValue,
          index,
          sourceName: this.name
        });
      }
    }
  }
};
</script>
