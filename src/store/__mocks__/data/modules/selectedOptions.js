import dayjs from "@/dayjs";
import { Product } from "@/objects/product";

const state = {
  selectedProducts: {
    1: Product.create({
      id: 1,
      name: "Product1",
      price: 42.42,
      site: 1,
      productSupplierLinks: [1]
    })
  },
  hasSelectedSourcesError: false,
  selectedSources: {
    stock: true,
    historicalDemand: true,
    orders: true
  },
  hasSelectedProductError: false,
  selectedStartDate: dayjs().subtract(6, "month"),
  selectedEndDate: dayjs()
};

const getters = {
  getSelectedProducts: jest.fn().mockReturnValue(state.selectedProducts),
  getHasSelectedProductError: jest
    .fn()
    .mockReturnValue(state.hasSelectedProductError),
  getSelectedSources: jest.fn().mockReturnValue(state.selectedSources),
  getHasSelectedSourcesError: jest
    .fn()
    .mockReturnValue(state.hasSelectedSourcesError),
  getSelectedStartDate: jest.fn().mockReturnValue(state.selectedStartDate),
  getSelectedEndDate: jest.fn().mockReturnValue(state.selectedEndDate)
};

const mutations = {
  updateSelectedProducts: jest.fn(),
  updateHasSelectedProductError: jest.fn(),
  updateSelectedSources: jest.fn(),
  updateHasSelectedSourcesError: jest.fn(),
  updateSelectedStartDate: jest.fn(),
  updateSelectedEndDate: jest.fn()
};

const actions = {
  updateSelectedProducts: jest.fn(),
  updateHasSelectedProductError: jest.fn(),
  updateHasSelectedSourcesError: jest.fn(),
  updateSelectedStartDate: jest.fn(),
  updateSelectedEndDate: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
