import dayjs from "@/dayjs";

const state = {
  selectedCustomerSiteId: null,
  selectedPeriodType: "week",
  selectedStartDate: dayjs().subtract(12, "months"),
  selectedEndDate: dayjs().add(6, "months")
};

const getters = {
  getSelectedCustomerSiteId: jest
    .fn()
    .mockReturnValue(state.selectedCustomerSiteId),
  getSelectedPeriodType: jest.fn().mockReturnValue(state.selectedPeriodType),
  getSelectedStartDate: jest.fn().mockReturnValue(state.selectedStartDate),
  getSelectedEndDate: jest.fn().mockReturnValue(state.selectedEndDate)
};

const mutations = {
  updateSelectedCustomerSiteId: jest.fn(),
  updateSelectedStartDate: jest.fn(),
  updateSelectedEndDate: jest.fn(),
  updateSelectedPeriodType: jest.fn()
};

const actions = {
  updateSelectedCustomerSiteId: jest.fn(),
  updateSelectedStartDate: jest.fn(),
  updateSelectedEndDate: jest.fn(),
  updateSelectedPeriodType: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
