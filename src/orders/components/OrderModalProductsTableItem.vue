<template>
  <div
    :key="`${order.id}-${supply.id}`"
    class="grid grid-cols-24 border-collapse border-t last:border-b border-dashed border-gray-300"
  >
    <div class="col-span-1 flex items-center justify-end py-1">
      <BaseTooltip
        v-if="!currentSite.isSupplierView && !isRespectingMoqAndLotSize"
        placement="top"
        class="mr-2"
      >
        <BaseSVG
          data-testid="order_modal_supply_alert_icon"
          name="error-warning-fill"
          size="20"
          class="text-orange-500"
        />
        <template v-if="!isRespectingMoqAndLotSize" #content>
          <p
            v-if="!isSupplyRespectingMOQConstraint(supplyQuantity, supply.moq)"
          >
            {{ $t("orders.badMOQSupply") }}
          </p>
          <p
            v-if="
              !isSupplyRespectingLotSizeConstraint(
                supplyQuantity,
                supply.lotSize
              )
            "
          >
            {{ $t(`orders.${view}.badLotSize`) }}
          </p>
        </template>
      </BaseTooltip>
    </div>
    <div
      class="text-black py-2 h-full"
      :class="currentSite.isSupplierView ? 'col-span-13' : 'col-span-8'"
    >
      <BaseTooltip placement="top" :content="supply.name || ''">
        <p class="truncate">
          {{ supply.externalId ? `${supply.externalId} - ` : "" }}
          {{ supply.name }}
        </p>
      </BaseTooltip>
    </div>

    <div
      :class="{ border: order.statusId <= ORDER_TYPE_VALUE.VALIDATED }"
      class="col-span-3 text-center m-0 my-[-1px] border-gray-300 py-2 focus:z-10 focus:border-blue-500 focus-within:border-blue-500 focus-within:z-10"
      @click="e => e.stopPropagation()"
    >
      <BaseTooltip placement="top" class="z-5">
        <template #content>
          <div class="min-w-[250px]">
            <template
              v-if="
                !isHavingUnnecessarySupply &&
                order.statusId <= ORDER_TYPE_VALUE.VALIDATED
              "
            >
              <div class="text-left mb-1">
                {{ neededStockAtEndOfPeriod > 0 ? optimalNeededStock : "0" }}
                /
                {{ supplyQuantity }}
                {{ (supply.unit || "").toLowerCase() }}
                {{ $tc("orders.unnecessarySupply", optimalNeededStock) }}
              </div>

              <hr class="mx-[-8px]" />
            </template>
            <div class="flex justify-between mt-1 last:mt-0">
              <p>
                {{ $t("orders.secondaryUnit") }}
              </p>
              <p class="space-x-1">
                <span>
                  {{ secondaryUnitQuantity }}
                </span>
                <span class="text-2xs">
                  {{ supply.secondaryUnit }}
                </span>
              </p>
            </div>
          </div>
        </template>
        <div v-if="order.statusId <= ORDER_TYPE_VALUE.VALIDATED" class="h-full">
          <input
            :value="
              editableSupplyQuantity !== null
                ? editableSupplyQuantity
                : supply.quantity
            "
            :class="`w-2/3 text-right ${
              neededStockAtEndOfPeriod <= 0
                ? 'text-red-600 font-medium'
                : respectingDeliveryRules
                ? 'text-gray-500'
                : 'text-orange-500 font-medium'
            }`"
            type="number"
            data-testid="order_modal_product_input"
            @input="
              $emit('input', {
                editedId: supply.productId,
                value: $event.target.value
              })
            "
          />
          <span class="text-2xs text-gray-600">{{
            (supply.unit || "").toLowerCase()
          }}</span>
        </div>
        <div v-else class="text-right px-2">
          <span class="text-sm text-gray-900 mr-1">{{ supply.quantity }}</span>
          <span>{{ (supply.unit || "").toLowerCase() }}</span>
        </div>
      </BaseTooltip>
    </div>
    <div
      v-if="!currentSite.isSupplierView"
      class="h-full flex justify-end items-center col-span-3 text-right py-2 mr-2"
    >
      <div
        class="text-black inline-block text-right pr-1"
        :data-testid="`order_modal_supply_days_cov_${supply.productId}`"
      >
        {{ daysOfCoverage }}
      </div>
      <div
        v-if="daysOfCoverage !== INFINITY"
        class="inline-block text-2xs text-gray-600"
      >
        {{ $tc("orders.day", daysOfCoverage) }}
      </div>
    </div>
    <div
      class="h-full flex justify-end items-center col-span-2 text-right pr-2 py-2"
    >
      <span class="text-sm text-gray-900 mr-1">{{ supply.lotSize }}</span>
      <span class="text-2xs text-gray-600">{{
        (supply.unit || "").toLowerCase()
      }}</span>
    </div>
    <div
      class="h-full flex justify-end items-center col-span-2 text-right pr-2 py-2"
    >
      <span class="text-sm text-gray-900 mr-1">{{ supply.moq }}</span>
      <span class="text-2xs text-gray-600">{{
        (supply.unit || "").toLowerCase()
      }}</span>
    </div>
    <div
      class="h-full flex justify-end items-center flex-wrap col-span-3 text-right pr-8 py-2"
    >
      <span class="text-black">
        {{ formattedSupplyTotal }}
      </span>
      <span class="text-xs">€</span>
    </div>
    <template v-if="!currentSite.isSupplierView && !isEditing">
      <div
        class="h-full col-span-1 flex justify-center items-center"
        data-testid="order_modal_open_planning_button"
        @click="goToPlanning({ orderDate: order.date, supply })"
      >
        <BaseButton type="action" icon="line-chart-fill" />
      </div>
      <div
        v-if="order.statusId < ORDER_TYPE_VALUE.SALES_ORDER"
        class="h-full col-span-1 flex justify-center items-center"
        @click="deleteCurrentProduct"
      >
        <BaseButton type="action" icon="delete-bin-fill" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Order, OrderSupply } from "@/objects/order";
import { computed, defineComponent, toRefs } from "@vue/composition-api";
import { computeStockCoverage } from "@/components/base/table/utils/stockCoverage";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import { useOrderDetails } from "../composables";
import { ORDER_TYPE_VALUE } from "../constants";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

const INFINITY = "∞";

export default defineComponent({
  name: "OrderModalProductsTableItem",
  components: {
    BaseSVG,
    BaseButton,
    BaseTooltip
  },
  props: {
    order: {
      required: true,
      type: Object as () => Order
    },
    supply: {
      required: true,
      type: Object as () => OrderSupply
    },
    view: {
      required: true,
      type: String
    },
    isEditing: {
      required: false,
      type: Boolean
    },
    editableSupplies: {
      required: true,
      type: Object as () => Record<string, number>
    },
    editableSupplyQuantity: {
      required: false,
      default: null,
      type: Number
    }
  },
  emits: ["input", "view:planning", "delete:supply"],
  setup(props, context) {
    const store = context.root.$store;
    const currentSite = computed(() => store.getters["common/getCurrentSite"]);
    const { supply, order, editableSupplies, editableSupplyQuantity } =
      toRefs(props);

    const {
      isSupplyRespectingMOQConstraint,
      isSupplyRespectingLotSizeConstraint,
      isOrderWithoutConstraints
    } = useOrderDetails(order, editableSupplies);

    const isOrderEditable = computed(
      () => order.value.statusId <= ORDER_TYPE_VALUE.VALIDATED
    );

    const supplyQuantity = computed<number>(() =>
      isOrderEditable.value && editableSupplyQuantity.value !== null
        ? editableSupplyQuantity.value
        : supply.value.quantity
    );

    const goToPlanning = async (payload: {
      orderDate: string;
      supply: OrderSupply;
    }) => {
      context.emit("view:planning", payload);
    };

    const stockAtEndOfPeriod = computed<number>(() => {
      const diff =
        supplyQuantity.value === null
          ? 0
          : supplyQuantity.value - props.supply.quantity || 0;
      return (supply.value.stockAtEndOfPeriod ?? 0) + diff;
    });

    const daysOfCoverage = computed<number | typeof INFINITY>(() => {
      return computeStockCoverage(
        stockAtEndOfPeriod.value,
        props.supply.totalDemand
      );
    });

    const neededStockAtEndOfPeriod = computed(() => {
      if (isOrderWithoutConstraints.value) {
        return supply.value.quantity;
      }
      const stockNeeded =
        (supply.value.minStockAtEndOfPeriod ?? 0) -
        ((supply.value.stockAtEndOfPeriod ?? 0) - supply.value.quantity);
      // if lotSize is floor then we shouldn't ceil the value
      return supply.value.lotSize % 1 === 0
        ? Math.ceil(stockNeeded)
        : stockNeeded;
    });

    // the necessary stock to full filled the moq and lotSize
    const optimalNeededStock = computed(() => {
      const minStockRespectingLotSize =
        supply.value.lotSize *
          Math.ceil(neededStockAtEndOfPeriod.value / supply.value.lotSize) ||
        neededStockAtEndOfPeriod.value;
      const minStockRespectingMoq =
        supply.value.lotSize *
          Math.ceil(supply.value.moq / supply.value.lotSize) ||
        supply.value.moq;
      return minStockRespectingLotSize > minStockRespectingMoq
        ? minStockRespectingLotSize
        : minStockRespectingMoq;
    });

    const respectingDeliveryRules = computed(() => {
      return optimalNeededStock.value >= supply.value.quantity;
    });

    const isRespectingMoqAndLotSize = computed(
      () =>
        isSupplyRespectingMOQConstraint(
          supplyQuantity.value,
          supply.value.moq
        ) &&
        isSupplyRespectingLotSizeConstraint(
          supplyQuantity.value,
          supply.value.lotSize
        )
    );

    const isHavingUnnecessarySupply = computed(
      () => respectingDeliveryRules.value && neededStockAtEndOfPeriod.value > 0
    );

    const formattedSupplyTotal = computed<string>(() => {
      return new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(supply.value.price * supplyQuantity.value);
    });

    //                    SECONDARY    DEFAULT
    // e.g. how much      m^3 takes    1 fruit    ?
    // e.g. which part of box takes    12 fruits  ?
    const secondaryUnitValuePerDefaultUnitValue = computed<number>(
      () => supply.value.secondaryUnitValue / supply.value.defaultUnitValue
    );

    const secondaryUnitQuantity = computed<string>(() => {
      return new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(
        supplyQuantity.value * secondaryUnitValuePerDefaultUnitValue.value
      );
    });

    const deleteCurrentProduct = async (e: Event) => {
      e.stopPropagation();
      context.emit("delete:supply", supply.value.id);
    };

    return {
      currentSite,
      neededStockAtEndOfPeriod,
      isSupplyRespectingMOQConstraint,
      isSupplyRespectingLotSizeConstraint,
      daysOfCoverage,
      goToPlanning,
      deleteCurrentProduct,
      respectingDeliveryRules,
      optimalNeededStock,
      isRespectingMoqAndLotSize,
      formattedSupplyTotal,
      secondaryUnitQuantity,
      isHavingUnnecessarySupply,
      INFINITY,
      ORDER_TYPE_VALUE,
      supplyQuantity
    };
  }
});
</script>
