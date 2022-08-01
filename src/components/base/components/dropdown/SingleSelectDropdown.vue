<template>
  <VDropdown
    :triggers="['click']"
    :distance="popperDistance"
    :popper-class="['focus-within:outline-none', ...popperClass]"
    :placement="placement"
    @update:shown="$emit('update:shown', $event)"
  >
    <template #default="{ shown }">
      <slot :shown="shown" />
    </template>
    <template #popper="{ hide }">
      <div class="p-2">
        <slot name="header" />
        <div
          :class="[
            'overflow-y-auto',
            { 'mt-2': $slots.headers, 'mb-2': $slots.footer }
          ]"
          :style="listStyle"
        >
          <!-- LineItems -->
          <div
            v-for="(item, index) of items"
            :key="`dropdown-item-${index}`"
            @click="select(item, hide)"
          >
            <slot name="itemContent" :item="item" :hide="hide">
              <BaseLabel
                :active="selectedItem.id === item.id"
                :icon="item.icon"
              >
                {{ item.name }}
              </BaseLabel>
            </slot>
          </div>
        </div>
        <slot name="footer" />
      </div>
    </template>
  </VDropdown>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import BaseLabel from "@/components/base/components/BaseLabel.vue";
import { toNumerableCSSValue } from "@/helper/reusables";

export default defineComponent({
  name: "SingleSelectDropdown",
  components: {
    BaseLabel
  },
  model: {
    prop: "selectedItem",
    event: "select:item"
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: []
    },
    selectedItem: {
      type: Object,
      required: false,
      default: () => ({})
    },
    placement: {
      type: String,
      required: false,
      default: "bottom-start"
    },
    closeOnSelect: {
      type: Boolean,
      required: false,
      default: true
    },
    popperClass: {
      type: [Array, String],
      required: false,
      default: ""
    },
    popperDistance: {
      type: Number,
      required: false,
      default: 10
    },
    listHeight: {
      type: [Number, String],
      required: false,
      default: 400
    }
  },
  emits: ["select:item", "update:input", "update:shown"],
  setup(props, context) {
    const select = (item: unknown, hideHandler: () => void) => {
      context.emit("select:item", item);

      if (props.closeOnSelect) {
        hideHandler();
      }
    };

    const listStyle = computed<string>(() => {
      return `max-height: ${toNumerableCSSValue(props.listHeight)}`;
    });

    return { listStyle, select };
  }
});
</script>
