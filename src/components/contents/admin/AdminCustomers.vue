<i18n>
{
  "en": {
    "title" : "All customers",
    "add" : "Add Customer",
    "noCustomer": "No customer found",
    "searchCustomer": "Search by name"
  },
  "fr": {
    "title" : "Tous les clients",
    "add" : "Créer Client",
    "noCustomer": "Aucun client trouvé",
    "searchCustomer": "Chercher par nom"
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
            :placeholder="$t('searchCustomer')"
          />
          <router-link to="/admin/customer/new">
            <BaseButton
              v-if="
                getMe.canAccess(['partnersite:write']) &&
                !getCurrentSite.isSupplierView
              "
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
          :base-filters="customersFilter"
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
          <template #listItem="{ listItem: customer }">
            <li>
              <router-link
                :to="`/admin/customer/${customer.id}`"
                style="text-decoration: none"
              >
                <div>
                  <hr class="my-4" />
                  <span class="text-gray-700">
                    {{ customer.name }}
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
  name: "AdminCustomers",
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
    ...mapGetters("common", ["getMe", "getCurrentSite"]),
    apiService() {
      return SupervisorService;
    },
    endpoint() {
      return `/api/v1/companies/${this.getMe.company.id}/partners`;
    },
    customersFilter() {
      const filter = {
        customers: true,
        name: this.searchWordDebounced
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
    transform(customers) {
      return customers.map(customer => Company.create(customer));
    }
  }
};
</script>
