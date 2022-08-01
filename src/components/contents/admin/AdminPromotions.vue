<i18n>
{
  "en": {
    "title" : "All promotions",
    "add" : "Add Promotion",
    "noPromotion": "No promotion found",
    "searchPromotion": "Search by name"
  },
  "fr": {
    "title" : "Toutes les promotions",
    "add" : "Créer Promotion",
    "noPromotion": "Pas de promotion trouvée",
    "searchPromotion": "Chercher par nom"
  }
}
</i18n>

<template>
  <div class="bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div
        style="width: 600px"
        class="bg-white px-12 py-8 rounded-lg shadow-2xl"
      >
        <p class="text-gray-800 font-bold text-xl">
          {{ $t("title") }}
        </p>
        <div class="flex justify-between">
          <a-input
            v-model="searchWord"
            class="w-1/2 h-8"
            :placeholder="$t('searchPromotion')"
          />
          <router-link to="/admin/promotion/new">
            <BaseButton
              v-if="getMe.permissions.includes('promotion:write')"
              icon="add-line-alt"
            >
              {{ $t("add") }}
            </BaseButton>
          </router-link>
        </div>
        <base-paginated-loading-list
          :api-service="apiService"
          :endpoint="endpoint"
          :base-filters="promotionsFilter"
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
          <template #listItem="{ listItem: promotion }">
            <li>
              <router-link
                :to="`/admin/promotion/${promotion.id}`"
                style="text-decoration: none"
              >
                <hr class="my-4" />
                <div style="display: grid; grid-template-columns: 2fr 3fr">
                  <span class="text-gray-700">
                    {{ promotion.name }}
                  </span>
                  <div class="text-gray-500 text-sm">
                    <div>{{ promotion.partner }}</div>
                    <div>
                      {{ formatDate(promotion.start_date) }} ->
                      {{ formatDate(promotion.end_date) }}
                    </div>
                  </div>
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
import dayjs from "dayjs";
import { Input } from "ant-design-vue";
import debounceMixin from "@/helper/debounceMixin";
import SupervisorService from "@/services/supervisor.service";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminPromotions",
  components: {
    BaseButton,
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue"),
    "base-paginated-loading-list": () =>
      import("@/components/contents/common/BasePaginatedLoadingList.vue"),
    "a-input": Input
  },
  mixins: [debounceMixin],
  data() {
    return {
      searchWord: "",
      searchWordDebounced: "",
      delay: 300
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite", "getCompany", "getMe"]),
    apiService() {
      return SupervisorService;
    },
    endpoint() {
      return `/api/v1/companies/${this.getCompany.id}/promotions`;
    },
    promotionsFilter() {
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
    formatDate(date) {
      return dayjs(date).format("DD/MM/YYYY");
    }
  }
};
</script>
