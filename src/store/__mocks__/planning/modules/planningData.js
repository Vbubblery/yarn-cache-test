const state = {
  isLoading: false,
  tablesData: {},
  chartData: {},
  noData: false
};

const getters = {
  getIsUpdating: jest.fn().mockReturnValue(false),
  getIsLoading: jest.fn().mockReturnValue(false),
  getTableData: jest.fn().mockReturnValue([]),
  getChartData: jest.fn().mockReturnValue({ datasets: [] }),
  getNoData: jest.fn().mockReturnValue(state.noData),
  getPage: jest.fn(),
  getUpdatingCount: jest.fn(),
  getIsLoadingChart: jest.fn(),
  getIsLoadingTables: jest.fn()
};

const mutations = {
  resetState: jest.fn(),
  updateIsLoading: jest.fn(),
  updateTablesData: jest.fn(),
  updateChartData: jest.fn(),
  updateNoData: jest.fn(),
  updateChartDataFromTableData: jest.fn()
};

const actions = {
  resetState: jest.fn(),
  updatePlanningData: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
