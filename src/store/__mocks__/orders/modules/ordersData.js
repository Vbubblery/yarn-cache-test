import { DataFrame } from "data-forge";

const state = {
  orders: new DataFrame([
    {
      docId: "1",
      supplies: [{ name: "Product1", quantity: 1 }],
      supplierId: 1
    },
    { docId: "2", supplies: [{ name: "Product1", quantity: 1 }], supplierId: 1 }
  ]).setIndex("docId"),
  ordersByStatusId: {
    all: 3,
    1: 2,
    2: 1,
    3: 0,
    4: 0,
    past: 0
  },
  suppliersInDropdown: [],
  supplierProductsInDropdown: []
};

const getters = {
  getOrdersByStatusId: jest.fn(() => state.ordersByStatusId),
  getSuppliersInDropdown: jest.fn(() => state.suppliersInDropdown),
  getSupplierProductsInDropdown: jest.fn(() => state.supplierProductsInDropdown)
};

const mutations = {
  updateStateOrders: jest.fn(),
  updateStateOrderData: jest.fn(),
  updateOrderStatusId: jest.fn(),
  appendStateOrderData: jest.fn(),
  updateOrdersByStatusIdFromQuery: jest.fn(),
  updateStateOrdersByStatusId: jest.fn(),
  deleteStateOrders: jest.fn(),
  updateSuppliersDropdown: jest.fn(),
  updateSupplierProductsDropdown: jest.fn()
};

const actions = {
  fetchOrders: jest.fn(),
  deleteSupply: jest.fn(),
  updateSupply: jest.fn(),
  sendUpdatedOrders: jest.fn(),
  updateOrderStatusId: jest.fn(),
  deleteOrders: jest.fn(),
  fetchOrdersCountByStatus: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
