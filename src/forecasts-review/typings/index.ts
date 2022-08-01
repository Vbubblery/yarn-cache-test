export interface ISourcesDrawer {
  selectedView: string;
  showDrawer: boolean;
}

export enum PLANNING_DEMAND_VIEW {
  PLANNING = "planning",
  DEMAND = "demand"
}

export enum CONFIG_NAME {
  TAG = "tag",
  PRODUCT = "product"
}
export interface IPageHeaderProps {
  currentConfig: IConfig;
  pageTitle: string;
  configs: { product: IConfig; tag: IConfig };
}

export interface IListProps {
  selectedViewType: string;
  currentConfig: IConfig;
  configs: { [key in CONFIG_NAME]: IConfig };
  selectedCriticalities: Array<IAlertCriticality>;
  selectedTagIds: Array<string>;
  show: boolean;
}

export interface IForecastsReviewModalProps {
  currentConfig: IConfig;
}

export interface ITag {
  id: string;
  products_ids?: Array<string>;
  name?: string;
}

export interface IProductSupplier {
  id: string;
  name?: string;
}

export interface IFetchParams {
  searchText: string;
  currentPage: number;
  itemsPerPage: number;
}

export interface IAlertCriticality {
  id: number;
  name?: string;
  productCount?: Array<number>;
}

export interface IAlert {
  criticality: number;
  exceeding_value: number;
  unit_name: string;
  start_date: Date;
}

export type ConfigItems = Array<IProduct> | Array<ITag>;

export interface IConfig {
  name: CONFIG_NAME;
  items: ConfigItems;
  pages: number;
  currentPage: number;
  itemsPerPage: number;
  selectableItemCount: number;
  searchText: string;
  selectedItems: ConfigItems;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  external_id: string;
  partners: Array<string>;
}

export interface ICustomer {
  id: number;
  name: string;
}

export interface ICalendarDates extends Record<PLANNING_DEMAND_VIEW, string> {}
