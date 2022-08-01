<i18n>
{
  "fr": {
    "orders":"Commande | Commandes",
    "planned": "Prévues",
    "validated": "Prévalidées",
    "viewOrders":"Voir toutes les commandes",
    "orderBefore":"À valider avant le",
    "alreadyOrdered":"À envoyer avant le",
    "byPriority":"par priorité",
    "ordersTips": "Liste des commandes où une action immédiate est nécessaire. "
  },
  "en": {
    "orders":"Order | Orders",
    "planned": "Purchase requisitions",
    "validated": "Confirmed purchase requisitions",
    "viewOrders":"View all orders",
    "orderBefore":"Validate before",
    "alreadyOrdered":"To send before",
    "byPriority":"by priority",
    "ordersTips": "List of orders where immediate action is needed."
  }
}
</i18n>

<template>
  <home-widget-card-template>
    <template #title>
      <div class="sm:w-auto flex items-center">
        <span>{{ $tc("orders", 2) }}</span>
        <div class="pl-2 inline-block">
          <BaseTooltip placement="bottom" :content="$t('ordersTips')">
            <BaseSVG name="information-fill" size="20" class="text-gray-400" />
          </BaseTooltip>
        </div>
      </div>
    </template>
    <template #subtitle>
      {{ $t("byPriority") }}
    </template>
    <template #options>
      <div class="flex justify-end items-center pt-1">
        <div class="m-auto flex flex-col md:flex-row">
          <div
            :class="`mr-4 text-sm font-bold text-fl-ingenious-ivory hover:text-fl-dark-blue cursor-pointer ${
              currentStatusFilter === 1
                ? 'text-fl-dark-blue'
                : 'hover:text-fl-dark-blue'
            }`"
            @click="plannedFilterHandler"
          >
            {{ $t("planned") }}
          </div>
          <div
            :class="`mr-4 text-sm font-bold text-fl-ingenious-ivory hover:text-fl-dark-blue cursor-pointer ${
              currentStatusFilter === 2
                ? 'text-fl-dark-blue'
                : 'hover:text-fl-dark-blue'
            }`"
            @click="validatedFilterHandler"
          >
            {{ $t("validated") }}
          </div>
        </div>
        <div class="mr-4 text-sm font-bold">
          <router-link to="/orders">
            <a
              class="text-fl-link background-transparent outline-none focus:outline-none"
            >
              {{ $t("viewOrders") }}
            </a>
          </router-link>
        </div>
        <BaseSVG
          name="arrow-left-s-line"
          class="mr-3 text-fl-ingenious-ivory cursor-pointer"
          @click="previousPageHandler"
        />
        <BaseSVG
          name="arrow-right-s-line"
          class="mr-3 text-fl-ingenious-ivory cursor-pointer"
          @click="nextPageHandler"
        />
      </div>
    </template>
    <template #body>
      <div class="h-full flex flex-col justify-between">
        <base-paginated-loading-list
          :api-service="apiService"
          :show-pagination-bar="false"
          :endpoint="endpoint"
          :before-paginate="transform"
          :base-filters="{
            page: currentPage,
            per_page: 6,
            filter: currentStatusFilter,
            sort: {
              order: 'asc',
              field: 'date'
            }
          }"
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
          <div />
          <template #listItem="{ listItem: order }">
            <div class="grid grid-cols-8 gap-4 text-sm rounded-lg p-1 mb-3">
              <div>
                <router-link to="/orders">
                  <a
                    class="w-10 truncate text-fl-link background-transparent outline-none focus:outline-none sm:w-auto"
                    @click="searchOrder(order.id)"
                  >
                    {{ `N°${order.id}` }}
                  </a>
                </router-link>
              </div>
              <div class="text-fl-ingenious-ivory text-center col-span-2">
                <div class="w-10 truncate sm:w-auto">
                  {{ order.supplierName }}
                </div>
              </div>
              <div class="text-right">
                {{
                  Math.round(
                    order.supplies.reduce(
                      (accu, curr) => accu + curr.quantity,
                      0
                    )
                  )
                }}
              </div>
              <div class="text-right">
                {{
                  new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(
                    order.supplies.reduce(
                      (accu, curr) => accu + curr.totalPrice,
                      0
                    )
                  )
                }}
              </div>
              <div class="font-bold text-right col-span-3">
                <div class="w-10 truncate sm:w-auto">
                  {{
                    currentStatusFilter == 1
                      ? $t("orderBefore")
                      : $t("alreadyOrdered")
                  }}
                  {{ timestampToString(order.latestOrderDate, "YYYY-MM-DD") }}
                </div>
              </div>
            </div>
          </template>
        </base-paginated-loading-list>
      </div>
    </template>
  </home-widget-card-template>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import HomeWidgetCardTemplate from "./HomeWidgetCardTemplate.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import SupervisorService from "@/services/supervisor.service";
import OrderService from "@/services/order.service";
import { Order } from "@/objects/order";
import { mapActions, mapGetters } from "vuex";
import helper from "@/helper/helper";
import BaseSVG from "@/components/base/components/BaseSVG.vue";

export default defineComponent({
  name: "HomeSummaryOrders",
  components: {
    BaseSVG,
    HomeWidgetCardTemplate,
    BaseTooltip,
    "base-paginated-loading-list": () =>
      import("@/components/contents/common/BasePaginatedLoadingList.vue"),
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue")
  },
  data() {
    return {
      currentPage: 1,
      currentStatusFilter: 1
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite"]),
    apiService() {
      return SupervisorService;
    },
    endpoint() {
      return `/api/v1/sites/${this.getCurrentSite.id}/orders`;
    }
  },
  methods: {
    ...mapActions("orders", ["updateKeywordSearch"]),
    searchOrder(orderId) {
      this.updateKeywordSearch(orderId.toString());
    },
    transform(rawOrders) {
      const orders = rawOrders.map(order => {
        const formattedOrder = Order.create(order);
        OrderService.updateOrderLatestDate(formattedOrder);
        return formattedOrder;
      });
      return orders;
    },
    plannedFilterHandler() {
      if (this.currentStatusFilter === 1) return;
      this.currentPage = 1;
      this.currentStatusFilter = 1;
    },
    validatedFilterHandler() {
      if (this.currentStatusFilter === 2) return;
      this.currentPage = 1;
      this.currentStatusFilter = 2;
    },
    nextPageHandler() {
      this.currentPage += 1;
    },
    previousPageHandler() {
      if (this.currentPage <= 1) this.currentPage = 1;
      else this.currentPage -= 1;
    },
    timestampToString(str, format) {
      return helper.timestampToString(str, format);
    }
  }
});
</script>
