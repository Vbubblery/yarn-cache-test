import { ORDER_TYPE_VALUE } from "@/orders/constants";

export type OrderSort = "asc" | "desc";
export type OrderFieldSort = "send_before" | "ship_before" | "date";

export type OrdersFilters = {
  page: number;
  filter?: ORDER_TYPE_VALUE;
  sort: {
    field: OrderFieldSort;
    order: OrderSort;
  };
  keyword_search: string;
};

export interface Order {
  id: string;
  statusId: ORDER_TYPE_VALUE;
}

export type Supply = {
  isDefaultUnit: boolean;
  quantity: number;
  secondaryUnitQuantity: number;
  productId: string;
};
export type DateRangeType = {
  startDate?: string;
  endDate?: string;
};

export type CustomRangeType = "lastOrderDate" | "deliveryDate";
