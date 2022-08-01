import dayjs from "@/dayjs";

const state = {
  selectedProducts: {},
  selectedTags: [],
  hasSelectedProductError: false,
  hasSelectedSourcesError: false,
  selectedPeriodType: "week",
  selectedStartDate: dayjs().subtract(1, "weeks"),
  selectedEndDate: dayjs().add(12, "weeks"),
  selectedSources: {
    orders: true,
    stock: true,
    minimum: false,
    maximum: false
  },
  selectedMultipleMethod: "name"
};

const getters = {
  getSelectedProducts: jest.fn().mockReturnValue(state.selectedProducts),
  getSelectedTags: jest.fn().mockReturnValue(state.selectedTags),
  getHasSelectedProductError: jest
    .fn()
    .mockReturnValue(state.hasSelectedProductError),
  getHasSelectedSourcesError: jest
    .fn()
    .mockReturnValue(state.hasSelectedSourcesError),
  getSelectedPeriodType: jest.fn().mockReturnValue(state.selectedPeriodType),
  getSelectedStartDate: jest.fn().mockReturnValue(state.selectedStartDate),
  getSelectedEndDate: jest.fn().mockReturnValue(state.selectedEndDate),
  getSelectedSources: jest.fn().mockReturnValue(state.selectedSources),
  getSelectedMultipleMethod: jest
    .fn()
    .mockReturnValue(state.selectedMultipleMethod)
};

const mutations = {
  updateSelectedProducts: jest.fn(),
  updateHasSelectedProductError: jest.fn(),
  updateHasSelectedSourcesError: jest.fn(),
  updateSelectedPeriodType: jest.fn(),
  updateSelectedStartDate: jest.fn(),
  updateSelectedEndDate: jest.fn(),
  updateSelectedSources: jest.fn(),
  updateSelectedMultipleMethod: jest.fn(),
  updateSelectedTags: jest.fn()
};

const actions = {
  updateSelectedProducts: jest.fn(),
  updateHasSelectedProductError: jest.fn(),
  updateHasSelectedSourcesError: jest.fn(),
  updateSelectedPeriodType: jest.fn(),
  updateSelectedStartDate: jest.fn(),
  updateSelectedEndDate: jest.fn(),
  updateSelectedMultipleMethod: jest.fn(),
  updateSelectedTags: jest.fn(),
  updateSelectedParameters: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
