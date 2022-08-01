const state = {
  selectedTags: {},
  hasSelectedTagError: false,
  tagsInDropdown: []
};

const getters = {
  getSelectedTags: jest.fn(),
  getHasSelectedTagError: jest.fn(),
  getTagsInDropdown: jest.fn().mockReturnValue(state.tagsInDropdown),
  getTagsInDropdownById: () =>
    jest.fn(id => {
      let obj = {};
      state.tagsInDropdown.forEach(tag => {
        obj[tag.id] = tag;
      });
      return obj[id];
    })
};

const mutations = {
  updateSelectedTags: jest.fn(),
  updateHasSelectedTagError: jest.fn(),
  updateTagsDropdown: jest.fn()
};

const actions = {
  updateSelectedTags: jest.fn(),
  updateHasSelectedTagError: jest.fn(),
  fetchTags: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
