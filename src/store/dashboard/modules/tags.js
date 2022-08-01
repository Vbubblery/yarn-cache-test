import Vue from "vue";
import TagsService from "@/services/tags.service";
import NotificationService from "@/services/notification.service";

const state = {
  selectedTagId: null,
  tagsInDropdown: []
};

const getters = {
  getSelectedTagId: state => {
    return state.selectedTagId;
  },
  getTagsInDropdown: state => {
    return state.tagsInDropdown;
  }
};

const mutations = {
  updateSelectedTagId: (state, selectedTagId) => {
    Vue.set(state, "selectedTagId", selectedTagId);
  },
  updateTagsDropdown: (state, tags) => {
    Vue.set(state, "tagsInDropdown", tags);
  }
};

const actions = {
  updateSelectedTagId: ({ commit }, selectedTagId) => {
    commit("updateSelectedTagId", selectedTagId);
  },
  fetchTags: async ({ commit }, { pattern }) => {
    try {
      const tags = await TagsService.fetchTags({
        pattern
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
