/* eslint @typescript-eslint/no-explicit-any: 0 */
import { ITableConfig } from "@/components/base/components/table/table.types";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  Ref,
  SetupContext
} from "@vue/composition-api";
import { toNumerableCSSValue } from "@/helper/reusables";

// we set "display: grid" and "grid-template-columns" CSS rules for every line
// so we need to prepare it
function buildTableStyle(config: ITableConfig): Partial<CSSStyleDeclaration> {
  const columnsSizes = config.columns.map<string>(column => {
    const minWidth = toNumerableCSSValue(column.minWidth ?? "auto");
    const maxWidth = toNumerableCSSValue(column.maxWidth ?? "1fr");
    return `minmax(${minWidth}, ${maxWidth})`;
  });

  const gridTemplateColumns = columnsSizes.join(" ");

  // important: don't rename vars since there are CSS Rule Declarations
  // names should be exact
  return {
    gridTemplateColumns
  };
}

function buildCustomHeaderStyle(
  config: ITableConfig
): Partial<CSSStyleDeclaration> {
  const columnsCount = config.columns.length;
  const styles: Partial<CSSStyleDeclaration> = {
    gridColumn: `1 / span ${columnsCount}`,
    background: "white",
    zIndex: "3"
  };

  if (config.stickyHeader) {
    styles.position = "sticky";
    styles.top = "0";
  }

  if (config.headerHeight) {
    styles.height = `${config.headerHeight}px`;
  }

  return styles;
}

function buildCellsStyle(config: ITableConfig) {
  const lrPadding = Math.ceil((config.gap ?? 8) / 2);
  const paddingPX = `${lrPadding}px`;

  return config.columns.map<Partial<CSSStyleDeclaration>>((c, index) => {
    const rules: Partial<CSSStyleDeclaration> = {};

    const isFirst = index === 0;
    const isLast = index === config.columns.length - 1;

    if (!isFirst) {
      rules.paddingLeft = paddingPX;
    }
    if (!isLast) {
      rules.paddingRight = paddingPX;
    }

    return rules;
  });
}

function buildHeaderCellsStyle(config: ITableConfig) {
  return config.columns.map<Partial<CSSStyleDeclaration>>(() => {
    const rules: Partial<CSSStyleDeclaration> = {};

    if (config.headerHeight) {
      rules.height = `${config.headerHeight}px`;
    }

    return rules;
  });
}

function buildCellsClasses(config: ITableConfig): string[][] {
  // prettier-ignore
  const lastStickyColumnIndex = config.columns.reduce<number>((acc, column, index) => {
      if (column.sticky) {
        return index;
      }
      return acc;
  }, -1);

  return config.columns.map((c, index) => {
    const classes = [`t__cell--align-${c.alignment || "left"}`];
    if (config.interactive) {
      classes.push("t__cell--interactive");
    }
    if (index === 0) {
      classes.push("t__cell--first");
    }
    if (index === config.columns.length - 1) {
      classes.push("t__cell--last");
    }
    if (c.sticky) {
      classes.push("t__cell--sticky");
    }
    if (c.sticky && index === lastStickyColumnIndex) {
      classes.push("t__cell--last-sticky");
    }
    return classes;
  });
}

function buildDefaultContentClasses(config: ITableConfig) {
  return config.columns.map(c => {
    const classes = ["t__default-content"];

    if (c.maxLinesLimit) {
      classes.push(`line-clamp-${c.maxLinesLimit}`);
    }

    return classes;
  });
}

export function useTableLayout(config: Ref<ITableConfig>) {
  const shouldDisplayHeader = computed<boolean>(() => {
    return config.value.showHeader ?? true;
  });

  const tableStyle = computed<Partial<CSSStyleDeclaration>>(() =>
    buildTableStyle(config.value)
  );
  const customHeaderStyle = computed<Partial<CSSStyleDeclaration>>(() =>
    buildCustomHeaderStyle(config.value)
  );
  const cellsStyle = computed<Partial<CSSStyleDeclaration>[]>(() =>
    buildCellsStyle(config.value)
  );
  const headerCellsStyle = computed<Partial<CSSStyleDeclaration>[]>(() =>
    buildHeaderCellsStyle(config.value)
  );
  const cellsClasses = computed<string[][]>(() =>
    buildCellsClasses(config.value)
  );
  const defaultContentClasses = computed<string[][]>(() =>
    buildDefaultContentClasses(config.value)
  );

  return {
    cellsClasses,
    cellsStyle,
    customHeaderStyle,
    defaultContentClasses,
    headerCellsStyle,
    shouldDisplayHeader,
    tableStyle
  };
}

