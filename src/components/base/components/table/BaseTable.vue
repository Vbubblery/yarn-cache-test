<template>
  <section
    ref="root"
    v-mutation="stackStickyColumns"
    class="t"
    :style="tableStyle"
  >
    <template v-if="shouldDisplayHeader">
      <slot
        name="header"
        :columns="config.columns"
        :header-style="customHeaderStyle"
      >
        <div
          v-for="(column, columnIndex) in config.columns"
          :key="column.key"
          :data-sticky="column.sticky"
          :class="[
            't__cell t__cell--header',
            {
              't__cell--scrolled-sticky': column.sticky && hasScrolled,
              't__cell--sticky-header': config.stickyHeader
            },
            ...cellsClasses[columnIndex]
          ]"
          :style="{
            ...cellsStyle[columnIndex],
            ...headerCellsStyle[columnIndex]
          }"
        >
          <slot
            :name="`header(${column.key})`"
            :column="column"
            :switch-selection-all="() => switchSelectionAll()"
          >
            <TableColumnHeading
              :column="column"
              :sorting="sorting"
              @sort="$emit('sort', $event)"
            />
          </slot>
        </div>
      </slot>
    </template>
    <template v-for="(obj, objIndex) in data">
      <div
        v-for="(column, columnIndex) in config.columns"
        :key="`${column.key}-${objIndex}`"
        :data-sticky="column.sticky"
        :class="[
          't__cell t__cell--body',
          { 't__cell--scrolled-sticky': column.sticky && hasScrolled },
          { 't__cell--in-hovered-row': objIndex === hoveredRowIndex },
          { 't__cell--selected': config.interactive && isSelected(obj) },
          { 't__cell--in-last-body-row': objIndex === data.length - 1 },
          ...cellsClasses[columnIndex]
        ]"
        :style="cellsStyle[columnIndex]"
        @mouseover="config.interactive && onMouseOver(objIndex)"
        @mouseleave="config.interactive && onMouseLeave()"
        @click="config.interactive && onClick(obj, objIndex)"
      >
        <slot
          :name="`content(${column.key})`"
          :value="obj[column.key]"
          :obj="obj"
          :column="column"
          :switch-selection="() => switchSelection(obj)"
          :selected="config.interactive && isSelected(obj)"
        >
          <p :class="defaultContentClasses[columnIndex]">
            {{ obj[column.key] }}
          </p>
        </slot>
      </div>
    </template>
  </section>
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-explicit-any: 0 */

import {
  defineComponent,
  toRefs,
  PropType,
  SetupContext
} from "@vue/composition-api";
import {
  IBaseTableProps,
  ISortingState,
  ITableConfig
} from "@/components/base/components/table/table.types";
import {
  useInteractiveRows,
  useStickyColumns,
  useTableLayout
} from "@/components/base/components/table/table.composable";
import TableColumnHeading from "@/components/base/components/table/TableColumnHeading.vue";

export default defineComponent({
  name: "BaseTable",
  components: { TableColumnHeading },
  model: {
    prop: "selectedObjects",
    event: "input"
  },
  props: {
    config: {
      type: Object as PropType<ITableConfig>,
      required: true
    },
    data: {
      type: Array as PropType<any[]>,
      required: true
    },
    selectedObjects: {
      type: Array as PropType<any[]>,
      required: false,
      default: undefined
    },
    sorting: {
      type: Object as PropType<ISortingState>,
      required: false,
      default: undefined
    }
  },
  emits: ["sort", "click:item", "input"],
  setup(props: IBaseTableProps, context: SetupContext) {
    const { config, data, selectedObjects } = toRefs(props);

    const {
      cellsClasses,
      cellsStyle,
      customHeaderStyle,
      defaultContentClasses,
      headerCellsStyle,
      shouldDisplayHeader,
      tableStyle
    } = useTableLayout(config);

    const { root, hasScrolled, stackStickyColumns } = useStickyColumns(config);

    const {
      hoveredRowIndex,
      isSelected,
      onClick,
      onMouseLeave,
      onMouseOver,
      switchSelection,
      switchSelectionAll
    } = useInteractiveRows(config, data, selectedObjects, context);

    return {
      cellsClasses,
      cellsStyle,
      customHeaderStyle,
      defaultContentClasses,
      hasScrolled,
      headerCellsStyle,
      hoveredRowIndex,
      root,
      shouldDisplayHeader,
      tableStyle,
      isSelected,
      onClick,
      onMouseLeave,
      onMouseOver,
      stackStickyColumns,
      switchSelection,
      switchSelectionAll
    };
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.t {
  width: 100%;
  display: grid;
  overflow: auto;
  font-family: $font-roboto;

  &__cell {
    display: flex;
    background: white;
    border-bottom: 1px solid $color-original-300;

    &--header {
      align-items: center;
      padding-top: 8px;
      padding-bottom: 8px;
      transition: box-shadow 500ms linear;
    }

    &--body {
      padding-top: 15px;
      padding-bottom: 15px;
      font-size: 14px;
      line-height: 18px;
      color: $color-original-800;
    }

    &--sticky-header {
      z-index: 1;
      position: sticky;
      top: 0;
    }

    &--header.t__cell--sticky {
      z-index: 3;
    }

    &--sticky {
      z-index: 2;
      position: sticky;
    }

    &--last-sticky {
      border-right: 1px solid transparent;
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0);
      transition: border-right-color 500ms linear, box-shadow 500ms linear;
    }

    &--in-last-body-row {
      border-bottom: none;
    }

    // show separator and shadow for the last sticky column
    // only when user has scrolled the table
    &--last-sticky.t__cell--scrolled-sticky {
      border-right-color: $color-original-300;
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    }

    // show shadow for the header cells
    // only when user has scrolled the table
    &--header.t__cell--scrolled-sticky {
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    }

    &--first {
      padding-left: 24px;
    }

    &--last {
      padding-right: 24px;
    }

    &--in-hovered-row {
      cursor: pointer;
      background: $color-original-100;
    }

    &--selected {
      background: $color-blue-200;
    }

    &--align-left {
      justify-content: flex-start;
    }

    &--align-center {
      justify-content: center;
    }

    &--align-right {
      justify-content: flex-end;
    }
  }

  &__default-content {
    padding-left: 6px;
    padding-right: 26px;
  }
}
</style>
