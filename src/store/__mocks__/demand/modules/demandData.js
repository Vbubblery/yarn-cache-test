import dayjs from "@/dayjs";

const state = {
  isLoadingChart: false,
  isLoadingTables: false,
  tablesData: [],
  noData: false,
  beginDate: dayjs()
};

const getters = {
  getIsLoadingChart: jest.fn().mockReturnValue(false),
  getIsLoadingTables: jest.fn().mockReturnValue(false),
  getNoData: jest.fn().mockReturnValue(state.noData),
  getBeginDate: jest.fn().mockReturnValue(state.beginDate),
  getPage: jest.fn()
};

const mutations = {
  resetState: jest.fn(),
  updateIsLoadingChart: jest.fn(),
  updateIsLoadingTables: jest.fn(),
  updateNoData: jest.fn(),
  updateChartDataFromTableData: jest.fn(),
  setForceReload: jest.fn(),
  setUpdatingCount: jest.fn(),
  resetChartData: jest.fn(),
  updateBeginDate: jest.fn()
};

const actions = {
  resetState: jest.fn(),
  fetchDemandData: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
