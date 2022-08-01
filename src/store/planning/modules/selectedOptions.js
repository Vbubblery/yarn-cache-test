import Vue from "vue";
import dayjs from "@/dayjs";
import NotificationService from "@/services/notification.service";
import ProductsService from "@/services/products.service";
import {
  PERIOD_TYPES,
  DEFAULT_PLANNING_HORIZONS,
  currentDate,
  addToDate,
  minDate
} from "@/helper/date";

const state = {
  selectedSources: {
    orders: true,
    maximum: false,
    stock: true,
    minimum: false,
    stockCoverage: false,
    finalForecast: true
  },
  hasSelectedSourcesError: false,
  selectedPeriodType: PERIOD_TYPES.WEEK,
  selectedStartDate: currentDate(),
  selectedEndDate: addToDate(
    currentDate(),
    DEFAULT_PLANNING_HORIZONS.WEEKS,
    PERIOD_TYPES.WEEK
  )
};

const getters = {
  getSelectedSources: state => {
    return state.selectedSources;
  },
  getHasSelectedSourcesError: state => {
    return state.hasSelectedSourcesError;
  },
  getSelectedPeriodType: state => {
    return state.selectedPeriodType;
  },
  getSelectedStartDate: state => {
    return state.selectedStartDate;
  },
  getSelectedEndDate: state => {
    return state.selectedEndDate;
  }
};

const mutations = {
  updateSelectedSources: (state, selectedSources) => {
    Vue.set(state, "selectedSources", selectedSources);
  },
  updateHasSelectedSourcesError: (state, hasSourcesError) => {
    Vue.set(state, "hasSelectedSourcesError", hasSourcesError);
  },
  updateSelectedStartDate: (state, selectedStartDate) => {
    Vue.set(state, "selectedStartDate", selectedStartDate);
  },
  updateSelectedEndDate: (state, selectedEndDate) => {
    Vue.set(state, "selectedEndDate", selectedEndDate);
  },
  updateSelectedPeriodType: (state, selectedPeriodType) => {
    Vue.set(state, "selectedPeriodType", selectedPeriodType);
  }
};

const actions = {
  toggleSelectedSource: ({ commit, getters }, source) => {
    commit("updateHasSelectedSourcesError", false);
    const selectedSources = getters.getSelectedSources;
    selectedSources[source] = !selectedSources[source];
    commit("updateSelectedSources", selectedSources);
  },
  updateHasSelectedSourcesError: ({ commit }, payload) => {
    commit("updateHasSelectedSourcesError", payload);
  },
  updateSelectedPeriodType: ({ commit }, payload) => {
    commit("updateSelectedPeriodType", payload);
  },
  updateSelectedStartDate: ({ commit }, payload) => {
    commit("updateSelectedStartDate", payload);
  },
  updateSelectedEndDate: ({ commit }, payload) => {
    commit("updateSelectedEndDate", payload);
  },
  updateSelectedParameters: async (
    { commit, dispatch, rootGetters },
    { productId, strDate, timebucket, additionalMonths }
  ) => {
    const defaultHorizonInWeeks =
      rootGetters["common/getCurrentSite"].planningHorizonWeeks;
    const secondaryHorizonInMonths = additionalMonths
      ? additionalMonths
      : DEFAULT_PLANNING_HORIZONS.MONTHS;
    const orderDate = dayjs(strDate).toISOString();
    const defaultEndDate = addToDate(
      orderDate,
      defaultHorizonInWeeks,
      PERIOD_TYPES.WEEK
    );
    const secondaryEndDate = addToDate(
      orderDate,
      secondaryHorizonInMonths,
      PERIOD_TYPES.MONTH
    );
    const selectedStartDate = dayjs();
    const selectedEndDate = dayjs(minDate(defaultEndDate, secondaryEndDate));
    const selectedProducts = Object.create(null);
    selectedProducts[productId] = await ProductsService.getSiteProductById(
      productId,
      {
        only: ["id", "name"]
      }
    );
    const selectedPeriodType = timebucket ? timebucket : PERIOD_TYPES.WEEK;
    dispatch("common/updateSelectedProducts", selectedProducts, { root: true });
    commit("updateSelectedPeriodType", selectedPeriodType);
    commit("updateSelectedStartDate", selectedStartDate);
    commit("updateSelectedEndDate", selectedEndDate);
    dispatch("common/updateSelectedMultipleMethod", "name", {
      root: true
    });
    dispatch(
      "common/updateTemporaryProductInDropdown",
      {
        id: selectedProducts[productId].id,
        name: selectedProducts[productId].name
      },
      { root: true }
    );
    if (selectedEndDate.isSameOrBefore(selectedStartDate)) {
      NotificationService.error("Date is wrong.");
      return;
    }
    dispatch("updatePlanningData");
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
