import Vue from "vue";
import TagsService from "@/services/tags.service";
import NotificationService from "@/services/notification.service";

const state = {
  selectedTags: {},
  hasSelectedTagError: false,
  tagsInDropdown: []
};

const getters = {
  getSelectedTags: state => {
    return state.selectedTags;
  },
  getHasSelectedTagError: state => {
    return state.hasSelectedTagError;
  },
  getTagsInDropdown: state => {
    return state.tagsInDropdown;
  },
  getTagsInDropdownById: state => id => {
    let obj = {};
    state.tagsInDropdown.forEach(tag => {
      obj[tag.id] = tag;
    });
    return obj[id];
  }
};

const mutations = {
  updateSelectedTags: (state, selectedTags) => {
    Vue.set(state, "selectedTags", selectedTags);
  },
  updateHasSelectedTagError: (state, hasTagError) => {
    Vue.set(state, "hasSelectedTagError", hasTagError);
  },
  updateTagsDropdown: (state, tags) => {
    Vue.set(state, "tagsInDropdown", tags);
  }
};

const actions = {
  updateSelectedTags: ({ commit }, payload) => {
    commit("updateHasSelectedTagError", false);
    commit("updateSelectedTags", payload);
  },
  updateHasSelectedTagError: ({ commit }, payload) => {
    commit("updateHasSelectedTagError", payload);
  },
  fetchTags: async ({ commit }, payload) => {
    const { pattern, isAllCompanyTags, tagsIds, perPage, currentPage } =
      payload;
    try {
      const tags = await TagsService.fetchTags({
        pattern,
        isAllCompanyTags,
        tagsIds,
        perPage,
        currentPage
      });
      commit("updateTagsDropdown", tags);
    } catch (error) {
      NotificationService.error(error.message);
      throw error;
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
