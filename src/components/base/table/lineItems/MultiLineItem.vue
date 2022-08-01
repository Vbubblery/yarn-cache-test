<template>
  <div>
    <component
      :is="lineItemByType(data)"
      :key="`multi-row-${data.sourceName}`"
      :name="data.sourceName"
      :hidden-items-count="hiddenItemsCount"
      :data="data"
      :is-editable="isEditable"
      v-on="$listeners"
    />
    <FlowTable
      :key="`table-${data.sourceName}`"
      :view="view"
      :parent-name="data.sourceName"
      :should-load-more="data.shouldLoadMore"
      :hidden-items-count="hiddenItemsCount"
      :body-data="data.subItems"
      :headers="headers"
      :is-editable="isEditable"
      v-on="$listeners"
    />
  </div>
</template>
<script lang="js">
import BasicLineItem from "./BasicLineItem.vue";
import InputLineItem from "./InputLineItem.vue";
import { ROW_TYPE } from "../utils/base";

export default {
  name: "MultiLineItem",
  components: {
    BasicLineItem,
    FlowTable: () => import("../BaseTable.vue")
  },
  props: {
    view: {
      type: String,
      required: true,
      validator(view) {
        return ["demand", "planning"].includes(view);
      }
    },
    data: {
      required: true,
      type: Object
    },
    headers: {
      required: true,
      type: Array
    },
    name: {
      required: false,
      type: String,
      default: ""
    },
    computedCalc: {
      type: Function,
      required: false,
      default: () => x => x
    },
    hiddenItemsCount: {
      type: Number,
      required: false,
      default: 0
    },
    isEditable: { type: Boolean, default: true }
  },
  methods: {
    lineItemByType(row) {
      switch (row.childType) {
        case ROW_TYPE.INPUT:
          return InputLineItem;
        default:
          return BasicLineItem;
      }
    }
  }
};
</script>
