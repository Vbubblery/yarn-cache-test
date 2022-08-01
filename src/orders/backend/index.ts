import { validate } from "@/helper/validation";
import { Order, OrderSupply } from "@/objects/order";
import { OrdersByStatusDto } from "@/orders/typings/dto";
import { SupplierDropdownDto } from "@/orders/typings/dto/supplier-dropdown.dto";
import NotificationService from "@/services/notification.service";
import SupervisorService from "@/services/supervisor.service";
import { JSONSchemaType } from "ajv";
import { ORDER_TYPE_VALUE } from "../constants";

const ordersByStatusSchema: JSONSchemaType<OrdersByStatusDto> = require("@/orders/schemas/OrdersByStatus.json");
const ordersSuppliersSchema: JSONSchemaType<
  Array<SupplierDropdownDto>
> = require("@/orders/schemas/OrdersSuppliers.json");

export const getOrdersCountByStatus = (siteId: number) => {
  const ordersStatusURL = `/api/v1/sites/${siteId}/orders_status`;
  return SupervisorService.get(ordersStatusURL);
};

export const fetchOrdersCountByStatus: (
  siteId: number
) => Promise<OrdersByStatusDto | undefined> = async siteId => {
  try {
    const { data: ordersByStatus } = await getOrdersCountByStatus(siteId);
    const result = validate<OrdersByStatusDto>(
      ordersByStatus,
      ordersByStatusSchema
    );
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      NotificationService.error(err.message);
      throw err;
    }
  }
};

const getOrdersSuppliers = (siteId: number) => {
  const ordersStatusURL = `/api/v1/sites/${siteId}/orders_suppliers`;
  return SupervisorService.get(ordersStatusURL);
};

export const fetchOrdersSuppliers: (
  siteId: number
) => Promise<Array<SupplierDropdownDto> | undefined> = async siteId => {
  try {
    const { data: orderSuppliers } = await getOrdersSuppliers(siteId);
    const result = validate<Array<SupplierDropdownDto>>(
      orderSuppliers,
      ordersSuppliersSchema
    );

    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      NotificationService.error(err.message);
      throw err;
    }
  }
};

export const deleteOrder = async (order: Partial<Order>, siteId: number) => {
  await SupervisorService.delete(`/api/v1/sites/${siteId}/orders/${order.id}`);
};

export const deleteBackendOrder: (
  order: Order,
  siteId: number
) => Promise<void> = async (order, siteId) => {
  try {
    await deleteOrder(order, siteId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      NotificationService.error(err.message);
      throw err;
    }
  }
};
export const deleteOrderSupply = async (
  order: Order,
  supplyId: string,
  siteId: number
) => {
  const { id, supplierId, statusId, date, supplies } = order;
  const updatedSupplies = supplies.map((supply: OrderSupply) => ({
    ...(supply.orderId === id && { id: supply.id }),
    order: id,
    product_site: supply.productId,
    quantity:
      supplyId === supply.id
        ? 0
        : supply.isDefaultUnit
        ? supply.quantity
        : supply.secondaryUnitQuantity
  }));
  await SupervisorService.put(`/api/v1/sites/${siteId}/orders/${order.id}`, {
    id,
    supplier_id: supplierId,
    status_id: statusId,
    date,
    supplies: updatedSupplies
  });
};
export const updateOrders = async (
  orders: Array<Order>,
  updatedDate: string,
  currentSiteId: string
) => {
  const orderList = orders.map(order => {
    const { id, supplierId, statusId, date, supplies } = order;
    const updatedSupplies = supplies.map((supply: OrderSupply) => ({
      ...(supply.orderId === id && { id: supply.id }),
      order: id,
      product_site: supply.productId,
      // we need to send the quantity based on the default unit as the backend will do the conversion automatically
      quantity: supply.isDefaultUnit
        ? supply.quantity
        : supply.secondaryUnitQuantity
    }));
    return {
      id,
      supplier_id: supplierId,
      status_id: statusId,
      date: updatedDate ?? date,
      supplies: updatedSupplies
    };
  });
  await Promise.all(
    orderList.map(async orderData =>
      SupervisorService.put(
        `/api/v1/sites/${currentSiteId}/orders/${orderData.id}`,
        orderData
      )
    )
  );
};
export const getOrderByFilters = async (
  date: string,
  supplierId: string,
  statusId: ORDER_TYPE_VALUE,
  currentSiteId: string
) => {
  const { data } = await SupervisorService.get(
    `/api/v1/sites/${currentSiteId}/orders`,
    {
      date,
      suppliers_ids: [supplierId],
      filter: statusId
    }
  );
  if (data.total) return Order.create(data.results[0]);
  return null;
};
export const updateOrderStatus = async (
  order: Partial<Order>,
  siteId: string
) => {
  await SupervisorService.put(
    `/api/v1/sites/${siteId}/orders_status/${order.id}`,
    { status_id: order.statusId }
  );
};

export { sendOrdersToApi } from "@/orders/backend/clientBackend";
