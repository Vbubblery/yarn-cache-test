import dayjs from "@/dayjs";

const state = {
  submittedSources: {
    orders: true,
    stock: true,
    minimum: false,
    maximum: false
  },
  submittedProducts: {
    51: { id: 51, name: "coolName" }
  },
  submittedPeriodType: null,
  submittedEndDate: dayjs().add(12, "weeks").endOf("day")
};

const mutations = {
  updateSubmittedOptions: jest.fn()
};

const actions = {
  updateSubmittedOptions: jest.fn()
};

export default {
  state,
  mutations,
  actions
};
