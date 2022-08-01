const state = {
  selectedTagId: null,
  tagsInDropdown: [
    { id: 0, name: "tagA" },
    { id: 1, name: "tagB" }
  ]
};

const getters = {
  getSelectedTagId: jest.fn().mockReturnValue(state.selectedTagId),
  getTagsInDropdown: jest.fn().mockReturnValue(state.tagsInDropdown)
};
const mutations = {
  updateSelectedTagId: jest.fn(),
  updateTagsDropdown: jest.fn()
};
const actions = {
  updateSelectedTagId: jest.fn(),
  fetchTags: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
