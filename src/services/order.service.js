import dayjs from "dayjs";
import SupervisorService from "@/services/supervisor.service";
import { store } from "@/store/store";
import { Order } from "@/objects/order";

export const ORDER_STATUS_FILTER = {
  admin: [1, 2, 3, 4],
  notAdmin: [1, 2],
  supplierView: [2, 3, 4]
};

const OrderService = {
  async getOrderByFilters(date, supplierId, statusId) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.get(
      `/api/v1/sites/${siteId}/orders`,
      {
        date,
        suppliers_ids: [supplierId],
        filter: statusId
      }
    );
    if (data.total) return Order.create(data.results[0]);
    return null;
  },
  getOrdersCountByStatus(siteId) {
    const ordersStatusURL = `/api/v1/sites/${siteId}/orders_status`;
    return SupervisorService.get(ordersStatusURL);
  },
  async updateOrders(orders, updatedDate) {
    const orderList = orders.map(order => {
      const { id, supplierId, statusId, date, supplies } = order;
      const updatedSupplies = supplies.map(supply => {
        const updatedSupply = {
          order: id,
          product_site: supply.productId,
          // we need to send the quantity based on the default unit as the backend will do the conversion automatically
          quantity: supply.isDefaultUnit
            ? supply.quantity
            : supply.secondaryUnitQuantity
        };
        if (supply.orderId === id) updatedSupply.id = supply.id;
        return updatedSupply;
      });
      return {
        id,
        supplier_id: supplierId,
        status_id: statusId,
        date: updatedDate ?? date,
        supplies: updatedSupplies
      };
    });
    const siteId = store.getters["common/getCurrentSite"].id;
    await Promise.all(
      orderList.map(async orderData => {
        return await SupervisorService.put(
          `/api/v1/sites/${siteId}/orders/${orderData.id}`,
          orderData
        );
      })
    );
    //recompute alerts
    const productsIdsToUpdate = orderList
      .map(order =>
        order.supplies.map(product => parseInt(product.product_site))
      )
      .flat();
    store.dispatch(
      "alerts/computingAlerts",
      { productSiteIds: productsIdsToUpdate },
      {
        root: true
      }
    );
    // clean planning cache if orders updated
    store.dispatch("planning/resetState", null, { root: true });
  },
  async deleteOrders(order, siteId) {
    await SupervisorService.delete(
      `/api/v1/sites/${siteId}/orders/${order.id}`
    );
    //recompute alerts
    const productsIdsToUpdate = order.supplies
      .map(product => parseInt(product.productId))
      .flat();
    store.dispatch(
      "alerts/computingAlerts",
      { productSiteIds: productsIdsToUpdate },
      {
        root: true
      }
    );
    // clean planning cache if orders updated
    store.dispatch("planning/resetState", null, { root: true });
  },
  updateOrderLatestDate(order) {
    const maxLeadTimeDays = order.supplies.reduce((maxLeadTime, supply) => {
      return Math.max(maxLeadTime, supply.leadTime ?? 0);
    }, 0);
    order.latestOrderDate = dayjs(order.date)
      .subtract(maxLeadTimeDays, "day")
      .unix();
  },
  countByStatusId(orders) {
    const initialStatusIds = {
      all: orders.length,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };
    return orders.reduce((ordersByStatusId, currentOrder) => {
      const currentStatusId = currentOrder.statusId;
      ordersByStatusId[currentStatusId] += 1;
      return ordersByStatusId;
    }, initialStatusIds);
  }
};

export default OrderService;
