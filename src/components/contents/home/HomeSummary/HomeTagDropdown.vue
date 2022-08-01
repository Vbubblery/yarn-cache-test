<i18n>
{
  "en": {
    "placeholder": "Filter the results using a tag"
  },
  "fr": {
    "placeholder": "Filtrer les résultats par tag"
  }
}
</i18n>

<template>
  <a-form>
    <div v-if="loading" class="flex justify-center">
      <base-dot-loader />
    </div>
    <a-form-item v-else>
      <a-select
        key="tag"
        v-model="selectedTagId"
        mode="default"
        show-search
        class="w-full"
        :get-popup-container="getPopupContainer"
        :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
        :placeholder="$t('placeholder')"
        :filter-option="false"
        :not-found-content="null"
        :allow-clear="true"
        :options="tagsInDropdown"
        data-testid="selection_by_tag_dashboard_page"
        @search="handleTagSearch"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Select, Form } from "ant-design-vue";
import debounceMixin from "@/helper/debounceMixin";

export default {
  name: "HomeTagDropdown",
  components: {
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-select": Select,
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue")
  },
  mixins: [debounceMixin],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite"]),
    ...mapGetters("dashboard", ["getSelectedTagId", "getTagsInDropdown"]),
    tagsInDropdown() {
      return (this.getTagsInDropdown || []).map(tag => ({
        label: tag.name,
        value: tag.id,
        key: tag.name
      }));
    },
    selectedTagId: {
      get() {
        return this.getSelectedTagId;
      },
      async set(tagId) {
        if (!tagId) await this.fetchTags({ pattern: "" });
        this.updateSelectedTagId(tagId);
      }
    }
  },
  watch: {
    async getCurrentSite() {
      this.loading = true;
      await this.fetchTags({ pattern: "" });
      this.loading = false;
    }
  },
  async created() {
    this.loading = true;
    if (!this.getSelectedTagId) await this.fetchTags({ pattern: "" });
    this.loading = false;
  },
  methods: {
    ...mapActions("dashboard", ["fetchTags", "updateSelectedTagId"]),
    handleTagSearch(value) {
      value = value.trim();
      this.debounce(() => {
        this.fetchTags({ pattern: value });
      }, 300);
    },
    getPopupContainer(trigger) {
      return trigger.parentElement.parentElement;
    }
  }
};
</script>