export function useStickyColumns(config: Ref<ITableConfig>) {
  const root = ref<HTMLDivElement | null>(null);
  const scrollLeftPosition = ref<number>(0);
  const hasSticky = computed<boolean>(() => {
    return config.value.columns.some(c => c.sticky);
  });

  // this logic is related to "position: sticky" for the sticky columns
  // goal:   to set "left" position (in pixels) for each sticky column
  // why:    we want to have multiple sticky columns
  // so:     we need to recalculate "left" every time when we have changes in DOM
  const stackStickyColumns = () => {
    if (!root.value || !hasSticky.value) {
      return;
    }

    const children = root.value.children;
    const rows: HTMLDivElement[][] = [];

    const columnsCount = computed<number>(() => config.value.columns.length);

    for (let i = 0; i < children.length; i++) {
      const rowIndex = Math.floor(i / columnsCount.value);
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      rows[rowIndex].push(children[i] as HTMLDivElement);
    }

    // set "left" position = sum of all previous sticky items in current row
    rows.forEach(row => {
      row.reduce<number>((acc, cell) => {
        if (cell.hasAttribute("data-sticky")) {
          cell.style.left = `${acc}px`;
          return acc + cell.getBoundingClientRect().width;
        }
        return acc;
      }, 0);
    });
  };

  const updateScrollPosition = () => {
    scrollLeftPosition.value = root.value?.scrollLeft ?? 0;
  };

  const hasScrolled = computed(() => scrollLeftPosition.value > 0);

  onMounted(() => {
    stackStickyColumns();
    root.value?.addEventListener("scroll", updateScrollPosition, {
      passive: true
    });
  });

  onBeforeUnmount(() => {
    root.value?.removeEventListener("scroll", updateScrollPosition);
  });

  return { hasScrolled, root, stackStickyColumns };
}

export function useInteractiveRows(
  config: Ref<ITableConfig>,
  data: Ref<any[]>,
  selectedObjects: Ref<any[] | undefined> | undefined,
  context: SetupContext
) {
  const hoveredRowIndex = ref<number>(-1);

  const selectionKey = computed<string>(() => {
    return config.value.selectionKey ?? "id";
  });

  const includes = (obj: any): boolean => {
    if (!selectedObjects?.value?.length) {
      return false;
    }
    return !!selectedObjects.value.find(
      selectedObj => selectedObj[selectionKey.value] === obj[selectionKey.value]
    );
  };

  const switchSelectionAll = () => {
    if (!selectedObjects?.value) {
      throw Error(
        "Provide 'selectedObjects' property to select rows in interactive mode"
      );
    }
    if (data.value.length === selectedObjects.value?.length) {
      context.emit("input", []);
    } else {
      context.emit("input", data.value.slice());
    }
  };

  const switchSelection = (obj: any) => {
    if (!selectedObjects?.value) {
      throw Error(
        "Provide 'selectedObjects' property to select rows in interactive mode"
      );
    }
    const index = selectedObjects.value.findIndex(
      selectedObj => selectedObj[selectionKey.value] === obj[selectionKey.value]
    );
    const newArray = selectedObjects.value.slice();
    if (index > -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(obj);
    }
    context.emit("input", newArray);
  };

  const onClick = (obj: any, rowIndex: number) => {
    context.emit("click:item", obj, obj[selectionKey.value], rowIndex);
  };

  const onMouseOver = (rowIndex: number) => {
    hoveredRowIndex.value = rowIndex;
  };

  const onMouseLeave = () => {
    hoveredRowIndex.value = -1;
  };

  const isSelected = (obj: any): boolean => {
    const objHasKey = selectionKey.value in obj;
    if (!config.value.interactive || !selectedObjects?.value || !objHasKey) {
      return false;
    }
    return includes(obj);
  };

  return {
    hoveredRowIndex,
    isSelected,
    onMouseOver,
    onMouseLeave,
    onClick,
    switchSelection,
    switchSelectionAll
  };
}
