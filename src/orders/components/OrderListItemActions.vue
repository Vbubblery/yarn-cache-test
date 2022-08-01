<template>
  <div class="flex justify-end">
    <BaseButton
      v-if="availableActions.includes('confirm')"
      type="secondary"
      class="group-hover:block hidden"
      @click.stop="$emit('order:accept')"
    >
      {{ $t("orders.orderConfirm") }}
    </BaseButton>
    <BaseButton
      v-else-if="availableActions.includes('unconfirmed')"
      type="secondary"
      class="group-hover:block hidden"
      @click.stop="$emit('order:discard')"
    >
      {{ $t("orders.orderDiscard") }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "@vue/composition-api";
import { ORDER_ACTION_TYPE } from "@/orders/constants";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default defineComponent({
  components: {
    BaseButton
  },
  props: {
    availableActions: {
      type: Array,
      required: true
    }
  },
  emits: ["order:accept", "order:discard"],
  setup(props) {
    const { availableActions } = toRefs(props);

    const isActionAvailable = computed(
      () =>
        availableActions.value.includes(ORDER_ACTION_TYPE.CONFIRM) ||
        availableActions.value.includes(ORDER_ACTION_TYPE.UNCONFIRMED)
    );

    return { isActionAvailable };
  }
});
</script>
