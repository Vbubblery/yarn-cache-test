import { Data } from "@/objects/data";

const state = {
  data: [
    Data.create({
      productId: "id1",
      name: "name1",
      date: "01/01/2001",
      quantity: 123,
      source: "stock"
    })
  ],
  isLoading: false
};

const getters = {
  getHasDataToShow: jest.fn().mockReturnValue(true),
  getIsLoading: jest.fn().mockReturnValue(false)
};

const mutations = {
  resetSources: jest.fn(),
  updateIsLoading: jest.fn(),
  updateChartData: jest.fn(),
  resetState: jest.fn()
};

const actions = {
  resetState: jest.fn(),
  updateDataPage: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
