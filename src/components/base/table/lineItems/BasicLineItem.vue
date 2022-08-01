<i18n>
{
  "en": {
    "outOfStock": "Out of stock",
    "aboveMax": "Too much inventory",
    "allGood": "All good",
    "belowMin": "Below Recommended Minimum",
    "partlyFrozen": "Period partly frozen",
    "fullyFrozen": "Period fully frozen",
    "partlyFrozen": "Period partly frozen, switch to days to edit this supply",
    "validatedTooltip": "Warning, the order for this supply has been validated",
    "flowlitySupply": "Recommendation by Flowlity",
    "lotSize": "Lot size",
    "moq": "MOQ",
    "day":"D",
    "coverageDays": "Your current stock could cover {number} day(s)"
  },
  "fr": {
    "outOfStock": "Rupture de stock",
    "aboveMax": "Stock au dessus du maximum recommandé",
    "allGood": "Ok",
    "belowMin": "Stock en dessous du minimum recommandé",
    "partlyFrozen": "Période partiellement frozen",
    "fullyFrozen": "Période entièrement frozen",
    "partlyFrozen": "La période est partiellement frozen, éditez cette supply en jour",
    "validatedTooltip": "Attention, la commande pour cette supply a été validée",
    "flowlitySupply": "Recommandation par Flowlity",
    "lotSize": "Taille de lot",
    "moq": "Mini de commande",
    "day":"J",
    "coverageDays": "Votre stock actuel pourrait couvrir {number} jour(s)"
  }
}
</i18n>

<template>
  <div
    id="bodyContent"
    :class="[
      {
        'rounded-r-lg ml-0': data.parent,
        'font-medium': data.isMediumFont
      },
      'text-center'
    ]"
    :style="{
      gridTemplateColumns: `repeat(${
        formattedData.length - hiddenItemsCount
      }, 104px)`
    }"
  >
    <template v-for="(item, index) in formattedData">
      <div
        v-if="index >= hiddenItemsCount"
        :key="`cell-${name}-${index}`"
        class="border-b border-transparent"
        :class="{
          '!border-original-200':
            (!data.parent && data.collapsed !== false) || isLast,
          'bg-original-100': data.values[index] && data.values[index].isPast
        }"
        style="grid-row: 1 / span 1; height: 40px"
        :style="`${getIconColorByStatus(data.values[index])}`"
      >
        <BaseTooltip
          placement="top"
          :display="isStatusPresent(data.values, index)"
        >
          <template v-if="isStatusPresent(data.values, index)" #content>
            {{ $t(data.values[index].status) }}
          </template>
          <div
            class="h-full w-full flex items-center justify-end px-2 py-[11px]"
          >
            <span class="text-base uppercase">{{
              isNaN(item) || !item
                ? item
                : new Intl.NumberFormat("fr-FR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  }).format(item)
            }}</span>
          </div>
        </BaseTooltip>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computedCalcBySource, defaultCalc } from "../utils/base";
import { STOCK_STATUS } from "../utils/stocks";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import { defineComponent } from "@vue/composition-api/dist/vue-composition-api";
import { computed } from "@vue/composition-api";

export default defineComponent({
  name: "BasicLineItem",
  components: {
    BaseTooltip
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    name: {
      required: false,
      type: String,
      default: ""
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
    }
  },
  setup(props) {
    const formattedData = computed(() => {
      return props.data.values.map((item: any) => {
        const name = props.name.split("-")[0];
        const func = computedCalcBySource[name];
        return func ? func(item) : defaultCalc(item.value ?? item);
      });
    });

    const isStatusPresent = (data: any, index: any) =>
      !!(data[index] && data[index].status);

    const getIconByStatus = (item: any) => {
      switch (item?.status) {
        case STOCK_STATUS.ALL_GOOD:
          return "check-circle";
        case STOCK_STATUS.BELOW_MIN:
        case STOCK_STATUS.ABOVE_MAX:
          return "exclamation-circle";
        case STOCK_STATUS.OUT_OF_STOCK:
          return "times-circle";
        default:
          return undefined;
      }
    };

    const getIconColorByStatus = (item: any) => {
      switch (item?.status) {
        case STOCK_STATUS.ALL_GOOD:
          return "color: #161616;";
        case STOCK_STATUS.BELOW_MIN:
          return "background-color: #FFF5ED; color: #9C4400;";
        case STOCK_STATUS.ABOVE_MAX:
          return "background-color: #F9F0FF; color: #7607CD;";
        case STOCK_STATUS.OUT_OF_STOCK:
          return "background-color: #FFE9E9; color: #B01010;";
        default:
          return "";
      }
    };

    return {
      formattedData,
      isStatusPresent,
      getIconByStatus,
      getIconColorByStatus
    };
  }
});
</script>
<style scoped>
#bodyContent {
  grid-area: 1 / 1 / span 1 / span 1;
  display: grid;
  grid-template-rows: min-content;
}
</style>
