import dayjs from "@/dayjs";

const state = {
  submittedSources: {
    stock: true,
    historicalDemand: true,
    orders: false
  },
  submittedProducts: {
    51: { id: 51, name: "coolName" }
  },
  submittedStartDate: dayjs().startOf("day"),
  submittedEndDate: dayjs().add(12, "weeks").endOf("day")
};

const getters = {
  getSubmittedEndDate: jest.fn().mockReturnValue(state.submittedEndDate)
};

const mutations = {
  updateSubmittedOptions: jest.fn()
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
