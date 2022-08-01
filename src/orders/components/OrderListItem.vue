<template>
  <div
    class="oli bg-white px-2 flex items-center border-b-2 border-dashed cursor-pointer w-full min-h-[60px] group"
    data-testid="order_list_item_container"
    @click="showDetails"
  >
    <div class="w-8 max-w-8 h-full flex items-center">
      <BaseTooltip
        v-if="canUserAccessToOrderWarnings"
        light
        data-testid="order_alert_tooltip"
        placement="top"
      >
        <BaseSVG name="error-warning-fill" class="text-orange-500" />
        <template v-if="!isOrderValid" #content>
          <div v-if="invalidProductsCount > 0" class="oli__warning">
            <p class="font-base leading-6 font-medium">
              {{ $t("orders.productIssues") }}
            </p>
            <p>
              <span class="text-orange-600">
                {{ invalidProductsCount }}
              </span>
              {{ $tc("orders.issueMOQ", invalidProductsCount) }}
            </p>
          </div>
          <div v-if="invalidProductsCount === 0" class="oli__warning">
            <p class="oli__warning font-base leading-6 font-medium">
              {{ $t("orders.orderIssues") }}
            </p>
            <p
              v-if="!isOrderRespectingMOQConstraint && order.minOrderUnit"
              class="oli__warning text-orange-600"
            >
              {{ $t("orders.constraintMOQ") }} (
              <span class="text-orange-600">
                {{ order.minOrderQuantity }}
                {{ order.minOrderUnit.toLowerCase() }} </span
              >)
            </p>
            <p
              v-if="
                !isOrderRespectingOrderFrequencyConstraint &&
                order.orderFrequency
              "
              class="oli__warning"
            >
              {{ $t("orders.constraintFrequency") }} (
              <span class="text-orange-600">
                {{ order.orderFrequency }}
                {{ $t("days") }}</span
              >)
            </p>
            <p
              v-if="
                !isOrderRespectingFullTruckQuantityConstraint &&
                order.fullTruckUnit
              "
              class="oli__warning"
            >
              {{ $t("orders.constraintFullTruck") }} (<span
                class="text-orange-600"
                >{{ order.fullTruckQuantity }}
                {{ order.fullTruckUnit.toLowerCase() }}</span
              >)
            </p>
          </div>
        </template>
      </BaseTooltip>
    </div>
    <div class="text-left items-center justify-start inline-grid px-2 group">
      <input
        type="checkbox"
        class="h-4 w-4"
        :checked="isSelected"
        @click.stop="selectOrderById(order.id)"
      />
    </div>
    <div class="grid grid-cols-9 gap-2 content-center text-sm w-full py-2 mx-3">
      <div class="inline-grid items-center col-span-1 px-4">
        <p>
          {{
            [3, 4].includes(orderTypeValue) && order.externalId
              ? order.externalId
              : order.id
          }}
        </p>
      </div>
      <div
        v-if="[1, 2].includes(orderTypeValue)"
        class="col-span-1 inline-grid items-center px-1"
        @click.self="showDetails"
      >
        <p>{{ dateToDisplay }}</p>
      </div>
      <div class="col-span-1 inline-grid items-center px-1">
        <p v-if="dateLabelToDisplay !== 'date'" class="text-gray-600">
          {{ deliveryDate }}
        </p>
      </div>
      <div class="inline-grid items-center px-1" :class="supplierHeadingClass">
        {{ order.supplierName }}
      </div>
      <div class="col-span-1 inline-grid items-center px-2">
        <p class="text-gray-700 text-right">
          {{ supplies.length }}
          <span class="text-gray-600 text-2xs">{{
            $tc("orders.items", supplies.length)
          }}</span>
        </p>
      </div>
      <div class="col-span-1 inline-grid items-right px-2">
        <p class="text-gray-700 text-right py-2">
          {{ formattedSuppliesTotal }}
          <span class="text-gray-600 text-2xs">€</span>
        </p>
      </div>
      <div class="col-span-1 inline-grid items-center px-3 text-right">
        <div
          :class="{
            'group-hover:hidden': isActionAvailable && !showSFTPExportDateColumn
          }"
          class="block text-gray-700 py-1"
        >
          <span v-if="isTotalQuantityPrimaryValid && quantity.primaryUnit">
            {{ quantity.primaryUnitQuantity }}
            <span class="text-gray-600 text-2xs">
              {{ quantity.primaryUnit.toLowerCase() }}
            </span>
          </span>
          <span class="mx-2">/</span>
          <span v-if="isTotalQuantitySecondaryValid && quantity.secondaryUnit">
            {{ quantity.secondaryUnitQuantity }}
            <span class="text-gray-600 text-2xs">
              {{ quantity.secondaryUnit.toLowerCase() }}
            </span>
          </span>
        </div>

        <OrderListItemActions
          v-if="!showSFTPExportDateColumn"
          :available-actions="availableActions"
          @order:accept="acceptCurrentOrder"
          @order:discard="discardCurrentOrder"
        />
      </div>
      <div
        v-if="showSFTPExportDateColumn"
        class="col-span-1 inline-grid items-center px-3 text-right"
      >
        <div
          :class="{ 'group-hover:hidden': isActionAvailable }"
          class="block text-gray-700 py-1"
        >
          {{ lastSftpExportDate }}
        </div>

        <OrderListItemActions
          :available-actions="availableActions"
          @order:accept="acceptCurrentOrder"
          @order:discard="discardCurrentOrder"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import helper from "@/helper/helper";
