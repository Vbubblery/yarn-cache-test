<template>
  <VDropdown
    :triggers="['click']"
    :distance="popperDistance"
    :popper-class="popperClass"
    placement="bottom-start"
  >
    <template #default="{ shown }">
      <slot :shown="shown" />
    </template>
    <template #popper>
      <div class="pt-4 pb-2">
        <div class="flex items-center h-8 pr-2" :class="{ 'pl-4': searchable }">
          <BaseInput
            v-if="searchable"
            clearable
            class="w-full"
            icon="search-line"
            :placeholder="$t('dropdown.search')"
            :value="searchText"
            @input="event => $emit('update:input', event)"
          />
          <BaseButton
            condensed
            type="action"
            class="ml-2"
            @click="$emit('deselect:all')"
            >{{ $t("dropdown.deselectAll") }}</BaseButton
          >
        </div>
        <slot name="header" />
        <div
          class="mt-2 overflow-y-auto overflow-x-hidden pl-2"
          :class="{ 'mb-2': $slots.footer }"
          :style="listStyle"
        >
          <div
            v-for="(item, index) of items"
            :key="`dropdown-item-${index}`"
            :class="[
              'p-2',
              'pr-4',
              'cursor-pointer',
              'text-original-800',
              'rounded-md',
              {
                'bg-blue-100 hover:bg-blue-200': selectedItemsIds.includes(
                  item.id
                ),
                'hover:bg-original-100': !selectedItemsIds.includes(item.id)
              }
            ]"
            @click.prevent="addOrRemoveItem(item)"
          >
            <slot
              name="itemContent"
              :item="item"
              :selectedItemsIds="selectedItemsIds"
            >
              <BaseLabelCheckbox
                :label="item.name"
                :value="selectedItemsIds.includes(item.id)"
              />
            </slot>
          </div>
          <slot name="contentFooter" />
        </div>
      </div>
    </template>
  </VDropdown>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  SetupContext,
  toRefs
} from "@vue/composition-api";
import BaseInput from "@/components/base/components/BaseInput.vue";
import BaseLabelCheckbox from "@/components/base/components/BaseLabelCheckbox.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import { toNumerableCSSValue } from "@/helper/reusables";

interface IMultiSelectDropdown {
  selectedItems: Array<{ id: string; name: string }>;
  listHeight: string | number;
}

export default defineComponent({
  name: "MultiSelectDropdown",
  components: {
    BaseInput,
    BaseLabelCheckbox,
    BaseButton
  },
  model: {
    prop: "selectedItems",
    event: "select:items"
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: []
    },
    selectedItems: {
      type: Array,
      required: false,
      default: []
    },
    searchable: {
      type: Boolean,
      required: false,
      default: false
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
    searchText: {
      type: String,
      required: false,
      default: ""
    },
    listHeight: {
      type: [Number, String],
      required: false,
      default: 400
    }
  },
  emits: ["select:items", "update:input", "deselect:all"],
  setup(props: IMultiSelectDropdown, context: SetupContext) {
    const { selectedItems } = toRefs(props);

    const addOrRemoveItem = (item: { id: string; name: string }) => {
      let newSelectedItems = selectedItems.value;
      const index = newSelectedItems.findIndex(
        selectedItem => selectedItem.id === item.id
      );
      if (index !== -1) {
        newSelectedItems.splice(index, 1);
      } else {
        newSelectedItems.push(item);
      }
      context.emit("select:items", newSelectedItems);
    };

    const selectedItemsIds = computed(() =>
      selectedItems.value.map(selectedItem => selectedItem.id)
    );

    const listStyle = computed<string>(() => {
      return `max-height: ${toNumerableCSSValue(props.listHeight)}`;
    });

    return {
      listStyle,
      selectedItemsIds,
      addOrRemoveItem
    };
  }
});
</script>
