const getters = {
  getSelectedProducts: jest.fn(),
  getHasSelectedProductError: jest.fn(),
  getSelectedMultipleMethod: jest.fn(),
  getHasSelectedAggregated: jest.fn(),
  getProductsInDropdown: jest.fn(),
  getProductsInDropdownById: jest.fn()
};

const mutations = {
  updateSelectedProducts: jest.fn(),
  updateHasSelectedProductError: jest.fn(),
  updateSelectedMultipleMethod: jest.fn(),
  updateTemporaryProductInDropdown: jest.fn(),
  updateHasSelectedAggregated: jest.fn(),
  updateProductsDropdown: jest.fn()
};

const actions = {
  updateSelectedProducts: jest.fn(),
  updateHasSelectedProductError: jest.fn(),
  updateSelectedMultipleMethod: jest.fn(),
  updateHasSelectedAggregated: jest.fn(),
  fetchProducts: jest.fn(),
  updateTemporaryProductInDropdown: jest.fn()
};

export default {
  getters,
  mutations,
  actions
};
