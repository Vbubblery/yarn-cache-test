import dayjs from "@/dayjs";

const state = {
  submittedCustomerSiteId: 4,
  submittedCustomerCompanyId: 4,
  submittedProducts: {
    51: { id: 51, name: "coolName" }
  },
  submittedStartDate: dayjs().subtract(6, "weeks"),
  submittedEndDate: dayjs(),
  submittedPeriodType: "week",
  isUpdating: false
};

const getters = {
  getSubmittedEndDate: jest.fn().mockReturnValue(state.submittedEndDate),
  getIsUpdating: jest.fn().mockReturnValue(state.isUpdating)
};

const mutations = {
  updateSubmittedOptions: jest.fn(),
  setIsUpdating: jest.fn()
};

const actions = {
  updateSubmittedOptions: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
