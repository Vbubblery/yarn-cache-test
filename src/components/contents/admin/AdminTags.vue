<i18n>
{
  "en": {
    "title" : "All Tags",
    "add" : "Add Tag",
    "noTag": "No tag found",
    "searchTag": "Search by name",
    "isTagGrouper": "Used to group orders"
  },
  "fr": {
    "title" : "Tous les Tags",
    "add" : "Créer Tag",
    "noTag": "Pas de tag trouvé",
    "searchTag": "Chercher par nom",
    "isTagGrouper": "Utilisé pour regrouper les commandes"
  }
}
</i18n>

<template>
  <div class="bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div
        style="width: 500px"
        class="bg-white px-12 py-8 rounded-lg shadow-2xl"
      >
        <p class="text-gray-800 font-bold text-xl">
          {{ $t("title") }}
        </p>
        <div class="flex justify-between">
          <a-input
            v-model="searchWord"
            class="w-1/2 h-[38px]"
            :placeholder="$t('searchTag')"
          />
          <router-link to="/admin/tag/new">
            <BaseButton
              v-if="getMe.canAccess(['tag:write'])"
              icon="add-line-alt"
            >
              {{ $t("add") }}
            </BaseButton>
          </router-link>
        </div>
        <a-checkbox
          v-model="isTagGrouper"
          v-decorator="['isTagGrouper']"
          @click="toggleTagGrouper"
        >
          <span class="m-0 text-gray-600">
            {{ $t("isTagGrouper") }}
          </span>
        </a-checkbox>

        <base-paginated-loading-list
          :api-service="apiService"
          :endpoint="endpoint"
          :before-paginate="transform"
          :base-filters="tagsFilter"
        >
          <template #loading="{ loading }">
            <div v-if="loading" class="flex justify-center">
              <base-dot-loader />
            </div>
          </template>
          <template #error="{ error }">
            <div v-if="error" class="text-center">
              {{ error }}
            </div>
          </template>
          <template #listItem="{ listItem: tag }">
            <li>
              <router-link
                :to="`/admin/tag/${tag.id}`"
                style="text-decoration: none"
              >
                <hr class="my-4" />
                <div style="display: grid; grid-template-columns: 2fr 3fr">
                  <span class="text-gray-700">
                    {{ tag.name }}
                  </span>
                </div>
              </router-link>
            </li>
          </template>
        </base-paginated-loading-list>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Input, Checkbox } from "ant-design-vue";
import debounceMixin from "@/helper/debounceMixin";
import { Tag } from "@/objects/tag";
import SupervisorService from "@/services/supervisor.service";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminTags",
  components: {
    BaseButton,
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue"),
    "base-paginated-loading-list": () =>
      import("@/components/contents/common/BasePaginatedLoadingList.vue"),
    "a-input": Input,
    "a-checkbox": Checkbox
  },
  mixins: [debounceMixin],
  data() {
    return {
      searchWord: "",
      searchWordDebounced: "",
      delay: 300,
      isTagGrouper: false
    };
  },
  computed: {
    ...mapGetters("common", ["getMe"]),
    apiService() {
      return SupervisorService;
    },
    endpoint() {
      return `/api/v1/companies/${this.getMe.company.id}/tags?is_tag_grouper=${this.isTagGrouper}`;
    },
    tagsFilter() {
      const filter = {
        name: this.searchWordDebounced
      };
      if (this.searchWordDebounced) filter.page = 1;
      return filter;
    }
  },
  watch: {
    searchWord() {
      this.debounce(() => {
        this.searchWordDebounced = this.searchWord;
      }, this.delay);
    },
    getCurrentSite() {
      this.searchWord = "";
    }
  },
  methods: {
    transform(tags) {
      return tags.map(tag => Tag.create(tag));
    },
    toggleTagGrouper() {
      this.isTagGrouper = !this.isTagGrouper;
    }
  }
};
</script>
