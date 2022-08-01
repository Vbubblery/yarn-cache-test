<template>
  <div
    :class="[
      'th',
      {
        'th--sortable': column.sortable,
        'th--sorted': sorted,
        'th--desc': sortedDesc
      }
    ]"
    @click="sort"
  >
    <div
      v-if="column.title || column.subtitle"
      :class="['th__lines', `text-${column.alignment || 'left'}`]"
    >
      <p v-if="column.title" class="th__title">
        {{ column.title }}
      </p>
      <p v-if="column.subtitle" class="th__subtitle">
        {{ column.subtitle }}
      </p>
    </div>
    <div class="th__sorting-toggle">
      <BaseSVG name="arrow-down-line" size="16" class="th__sorting-arrow" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  SetupContext
} from "@vue/composition-api";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import {
  ColumnSortingOrder,
  IColumn,
  ISortingState
} from "@/components/base/components/table/table.types";

interface ITableColumnHeadingProps {
  column: IColumn;
  sorting: ISortingState;
}

export default defineComponent({
  name: "TableColumnHeading",
  components: { BaseSVG },
  props: {
    column: {
      type: Object as PropType<IColumn>,
      required: true
    },
    sorting: {
      type: Object as PropType<ISortingState>,
      required: false,
      default: () => null
    }
  },
  emits: ["sort"],
  setup(props: ITableColumnHeadingProps, context: SetupContext) {
    const sorted = computed<boolean>(
      () => props.sorting && props.column.key === props.sorting.by
    );

    const sortedDesc = computed<boolean>(
      () => sorted.value && props.sorting?.order === ColumnSortingOrder.DESC
    );

    const getSwitchedOrder = (order: ColumnSortingOrder) => {
      return order === ColumnSortingOrder.ASC
        ? ColumnSortingOrder.DESC
        : ColumnSortingOrder.ASC;
    };

    const sort = () => {
      if (!props.column.sortable) {
        return;
      }

      let newState: Partial<ISortingState> = {
        by: props.column.key
      };

      if (sorted.value) {
        newState.order = getSwitchedOrder(props.sorting.order);
      } else {
        newState.order = ColumnSortingOrder.ASC;
      }

      context.emit("sort", newState);
    };

    return { sorted, sortedDesc, sort };
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.th {
  width: max-content;
  display: flex;
  align-items: center;
  // this rule is required to have the same height
  // for "title only" and "title + subtitle" usages
  align-self: stretch;
  padding: 6px;
  color: $color-original-500;
  border-radius: 6px;
  user-select: none;
  transition: background 200ms linear, color 200ms linear;

  &--sortable:hover {
    color: $color-original-600;
    background: $color-original-200;
    cursor: pointer;
  }

  &--sortable:hover &__sorting-arrow {
    opacity: 1;
    color: $color-original-500;
  }

  &__sorting-arrow {
    opacity: 0;
    transition: opacity 150ms linear, transform 200ms ease-in-out;
  }

  &--sorted {
    color: $color-original-800;
  }

  &--sortable.th--sorted:hover {
    color: $color-original-800;
    background: $color-original-200;
  }

  &--sorted:hover &__sorting-arrow {
    color: $color-original-800;
  }

  &__lines {
    margin-right: 4px;
  }

  &__title,
  &__subtitle {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__title {
    font-size: 14px;
    line-height: 18px;
  }

  &__subtitle {
    font-size: 12px;
    line-height: 14px;
  }

  &--sorted &__sorting-arrow {
    animation: gelatine 0.5s;
    opacity: 1;
  }

  &--desc &__sorting-arrow {
    transform: rotateX(180deg);
  }
}
</style>
