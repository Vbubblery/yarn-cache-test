export enum ORDER_TYPE {
  NEW_ORDERS = "new_orders",
  PLANNED = "planned",
  VALIDATED = "validated",
  PURCHASE_ORDER = "purchaseOrders",
  SALES_ORDER = "salesOrders",
  DELIVERED = "delivered"
}

export enum ORDER_TYPE_VALUE {
  PLANNED = 1,
  VALIDATED = 2,
  PURCHASE_ORDER = 3,
  SALES_ORDER = 3,
  DELIVERED = 4
}

export enum ORDER_ACTION_TYPE {
  UPLOAD = "upload",
  CONFIRM = "confirm",
  DELETE = "delete",
  EXPORT = "export",
  EXPORT_SFTP = "exportSftp",
  UNCONFIRMED = "unconfirmed",
  VALIDATE = "validate"
}

export enum Views {
  CUSTOMER = "customer",
  SUPPLIER = "supplier"
}

export const events = {
  CHANGE_ORDER_TYPE: "change:order-type"
};
export const supplierOrdersHeaders = [
  { name: ORDER_TYPE.SALES_ORDER, value: ORDER_TYPE_VALUE.SALES_ORDER },
  { name: ORDER_TYPE.DELIVERED, value: ORDER_TYPE_VALUE.DELIVERED }
];

export const userOrdersHeaders = [
  { name: ORDER_TYPE.PLANNED, value: ORDER_TYPE_VALUE.PLANNED },
  { name: ORDER_TYPE.VALIDATED, value: ORDER_TYPE_VALUE.VALIDATED },
  {
    name: ORDER_TYPE.PURCHASE_ORDER,
    value: ORDER_TYPE_VALUE.PURCHASE_ORDER
  },
  { name: ORDER_TYPE.DELIVERED, value: ORDER_TYPE_VALUE.DELIVERED }
];
