<template>
  <div
    class="flex justify-between items-center px-10 py-5 col-span-10 row-span-1 border-b-2"
  >
    <div class="flex items-center">
      <BaseButton
        icon="arrow-left-s-line"
        type="secondary"
        class="mr-4 text-gray-400"
        @click="$emit('close:modal')"
      />
      <BaseSVG
        v-if="isEditable && hasOrderUnsavedModification"
        name="pencil-fill"
        class="text-blue-600 mr-2"
      />
      <div class="flex flex-col justify-center font-roboto">
        <div class="mb-0.5 text-[16px] leading-[19px] text-black">
          <span>
            {{
              isEditable && hasOrderUnsavedModification
                ? $t("orders.editingModalTitle")
                : $t("orders.orderModalTitle")
            }}
          </span>
          <span class="uppercase text-green-700">
            {{ order.supplierName }}
          </span>
        </div>
        <div class="text-[14px] leading-[16px] text-gray-600">
          {{ orderIdMap.label }}: {{ orderIdMap.value }}
        </div>
      </div>
    </div>

    <div class="flex items-center">
      <BaseButton
        v-if="isEditable && !hasOrderUnsavedModification"
        key="delete"
        type="secondary"
        class="mr-2"
        @click="$emit('delete:order')"
      >
        {{ $t("orders.delete") }}
      </BaseButton>
      <template v-if="isEditable && hasOrderUnsavedModification">
        <BaseButton
          key="revert"
          type="secondary"
          data-testid="order_modal_discard_changes_button"
          class="mr-2"
          @click="$emit('revert:changes')"
        >
          {{ $t("orders.discardChanges") }}
        </BaseButton>
        <BaseButton
          key="save"
          type="primary"
          data-testid="order_modal_save_button"
          class="mr-2"
          @click="$emit('update:order')"
        >
          {{ $t("orders.save") }}
        </BaseButton>
      </template>
      <BaseButton
        v-if="
          !hasOrderUnsavedModification &&
          order.statusId === ORDER_TYPE_VALUE.PLANNED
        "
        key="confirm"
        type="secondary"
        icon="check-line"
        data-testid="order_modal_confirm_button"
        @click="$emit('switch:status')"
      >
        {{ $t("orders.orderConfirm") }}
      </BaseButton>
      <BaseButton
        v-if="
          !hasOrderUnsavedModification &&
          order.statusId === ORDER_TYPE_VALUE.VALIDATED
        "
        key="discard"
        type="success"
        icon="check-line"
        data-testid="order_modal_cancel_button"
        @click="$emit('switch:status')"
      >
        {{ $t("orders.orderConfirmed") }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { useI18n } from "vue-i18n-composable";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import type { Order } from "@/objects/order";
import { ORDER_TYPE_VALUE } from "../constants";

export default defineComponent({
  name: "OrderModalHeader",
  components: {
    BaseButton,
    BaseSVG
  },
  props: {
    order: {
      required: true,
      type: Object as () => Order
    },
    hasOrderUnsavedModification: {
      required: true,
      type: Boolean
    },
    isUpdatingOrder: {
      required: true,
      type: Boolean
    }
  },
  emits: [
    "close:modal",
    "revert:changes",
    "update:order",
    "switch:status",
    "delete:order"
  ],
  setup(props) {
    const isEditable = computed(
      () => props.order.statusId <= ORDER_TYPE_VALUE.VALIDATED
    );

    const { t } = useI18n();

    const orderIdMap = computed(() => {
      return props.order.statusId === ORDER_TYPE_VALUE.PLANNED ||
        props.order.statusId === ORDER_TYPE_VALUE.VALIDATED
        ? {
            label: t("orders.tempId"),
            value: props.order.id
          }
        : {
            label: t("orders.orderId"),
            value: props.order.externalId
          };
    });

    return { isEditable, orderIdMap, ORDER_TYPE_VALUE };
  }
});
</script>
