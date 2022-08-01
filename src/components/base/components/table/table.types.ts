/* eslint @typescript-eslint/no-explicit-any: 0 */

export enum ColumnAlignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right"
}

export enum ColumnSortingOrder {
  ASC = "asc",
  DESC = "desc"
}

export interface IColumn {
  key: string;
  minWidth?: number | string;
  maxWidth?: number | string;
  sticky?: boolean;
  alignment?: ColumnAlignment;
  title?: string;
  subtitle?: string;
  sortable?: boolean;
  // maximum lines limit for each cell (long text ellipsis...)
  // works only with default content but accessible in slot vars
  maxLinesLimit?: number;
}

export interface ISortingState {
  by: IColumn["key"]; // demand
  order: ColumnSortingOrder;
}

export interface ITableConfig {
  columns: IColumn[];
  showHeader?: boolean;
  stickyHeader?: boolean;
  headerHeight?: number;
  gap?: number;
  interactive?: boolean;
  selectionKey?: string;
}

export interface IBaseTableProps {
  config: ITableConfig;
  data: any[];
  selectedObjects?: any[];
  sorting?: ISortingState;
}