import { Order, OrderSupply } from "@/objects/order";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import { Site } from "@/objects/site";
import {
  computed,
  defineComponent,
  SetupContext,
  toRefs
} from "@vue/composition-api";
import { ORDER_ACTION_TYPE, ORDER_TYPE_VALUE } from "@/orders/constants";
import { useOrderActions, useOrderDetails } from "@/orders/composables";
import OrderListItemActions from "@/orders/components/OrderListItemActions.vue";
import { Company } from "@/objects/company";

export default defineComponent({
  components: {
    OrderListItemActions,
    BaseTooltip,
    BaseSVG
  },
  props: {
    isSelected: {
      type: Boolean,
      required: false,
      default: false
    },
    shouldDisplayActions: {
      type: Boolean,
      required: false
    },
    orderTypeValue: {
      type: Number,
      required: true
    },
    availableActions: {
      type: Array,
      required: true
    },
    order: {
      type: Object as () => Order,
      required: true
    },
    dateLabelToDisplay: {
      type: String,
      required: false,
      default: "date"
    }
  },
  emits: ["select:order", "update:viewItem", "reload:page"],
  setup(props, context: SetupContext) {
    const { availableActions, order, orderTypeValue } = toRefs(props);

    const currentSite = computed<Site>(
      () => context.root.$store.getters["common/getCurrentSite"]
    );

    const company = computed<Company>(
      () => context.root.$store.getters["common/getCompany"]
    );

    const {
      quantity,
      formattedSuppliesTotal,
      isOrderRespectingOrderFrequencyConstraint,
      isOrderRespectingFullTruckQuantityConstraint,
      isOrderRespectingMOQConstraint
    } = useOrderDetails(order);

    const supplies = computed<OrderSupply[]>(() => {
      return props.order?.supplies || [];
    });

    const deliveryDate = computed<string>(() => {
      return helper.switchDateFormat(
        props.order?.date,
        "YYYY-MM-DD",
        "DD/MM/YYYY"
      );
    });

    const { acceptCurrentOrder, discardCurrentOrder } = useOrderActions(
      context,
      order,
      currentSite
    );

    const dateToDisplay = computed<string>(() => {
      let date;
      switch (props.dateLabelToDisplay) {
        case "send_before":
          date = order.value?.sendBefore;
          break;
        case "ship_before":
          date = order.value?.shipBefore;
          break;
        default:
          date = order.value?.date;
          break;
      }
      return helper.switchDateFormat(date, "YYYY-MM-DD", "DD/MM/YYYY");
    });

    const invalidProductsCount = computed<number>(() => {
      return (order.value?.supplies || []).filter(
        (supply: OrderSupply) =>
          (supply.moq && supply.quantity < supply.moq) ||
          (supply.lotSize && supply.quantity % supply.lotSize !== 0)
      ).length;
    });

    const isOrderValid = computed<boolean>(() => {
      return (
        isOrderRespectingMOQConstraint.value &&
        isOrderRespectingFullTruckQuantityConstraint.value &&
        invalidProductsCount.value === 0 &&
        isOrderRespectingOrderFrequencyConstraint.value
      );
    });

    const isTotalQuantityPrimaryValid = computed<boolean>(() => {
      const primaryUnits = (props.order?.supplies || []).map(
        (supply: OrderSupply) => supply.unit
      );
      const primaryUnitsSet = new Set(primaryUnits);
      return (
        primaryUnitsSet.size === 1 &&
        !primaryUnitsSet.has("") &&
        !primaryUnitsSet.has(null)
      );
    });

    const isTotalQuantitySecondaryValid = computed<boolean>(() => {
      const secondaryUnits = (props.order?.supplies || []).map(
        (supply: OrderSupply) => supply.secondaryUnit
      );
      const secondaryUnitsSet = new Set(secondaryUnits);
      return (
        secondaryUnitsSet.size === 1 &&
        !secondaryUnitsSet.has("") &&
        !secondaryUnitsSet.has(null)
      );
    });

    const showDetails = () => {
      context.emit("update:viewItem", order.value.id);
    };

    const selectOrderById = (id: string) => {
      context.emit("select:order", { id });
    };

    const canUserAccessToOrderWarnings = computed(
      () => !currentSite.value.isSupplierView && !isOrderValid.value
    );

    const isActionAvailable = computed(
      () =>
        availableActions.value.includes(ORDER_ACTION_TYPE.CONFIRM) ||
        availableActions.value.includes(ORDER_ACTION_TYPE.UNCONFIRMED)
    );

    const showSFTPExportDateColumn = computed<boolean>(() => {
      return (
        !currentSite.value.isSupplierView &&
        orderTypeValue.value === ORDER_TYPE_VALUE.VALIDATED &&
        company.value.allowSftpExport
      );
    });

    const lastSftpExportDate = computed<string>(() => {
      if (order.value.lastSftpExportDate) {
        return helper.toCalendarDate(order.value.lastSftpExportDate);
      } else {
        return "–";
      }
    });

    const supplierHeadingClass = computed<string>(() => {
      const isTemporaryStatus = [
        ORDER_TYPE_VALUE.PLANNED,
        ORDER_TYPE_VALUE.VALIDATED
      ].includes(orderTypeValue.value);

      if (isTemporaryStatus) {
        return showSFTPExportDateColumn.value ? "col-span-2" : "col-span-3";
      } else {
        return showSFTPExportDateColumn.value ? "col-span-3" : "col-span-4";
      }
    });

    return {
      acceptCurrentOrder,
      discardCurrentOrder,
      currentSite,
      showDetails,
      selectOrderById,
      supplies,
      deliveryDate,
      dateToDisplay,
      formattedSuppliesTotal,
      isOrderRespectingOrderFrequencyConstraint,
      quantity,
      isOrderRespectingFullTruckQuantityConstraint,
      isOrderRespectingMOQConstraint,
      invalidProductsCount,
      isOrderValid,
      isTotalQuantityPrimaryValid,
      isTotalQuantitySecondaryValid,
      canUserAccessToOrderWarnings,
      isActionAvailable,
      ORDER_TYPE_VALUE,
      showSFTPExportDateColumn,
      lastSftpExportDate,
      supplierHeadingClass
    };
  }
});
</script>
<style lang="scss" scoped>
input {
  width: 20px;
  height: 20px;
}

.oli {
  &__warning {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
