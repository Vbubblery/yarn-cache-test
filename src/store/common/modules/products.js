import Vue from "vue";
import ProductsService from "@/services/products.service";
import NotificationService from "@/services/notification.service";
import helper from "@/helper/helper";
import { store } from "@/store/store";

const state = {
  selectedProducts: {},
  hasSelectedProductError: false,
  selectedMultipleMethod: "name",
  defaultView: "demand",
  dataType: "product",
  hasSelectedAggregated: true,
  productsInDropdown: [],
  temporaryProductInDropdown: null
};

const getters = {
  getDefaultView: state => {
    return state.defaultView;
  },
  getSelectedProducts: state => {
    return state.selectedProducts;
  },
  getDataType: state => state.dataType,
  getHasSelectedProductError: state => {
    return state.hasSelectedProductError;
  },
  getSelectedMultipleMethod: state => {
    return state.selectedMultipleMethod;
  },
  getHasSelectedAggregated: state => {
    return state.hasSelectedAggregated;
  },
  getProductsInDropdown: state => {
    return state.productsInDropdown;
  },
  getProductsInDropdownById: state => id => {
    let obj = {};
    state.productsInDropdown.forEach(product => {
      obj[product.id] = product;
    });
    return obj[id];
  }
};

const mutations = {
  updateDefaultView: (state, defaultView) => {
    Vue.set(state, "defaultView", defaultView);
  },
  updateSelectedProducts: (state, selectedProducts) => {
    Vue.set(state, "selectedProducts", selectedProducts);
  },
  updateHasSelectedProductError: (state, hasProductError) => {
    Vue.set(state, "hasSelectedProductError", hasProductError);
  },
  updateSelectedMultipleMethod: (state, selectedMultipleMethod) => {
    Vue.set(state, "selectedMultipleMethod", selectedMultipleMethod);
    let selectAggregated = false;
    if (selectedMultipleMethod === "name")
      selectAggregated = Object.keys(state.selectedProducts).length > 1;
    else selectAggregated = true;
    Vue.set(state, "hasSelectedAggregated", selectAggregated);
  },
  updateDataType: (state, dataType) => {
    Vue.set(state, "dataType", dataType);
  },
  updateTemporaryProductInDropdown: (state, product) => {
    Vue.set(state, "temporaryProductInDropdown", product);
  },
  updateHasSelectedAggregated: (state, hasSelectedAggregated) => {
    Vue.set(state, "hasSelectedAggregated", hasSelectedAggregated);
  },
  updateProductsDropdown: (state, products) => {
    if (state.temporaryProductInDropdown)
      products.push(state.temporaryProductInDropdown);
    Vue.set(state, "productsInDropdown", helper.uniqBy(products));
  }
};

const actions = {
  updatePageDefaultView: ({ commit }, payload) => {
    commit("updateDefaultView", payload);
  },
  updateSelectedProducts: ({ commit }, payload) => {
    commit("updateHasSelectedProductError", false);
    commit("updateSelectedProducts", payload);
  },
  updateHasSelectedProductError: ({ commit }, payload) => {
    commit("updateHasSelectedProductError", payload);
  },
  updateSelectedMultipleMethod: ({ commit }, payload) => {
    commit("updateHasSelectedProductError", false);
    store.dispatch("common/updateHasSelectedTagError", false);
    commit("updateSelectedMultipleMethod", payload);
  },
  updateHasSelectedAggregated: ({ commit }, payload) => {
    commit("updateHasSelectedAggregated", payload);
  },
  fetchProducts: async ({ commit }, payload) => {
    const { pattern, customerId, withSuppliers, productsIds } = payload;
    try {
      const products = await ProductsService.fetchProducts(
        {
          pattern,
          customerId,
          withSuppliers,
          productsIds
        },
        {
          only: ["id", "name"]
        }
      );
      commit("updateProductsDropdown", products);
    } catch (error) {
      NotificationService.error(error.message);
      throw error;
    }
  },
  updateTemporaryProductInDropdown: ({ commit }, product) => {
    commit("updateTemporaryProductInDropdown", product);
    commit("updateProductsDropdown", []);
  }
};
export default {
  state,
  getters,
  mutations,
  actions
};
