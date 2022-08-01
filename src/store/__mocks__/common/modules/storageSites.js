const state = {
  storageSitesById: {
    1: {
      name: "coolStorageName"
    },
    2: {
      name: "awesomeStorageName"
    }
  }
};

const getters = {
  getStorageSitesById: () =>
    jest.fn(id => {
      return state.storageSitesById[id];
    })
};

const mutations = {
  updateStorageSitesById: jest.fn()
};

const actions = {
  fetchStorageSites: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
