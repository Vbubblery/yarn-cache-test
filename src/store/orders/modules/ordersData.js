import Vue from "vue";
import OrderService from "@/services/order.service";
import { store } from "@/store/store";
import { DataFrame } from "data-forge";
import dayjs from "dayjs";

const state = {
  orders: null,
  ordersByStatusId: null,
  suppliersInDropdown: [],
  supplierProductsInDropdown: []
};

const getters = {
  getOrders: state => {
    return state.orders;
  },
  getOrdersByStatusId: state => {
    return state.ordersByStatusId;
  },
  getSuppliersInDropdown: state => {
    return state.suppliersInDropdown;
  },
  getSupplierProductsInDropdown: state => {
    return state.supplierProductsInDropdown;
  }
};

const mutations = {
  updateStateOrders: (state, payload) => {
    Vue.set(state, "orders", payload);
  },
  updateStateOrderData: (state, { orderData }) => {
    OrderService.updateOrderLatestDate(orderData);
    const stateOrder = state.orders.at(orderData.id);
    Object.keys(orderData).forEach(key => {
      if (key !== "id") stateOrder[key] = orderData[key];
    });
  },
  appendStateOrderData: (state, newOrder) => {
    OrderService.updateOrderLatestDate(newOrder);
    const newOrders = state.orders.toArray();
    newOrders.push(newOrder);
    const sorting = store.getters["orders/getSort"];
    let newOrdersDf = new DataFrame(newOrders).setIndex("id");
    if (sorting === "asc") {
      newOrdersDf = newOrdersDf.orderBy(order => dayjs(order.date).unix());
    } else if (sorting === "desc")
      newOrdersDf = newOrdersDf.orderByDescending(order =>
        dayjs(order.date).unix()
      );
    state.ordersByStatusId["all"] += 1;
    state.ordersByStatusId[newOrder.statusId] += 1;
    Vue.set(state, "orders", newOrdersDf);
  },
  updateOrderStatusId: (_, { order, statusId }) => {
    order.statusId = statusId;
  },
  updateStateOrdersByStatusId: (state, ordersByStatusId) => {
    Vue.set(state, "ordersByStatusId", { ...ordersByStatusId });
  },
  deleteStateOrders: (state, deletedOrder) => {
    const filteredOrders = state.orders
      .toArray()
      .filter(order => order.id !== deletedOrder.id);
    Vue.set(state, "orders", new DataFrame(filteredOrders).setIndex("id"));
  },
  updateSuppliersDropdown: (state, suppliers) => {
    Vue.set(state, "suppliersInDropdown", suppliers);
  },
  updateSupplierProductsDropdown: (state, products) => {
    Vue.set(state, "supplierProductsInDropdown", products);
  }
};

const actions = {
  fetchOrdersCountByStatus: async ({ commit, rootGetters }) => {
    const siteId = rootGetters["common/getCurrentSite"].id;
    const { data: ordersByStatusId } =
      await OrderService.getOrdersCountByStatus(siteId);
    commit("updateStateOrdersByStatusId", ordersByStatusId);
  },
  deleteSupply: async ({ state, dispatch }, { orderId, supplyIdx }) => {
    const order = state.orders.at(orderId);
    if (order) {
      if (order.supplies.length == 1) {
        dispatch("deleteOrders", order);
      } else {
        order.supplies.splice(supplyIdx, 1);
        OrderService.updateOrderLatestDate(order);
        dispatch("sendUpdatedOrders", [order]);
      }
    }
  },
  updateSupply: ({ dispatch, state }, { orderId, supplyIdx, quantity }) => {
    const order = state.orders.at(orderId);
    if (order) {
      if (order.supplies[supplyIdx]) {
        order.supplies[supplyIdx].quantity = quantity;
      }
      dispatch("sendUpdatedOrders", [order]);
    }
  },
  sendUpdatedOrders: async (_, orderList) => {
    await OrderService.updateOrders(orderList);
  },
  acceptOrder: async ({ commit, state }, { orderId, statusId }) => {
    const order = state.orders.at(orderId);
    const oldStatusId = order.statusId;
    const { ordersByStatusId } = state;
    order.statusId = statusId;
    ordersByStatusId[oldStatusId] -= 1;
    if (ordersByStatusId[statusId]) ordersByStatusId[statusId] += 1;
    await OrderService.acceptOrder(order);
    commit("updateOrderStatusId", { order, statusId });
    commit("updateStateOrdersByStatusId", ordersByStatusId);
  },
  updateOrderStatusId: ({ commit, dispatch, state }, { orderId, statusId }) => {
    const order = state.orders.at(orderId);
    const oldStatusId = order.statusId;
    const { ordersByStatusId } = state;
    order.statusId = statusId;
    ordersByStatusId[oldStatusId] -= 1;
    if (ordersByStatusId[statusId]) ordersByStatusId[statusId] += 1;
    else ordersByStatusId[statusId] = 1;
    dispatch("sendUpdatedOrders", [order]);
    commit("updateOrderStatusId", { order, statusId });
    commit("updateStateOrdersByStatusId", ordersByStatusId);
  },
  deleteOrders: async ({ commit, state }, { orderId }) => {
    const siteId = rootGetters["common/getCurrentSite"].id;
    const { ordersByStatusId } = state;
    const order = state.orders.at(orderId);
    commit("deleteStateOrders", order);
    ordersByStatusId[order.statusId] -= 1;
    await OrderService.deleteOrders(order, siteId);
    commit("updateStateOrdersByStatusId", ordersByStatusId);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
