import { computed, ComputedRef, ref, Ref } from "@vue/composition-api";
import {
  CONFIG_NAME,
  IConfig,
  PLANNING_DEMAND_VIEW
} from "@/forecasts-review/typings";
import {
  ColumnSortingOrder,
  IColumn,
  ISortingState,
  ITableConfig
} from "@/components/base/components/table/table.types";
import { useColumns } from "@/forecasts-review/composables/columns";

export const useTable = (
  config: Ref<IConfig>,
  view: ComputedRef<PLANNING_DEMAND_VIEW>
) => {
  const sorting = ref<ISortingState>({
    by: "name",
    order: ColumnSortingOrder.ASC
  });

  const {
    CHECKBOX_COLUMN,
    REFERENCE_COLUMN,
    PRODUCT_NAME_COLUMN,
    SUPPLIERS_COLUMN,
    ALERTS_COLUMN,
    TAG_NAME_COLUMN
  } = useColumns();

  const activeColumns = computed<IColumn[]>(() => {
    if (config.value.name === CONFIG_NAME.TAG) {
      return [CHECKBOX_COLUMN.value, TAG_NAME_COLUMN.value];
    } else if (view.value === PLANNING_DEMAND_VIEW.DEMAND) {
      return [
        CHECKBOX_COLUMN.value,
        REFERENCE_COLUMN.value,
        PRODUCT_NAME_COLUMN.value,
        SUPPLIERS_COLUMN.value
      ];
    } else {
      return [
        CHECKBOX_COLUMN.value,
        REFERENCE_COLUMN.value,
        PRODUCT_NAME_COLUMN.value,
        SUPPLIERS_COLUMN.value,
        ALERTS_COLUMN.value
      ];
    }
  });

  const hasSelectedItems = computed(() => {
    return config.value.selectedItems.length > 0;
  });

  const tableConfig = computed<ITableConfig>(() => {
    return {
      interactive: true,
      headerHeight: 48,
      stickyHeader: true,
      columns: activeColumns.value
    };
  });

  return {
    hasSelectedItems,
    sorting,
    tableConfig
  };
};
