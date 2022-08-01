<template>
  <div
    class="min-w-[436px] max-w-[436px] flex flex-col justify-between h-full px-10 py-8 overflow-auto bg-gray-100 border-gray-300 border-l"
  >
    <div>
      <p class="text-xl">
        <span class="text-gray-900">
          {{ $t(`orders.orderTitleStatus${order.statusId}`) }}
        </span>
        <span>
          {{ "- " + $t("orders.orderTitleDetail") }}
        </span>
      </p>
      <div v-if="!currentSite.isSupplierView" class="mt-1 min-h-[42px]">
        <p
          v-if="
            !isOrderRespectingAllConstraints ||
            !areSuppliesRespectingAllConstraints
          "
          class="flex items-center text-orange-500"
        >
          <BaseSVG name="error-warning-fill" size="20" class="mr-1" />
          <span
            v-if="
              !isOrderRespectingAllConstraints &&
              !areSuppliesRespectingAllConstraints
            "
            data-testid="order_modal_order_and_supply_constraint_not_met"
          >
            {{ $t("orders.orderAndSupplyConstraintNotMet") }}
          </span>
          <span
            v-else-if="!isOrderRespectingAllConstraints"
            data-testid="order_modal_order_constraint_not_met"
          >
            {{ $t("orders.orderConstraintNotMet") }}
          </span>
          <span
            v-else-if="!areSuppliesRespectingAllConstraints"
            data-testid="order_modal_supplies_constraint_not_met"
          >
            {{ $t("orders.supplyConstraintNotMet") }}
          </span>
        </p>
        <p v-else class="flex items-center">
          <BaseSVG
            name="checkbox-circle-line"
            size="20"
            class="mr-1 text-green-600"
          />
          <span
            data-testid="order_modal_met_constraints"
            class="text-green-700"
          >
            {{ $t("orders.constraintsMetMessage") }}
          </span>
        </p>
      </div>
      <div class="my-12 space-y-4">
        <div class="grid grid-cols-2">
          <div class="col-span-1 text-sm flex items-center">
            {{ $t("orders.deliveryDate") }}
          </div>
          <div
            v-if="
              isEditing && order.statusId <= 2 && !currentSite.isSupplierView
            "
            class="col-span-1"
          >
            <ADatePicker
              :disabled-date="disabledDate"
              :allow-clear="false"
              :format="FRENCH_DATE_FORMAT"
              :show-today="false"
              :value="deliveryDateModel"
              @change="updateDeliveryDate"
            />
          </div>
          <div v-else-if="isUpdatingDate">
            <BaseSpinner />
          </div>
          <div v-else class="col-span-1 text-black">
            {{ deliveryDate }}
          </div>
        </div>
        <div v-if="!currentSite.isSupplierView" class="grid grid-cols-2">
          <div class="col-span-1 text-sm">
            {{ $t("orders.latestOrderDate") }}
          </div>
          <div class="col-span-1 text-black">
            {{ latestOrderDateDisplay }}
          </div>
        </div>
        <div class="grid grid-cols-2">
          <div class="col-span-1 text-sm">{{ $t("orders.totalQuantity") }}</div>
          <div class="col-span-1">
            <span class="text-black">
              {{ suppliesQuantity }}
            </span>
            <span class="text-xs">
              {{ (quantity.primaryUnit || "").toLowerCase() }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2">
          <div class="col-span-1 text-sm">{{ $t("orders.addedItems") }}</div>
          <div class="col-span-1">
            <span class="text-black">
              {{ order.supplies.length }}
            </span>
            <span class="text-xs">
              {{ $tc("orders.items", order.supplies.length) }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 mb-8">
          <div class="col-span-1 text-sm">{{ $t("orders.groupedBy") }}</div>
          <div class="col-span-1">
            {{ order.tagGrouper || "-" }}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 mb-8">
        <div class="col-span-1 text-sm">{{ $t("orders.inTotal") }}</div>
        <div class="col-span-1 text-base">
          <span data-testid="order_modal_total_price" class="text-green-700">
            {{ formattedSuppliesTotal }}
          </span>
          <span class="text-xs">€</span>
        </div>
      </div>
    </div>

    <div class="mt-auto space-y-4">
      <div class="text-xl">{{ $t("orders.orderConstraints") }}</div>
      <div class="mt-4 grid grid-cols-2">
        <div class="col-span-1 text-sm flex items-center relative">
          <BaseTooltip
            v-if="
              !currentSite.isSupplierView &&
              !isOrderRespectingOrderFrequencyConstraint
            "
            :content="$t('orders.badOrderFrequency')"
            min-width="max-content"
            class="absolute left-[-30px]"
            placement="top"
          >
            <BaseSVG
              name="error-warning-fill"
              size="20"
              class="mx-1 text-orange-500"
            />
          </BaseTooltip>
          {{ $t("orders.orderFrequency") }}
        </div>
        <div class="col-span-1">
          <span class="text-black">
            {{ order.orderFrequency || "-" }}
          </span>
          <span class="text-xs">
            {{
              order.orderFrequency
                ? $tc("orders.day", order.orderFrequency)
                : ""
            }}
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2">
        <div class="col-span-1 text-sm flex items-center relative">
          <BaseTooltip
            v-if="
              !currentSite.isSupplierView &&
              !isOrderRespectingFullTruckQuantityConstraint
            "
            :content="$t('orders.badFullTruckQuantity')"
            min-width="max-content"
            class="absolute left-[-30px]"
            placement="top"
          >
            <BaseSVG
              name="error-warning-fill"
              size="20"
              class="mx-1 text-orange-500"
            />
          </BaseTooltip>
          {{ $t("orders.fullTruckQty") }}
        </div>
        <div class="col-span-1">
          <span class="text-black">
            {{ order.fullTruckQuantity || "-" }}
          </span>
          <span class="text-xs">{{ order.fullTruckUnit || "" }}</span>
        </div>
      </div>
      <div class="grid grid-cols-2">
        <div class="col-span-1 text-sm flex items-center relative">
          <BaseTooltip
            v-if="
              !currentSite.isSupplierView && !isOrderRespectingMOQConstraint
            "
            :content="$t('orders.badMOQOrder')"
            min-width="max-content"
            class="absolute left-[-30px]"
            placement="top"
          >
            <BaseSVG
              name="error-warning-fill"
              size="20"
              class="mx-1 text-orange-500"
            />
          </BaseTooltip>
          {{ $t("orders.moq") }}
        </div>
        <div class="col-span-1">
          <span class="text-black">
            {{ order.minOrderQuantity || "-" }}
          </span>
          <span class="text-xs">{{
            (order.minOrderUnit || "").toLowerCase()
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useBaseResources } from "@/forecasts-review/store";
import type { Order } from "@/objects/order";
import {
  computed,
  defineComponent,
  ref,
  SetupContext,
  toRefs
} from "@vue/composition-api";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import { DatePicker } from "ant-design-vue";
import { Dayjs } from "dayjs";
import dayjs from "@/dayjs";
import BaseSpinner from "@/components/base/components/BaseSpinner.vue";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import { useOrderDetails } from "../composables";

const FRENCH_DATE_FORMAT = "ddd D. M. YYYY";

export default defineComponent({
  name: "OrderModalAside",
  components: {
    BaseTooltip,
    ADatePicker: DatePicker,
    BaseSpinner,
    BaseSVG
  },
  props: {
    isEditing: {
      required: true,
      type: Boolean
    },
    order: {
      required: true,
      type: Object as () => Order
    },
    editableSupplies: {
      required: true,
      type: Object as () => Record<string, number>
    },
    editableDeliveryDate: {
      required: true,
      type: Object as () => Dayjs
    },
    disabledDate: {
      required: true,
      type: Function
    },
    isUpdatingDate: {
      required: true,
      type: Boolean
    },
    deliveryDate: {
      required: true,
      type: String
    }
  },
  emits: ["update:deliveryDate"],
  setup(props, context: SetupContext) {
    const { currentSite } = useBaseResources(context);
    const { order, editableSupplies, editableDeliveryDate } = toRefs(props);
    const deliveryDateModel = ref(editableDeliveryDate);

    const {
      quantity,
      isOrderRespectingOrderFrequencyConstraint,
      isOrderRespectingFullTruckQuantityConstraint,
      isOrderRespectingMOQConstraint,
      isOrderRespectingAllConstraints,
      areSuppliesRespectingAllConstraints,
      suppliesQuantity,
      formattedSuppliesTotal
    } = useOrderDetails(order, editableSupplies);

    const latestOrderDateDisplay = computed<string>(() =>
      order.value.sendBefore
        ? dayjs(order.value.sendBefore).format(FRENCH_DATE_FORMAT)
        : ""
    );

    const updateDeliveryDate = (value: Dayjs) => {
      context.emit("update:deliveryDate", value);
    };

    return {
      FRENCH_DATE_FORMAT,
      currentSite,
      quantity,
      suppliesQuantity,
      formattedSuppliesTotal,
      latestOrderDateDisplay,
      deliveryDateModel,
      isOrderRespectingOrderFrequencyConstraint,
      isOrderRespectingFullTruckQuantityConstraint,
      isOrderRespectingMOQConstraint,
      isOrderRespectingAllConstraints,
      areSuppliesRespectingAllConstraints,
      updateDeliveryDate
    };
  }
});
</script>
