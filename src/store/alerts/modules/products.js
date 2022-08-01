import Vue from "vue";
import ProductsService from "@/services/products.service";
import NotificationService from "@/services/notification.service";
import helper from "@/helper/helper";
import { store } from "@/store/store";

const state = {
  selectedProducts: {},
  hasSelectedProductError: false,
  selectedMultipleMethod: "name",
  hasSelectedAggregated: false,
  productsInDropdown: [],
  temporaryProductInDropdown: null
};

const getters = {
  getSelectedProducts: state => {
    return state.selectedProducts;
  },
  getHasSelectedProductError: state => {
    return state.hasSelectedProductError;
  },
  getSelectedMultipleMethod: state => {
    return state.selectedMultipleMethod;
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
  updateProductsDropdown: (state, products) => {
    if (state.temporaryProductInDropdown)
      products.push(state.temporaryProductInDropdown);
    Vue.set(state, "productsInDropdown", helper.uniqBy(products));
  }
};

const actions = {
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
  fetchProducts: async ({ commit }, payload) => {
    const { pattern, customerId, withSuppliers } = payload;
    try {
      const products = await ProductsService.fetchProducts(
        {
          pattern,
          customerId,
          withSuppliers
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
  }
};
export default {
  state,
  getters,
  mutations,
  actions
};
