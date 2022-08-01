<i18n>
{
  "en": {
    "selectedItems": "Selected items | Selected item | Selected items",
    "showDetails": "Show details",
    "selectAll": "Select all",
    "deselectAll": "Deselect all"
  },
  "fr": {
    "selectedItems": "Élément sélectionné | Élément sélectionné | Éléments sélectionnés",
    "showDetails": "Voir détails",
    "selectAll": "Tout sélectionner",
    "deselectAll": "Tout désélectionner"
  }
}
</i18n>
<template>
  <div :class="containerStyle">
    <div v-if="!headless" :class="headStyle">
      <div class="grid grid-cols-12 content-center text-xs">
        <div v-if="tableGridTemplate[0] > 0" class="col-span-1 text-start">
          <div class="flex items-center h-full">
            <div>
              <input
                type="checkbox"
                class="mt-1"
                style="height: 20px; width: 20px"
                :checked="selectAll"
                @change="selectCurrentPage(!selectAll)"
              />
            </div>
            <div class="h-full mx-2">
              <BaseDropdown
                wrapper-style="table-dropdown "
                menu-style="table-dropdown my-4 bg-white"
              >
                <a-menu-item
                  v-if="!selectAll"
                  class="bg-white hover:bg-white text-black"
                >
                  <div class="text-xs" @click="selectCurrentPage(true)">
                    <div class="mx-4 flex justify-between">
                      {{ $t("selectAll") }}
                    </div>
                  </div>
                </a-menu-item>
                <a-menu-item
                  v-if="!!selectedItems.length || selectAll"
                  class="bg-white hover:bg-white text-black"
                >
                  <div class="text-xs" @click="selectCurrentPage(false)">
                    <div class="mx-4 flex justify-between">
                      {{ $t("deselectAll") }}
                    </div>
                  </div>
                </a-menu-item>
              </BaseDropdown>
            </div>
          </div>
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div
            v-if="selectedItems.length > 0 && multiple"
            class="flex items-center"
            :class="{ flex: selectAll }"
          >
            <p>
              {{ $tc("selectedItems", selectedItems.length) }}:
              <strong>{{ selectedItems.length }}</strong>
            </p>
            <BaseButton
              class="mx-8"
              @click="$emit('show-selected', selectedItems)"
            >
              {{ $t("showDetails") }}
            </BaseButton>
          </div>
          <div v-else class="w-full grid grid-cols-12">
            <slot
              name="header"
              :grid-template="tableGridTemplate"
              :selectAll="() => selectCurrentPage(!selectAll)"
            />
          </div>
        </div>
      </div>
    </div>

    <slot name="tableSearch" />
    <div :class="tableStyle">
      <div
        v-for="(item, index) of data"
        :key="`check-table-item-${index}`"
        :class="lineItemStyle"
      >
        <div
          :class="`col-span-${tableGridTemplate[0]} xs:col-span-${
            tableGridTemplate[0] + 1
          } text-start flex items-center`"
        >
          <input
            type="checkbox"
            class="form-checkbox w-full"
            style="height: 20px; max-width: 20px"
            :checked="selectedIds.includes(item.id)"
            @change="selectCurrent(item)"
          />
        </div>
        <slot
          name="lineItem"
          :item="item"
          :selectCurrent="selectCurrent"
          :grid-template="tableGridTemplate"
        />
      </div>
      <slot name="listFooter" />
    </div>
  </div>
</template>

<script lang="ts">
import BaseDropdown from "@/components/base/components/BaseDropdown.vue";
import helper from "@/helper/helper";
import {
  computed,
  defineComponent,
  ref,
  SetupContext
} from "@vue/composition-api";
import { Menu } from "ant-design-vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

interface ICheckTable {
  data: Array<{ id: string }>;
  selectedItems: Array<{ id: string }>;
  selectableItemCount: Number;
  multiple: Boolean;
  gridTemplate: Array<Number>;
  headless: Boolean;
  tableStyle: String;
  headStyle: String;
  lineItemStyle: String;
  containerStyle: String;
}

export default defineComponent({
  name: "CheckTable",
  components: {
    BaseDropdown,
    BaseButton,
    "a-menu-item": Menu.Item
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    selectedItems: {
      type: Array,
      required: false,
      default: () => []
    },
    selectableItemCount: {
      type: Number,
      default: 0,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    gridTemplate: {
      type: Array,
      required: false,
      default: () => []
    },
    headless: {
      type: Boolean,
      required: false,
      default: false
    },
    tableStyle: {
      type: String,
      required: false,
      default: ""
    },
    headStyle: {
      type: String,
      required: false,
      default: ""
    },
    lineItemStyle: {
      type: String,
      required: false,
      default: ""
    },
    containerStyle: {
      type: String,
      required: false,
      default: ""
    }
  },
  emits: ["show-selected", "handle-select-change"],
  setup(props: ICheckTable, context: SetupContext) {
    const sortAsc = ref(true);
    const reload = ref(false);
    const tableGridTemplate = ref(
      props.gridTemplate.length ? props.gridTemplate : [1]
    );

    const selectedIds = computed(() => {
      const items = [...props.selectedItems];
      return items.map(item => item.id);
    });
    const currentPageSelected = computed(() => {
      return helper.intersectionBy("id", props.data, props.selectedItems)
        .length;
    });
    const selectAll = computed(() => {
      return (
        currentPageSelected.value > 0 &&
        props.data.length === currentPageSelected.value
      );
    });

    const selectCurrentPage = (isSelectAll: boolean) => {
      let items = [...props.selectedItems];
      if (!isSelectAll) {
        items = [];
      } else {
        props.data.forEach(currentItem => {
          const itemIndex = items.findIndex(item => item.id === currentItem.id);
          if (itemIndex === -1) {
            items.push(currentItem);
          }
        });
      }
      context.emit("handle-select-change", items);
    };

    const selectCurrent = (current: { id: string }) => {
      const items = [...props.selectedItems];
      const itemIndex = items.findIndex(item => item.id === current.id);
      if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
      } else {
        items.push(current);
      }
      context.emit("handle-select-change", items);
    };
    return {
      sortAsc,
      reload,
      tableGridTemplate,
      selectedIds,
      currentPageSelected,
      selectAll,
      selectCurrentPage,
      selectCurrent
    };
  }
});
</script>
<style lang="scss" scoped>
.table-dropdown {
  min-width: 50px !important;
}
.text-desc {
  opacity: 0.5;
  display: block;
  font-size: 14px;
  margin: 3px 0 0 0;
  cursor: default;
}
.pagination-dropdown {
  width: 200px;
}
</style>
