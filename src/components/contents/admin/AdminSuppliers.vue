<i18n>
{
  "en": {
    "title" : "All suppliers",
    "add" : "Add Supplier",
    "noSupplier": "No supplier found",
    "searchSupplier": "Search by name"
  },
  "fr": {
    "title" : "Tous les fournisseurs",
    "add" : "Créer Fournisseur",
    "noSupplier": "Pas de fournisseur trouvé",
    "searchSupplier": "Chercher par nom"
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
            class="w-1/2 h-8"
            :placeholder="$t('searchSupplier')"
          />
          <router-link to="/admin/supplier/new">
            <BaseButton
              v-if="getMe.canAccess(['tag:write'])"
              icon="add-line-alt"
            >
              {{ $t("add") }}
            </BaseButton>
          </router-link>
        </div>
        <base-paginated-loading-list
          :api-service="apiService"
          :endpoint="endpoint"
          :before-paginate="transform"
          :base-filters="suppliersFilter"
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
          <template #listItem="{ listItem: supplier }">
            <li>
              <router-link
                :to="`/admin/supplier/${supplier.id}`"
                style="text-decoration: none"
              >
                <div>
                  <hr class="my-4" />
                  <span class="text-gray-700">
                    {{ supplier.name }}
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
import { Input } from "ant-design-vue";
import debounceMixin from "@/helper/debounceMixin";
import { Company } from "@/objects/company";
import SupervisorService from "@/services/supervisor.service";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminSuppliers",
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
    ...mapGetters("common", ["getMe"]),
    apiService() {
      return SupervisorService;
    },
    endpoint() {
      return `/api/v1/companies/${this.getMe.company.id}/partners`;
    },
    suppliersFilter() {
      const filter = {
        suppliers: true,
        name: this.searchWordDebounced,
        only: ["id", "name"]
      };
      if (this.searchWordDebounced) filter.page = 1;
      return filter;
    }
  },
  watch: {
    searchWord: function () {
      this.debounce(() => {
        this.searchWordDebounced = this.searchWord;
      }, this.delay);
    }
  },
  methods: {
    transform(suppliers) {
      return suppliers.map(supplier => Company.create(supplier));
    }
  }
};
</script>
