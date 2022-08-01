<i18n>
{
  "en": {
    "orders": "My Supply",
    "recommendation": "Flowlity Supply",
    "clientDemand": "My Forecast",
    "flowlityDemand": "Flowlity Forecast",
    "finalForecast": "Final forecast",
    "maximum": "Stock max",
    "stock": "Stock",
    "minimum": "Stock min",
    "stockCoverage": "Stock coverage",
    "stockCoveragetips":"Based on avg. daily demand",
    "tableSources": "Table Sources"
  },
  "fr": {
    "orders": "Mon Plan",
    "recommendation": "Plan Flowlity",
    "clientDemand": "Ma prédiction",
    "flowlityDemand": "Prédiction Flowlity",
    "finalForecast": "Prédiction finale",
    "maximum": "Stock max",
    "stock": "Stock",
    "minimum": "Stock min",
    "stockCoverage": "Couverture de stock",
    "stockCoveragetips":"Basé sur la demande journalière moyenne",
    "tableSources": "Sources"
  }
}
</i18n>

<template>
  <BaseDrawer
    :drawer-visible="showDrawer"
    :close-drawer="() => $emit('close', hasChangedSources)"
  >
    <div class="mx-4 my-12 text-lg">
      {{ $t("tableSources") }}
    </div>
    <div
      v-for="source in sources[selectedView]"
      :key="source"
      class="grid grid-cols-2 text-center text-sm m-4"
    >
      <div class="flex items-center">
        {{ $t(source) }}
      </div>
      <div>
        <BaseSwitch
          :value="selectedSources[source]"
          @input="handleSourceChecked(source)"
        />
      </div>
    </div>
  </BaseDrawer>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import BaseDrawer from "@/components/base/components/BaseDrawer.vue";
import BaseSwitch from "@/components/base/components/BaseSwitch.vue";
import helper from "@/helper/helper";

import { isEqual } from "lodash";
interface ISourcesDrawer {
  selectedView: String;
  showDrawer: Boolean;
}
export default defineComponent({
  name: "SourcesDrawer",
  components: {
    BaseDrawer,
    BaseSwitch
  },
  props: {
    selectedView: {
      type: String,
      required: true,
      default: "demand"
    },
    showDrawer: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  emits: ["close"],
  setup(_props: ISourcesDrawer, context: SetupContext) {
    // TO REPLACE BY useStore() in Vue3
    const store = context.parent?.$store || null;
    const selectedSources = ref(store?.getters["planning/getSelectedSources"]);
    const initSelection = helper.clone(selectedSources);
    const hasChangedSources = ref(false);
    const sources = {
      planning: [
        "finalForecast",
        "maximum",
        "minimum",
        "orders",
        "stockCoverage"
      ],
      demand: []
    };
    const handleSourceChecked = (source: string) => {
      store?.dispatch("planning/toggleSelectedSource", source);
      hasChangedSources.value = !isEqual(initSelection, selectedSources);
    };
    return {
      hasChangedSources,
      sources,
      selectedSources,
      handleSourceChecked
    };
  }
});
</script>

<style lang="scss">
.ant-switch {
  height: 23px;
}
.ant-switch-checked {
  background-color: #d8f9d0;
  border: 1px solid #d8f9d0;
  .ant-switch-inner {
    color: #1a8700;
  }
}
.ant-switch-checked::after {
  background-color: #eafee6;
  border: 1px solid #1a8700;
}
</style>
