const getDefaultState = () => ({
  statusIdFilter: 1,
  sort: "timestamp,desc",
  keywordSearch: "supplier"
});

const state = getDefaultState();

const getters = {
  getStatusIdFilter: jest.fn(() => state.statusIdFilter),
  getSort: jest.fn(() => state.sort),
  getKeywordSearch: jest.fn(() => state.keywordSearch),
  getStatusIdFilterForRequest: jest.fn()
};

const mutations = {
  updateStatusIdFilter: jest.fn(),
  updateSort: jest.fn(),
  updateKeywordSearch: jest.fn(),
  resetState: jest.fn()
};

const actions = {
  updateStatusIdFilter: jest.fn(),
  updateSort: jest.fn(),
  updateKeywordSearch: jest.fn(),
  resetState: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
