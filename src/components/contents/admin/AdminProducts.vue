<i18n>
{
  "en": {
    "title" : "All products",
    "add" : "Add Product",
    "noProducts": "No product found",
    "searchProduct": "Search by name"
  },
  "fr": {
    "title" : "Tous les produits",
    "add" : "Créer Produit",
    "noProducts": "Pas de produit trouvé",
    "searchProduct": "Chercher par nom"
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
            :placeholder="$t('searchProduct')"
          />
          <router-link
            v-if="
              !getCurrentSite.isSupplierView &&
              getMe.canAccess(['productsite:write'])
            "
            :to="`/admin/product/new`"
          >
            <BaseButton icon="add-line-alt">
              {{ $t("add") }}
            </BaseButton>
          </router-link>
        </div>
        <div>
          <base-paginated-loading-list
            :api-service="apiService"
            :endpoint="endpoint"
            :base-filters="productsFilter"
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
            <template #listItem="{ listItem: product }">
              <li>
                <router-link
                  :to="`/admin/product/${product.id}`"
                  style="text-decoration: none"
                  :disabled="getCurrentSite.isSupplierView"
                >
                  <hr class="my-4" />
                  <div style="display: grid; grid-template-columns: 4fr 2fr">
                    <span class="text-gray-700">
                      {{ product.name }}
                    </span>
                    <span
                      v-if="product.partners.length"
                      class="text-gray-500 text-sm"
                    >
                      {{ product.partners.join(", ") }}
                    </span>
                  </div>
                </router-link>
              </li>
            </template>
          </base-paginated-loading-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Input } from "ant-design-vue";
import debounceMixin from "@/helper/debounceMixin";
import SupervisorService from "@/services/supervisor.service";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminProducts",
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
    ...mapGetters("common", ["getCurrentSite", "getMe"]),
    apiService() {
      return SupervisorService;
    },
    endpoint() {
      return `/api/v1/sites/${this.getCurrentSite.id}/products`;
    },
    productsFilter() {
      const filter = {
        search: this.searchWordDebounced
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
  }
};
</script>
