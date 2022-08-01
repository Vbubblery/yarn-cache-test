<i18n>
{
  "en": {
    "exportTitle": "Download data",
    "settings" : "Settings",
    "company" : "Company",
    "sites" : "Sites",
    "users" : "Users",
    "suppliers" : "Suppliers",
    "customers" : "Customers",
    "products" : "Products",
    "tags": "Tags",
    "initTitle": "Reinitialize demo data"
  },
  "fr": {
    "exportTitle":"Télécharger les données",
    "settings" : "Configurations",
    "company" : "Entreprise",
    "sites" : "Sites",
    "users" : "Utilisateurs",
    "suppliers" : "Fournisseurs",
    "customers" : "Clients",
    "products" : "Produits",
    "tags": "Tags",
    "initTitle": "Reinitialisation des données de démo"
  }
}
</i18n>

<template>
  <div class="flex-1 flex overflow-hidden">
    <admin-export-modal
      :modal-visible="exportModalVisible"
      @show-modal="showExportModal"
    />
    <admin-init-modal
      :modal-visible="initModalVisible"
      @show-modal="showInitModal"
    />
    <aside
      style="position: fixed; top: 88px; bottom: 0px; width: 256px"
      class="bg-gray-700 overflow-auto"
    >
      <p class="text-white text-xl font-bold px-8 pt-4 pb-2">
        {{ $t("settings") }}
      </p>
      <router-link
        v-if="getMe.canAccess(['company:read'])"
        :to="{ name: 'company' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
        >
          <div class="flex items-center w-8">
            <BaseSVG
              name="building-fill"
              class="text-gray-600 mx-auto text-lg"
            />
          </div>
          <div class="flex items-center">
            <a style="text-decoration: none" class="m-0">
              {{ $t("company") }}
            </a>
          </div>
        </div>
      </router-link>
      <router-link
        v-if="getMe.canAccess(['site:read'])"
        :to="{ name: 'sites' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
          onclick="this.classname='tabActive'"
        >
          <div class="flex items-center w-8">
            <BaseSVG
              name="map-pin-2-fill"
              class="text-gray-600 mx-auto text-lg"
            />
          </div>
          <div class="flex items-center">
            <a class="m-0">
              {{ $t("sites") }}
            </a>
          </div>
        </div>
      </router-link>
      <router-link
        v-if="getMe.canAccess(['user:read'])"
        :to="{ name: 'users' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
        >
          <div class="flex items-center w-8">
            <BaseSVG name="group-fill" class="text-gray-600 mx-auto text-lg" />
          </div>
          <div class="flex items-center">
            <a class="m-0">
              {{ $t("users") }}
            </a>
          </div>
        </div>
      </router-link>
      <router-link
        v-if="
          !getCurrentSite.isSupplierView &&
          getMe.canAccess(['partnersite:read'])
        "
        :to="{ name: 'suppliers' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
        >
          <div class="flex items-center w-8">
            <BaseSVG name="truck-fill" class="text-gray-600 mx-auto text-lg" />
          </div>
          <div class="flex items-center">
            <a class="m-0">
              {{ $t("suppliers") }}
            </a>
          </div>
        </div>
      </router-link>
      <router-link
        v-if="
          getCurrentSite.isSupplierView & getMe.canAccess(['partnersite:read'])
        "
        :to="{ name: 'customers' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
        >
          <div class="flex items-center w-8">
            <BaseSVG name="user-3-line" class="text-gray-600 mx-auto" />
          </div>
          <div class="flex items-center">
            <a class="m-0">
              {{ $t("customers") }}
            </a>
          </div>
        </div>
      </router-link>
      <router-link
        v-if="getMe.canAccess(['productsite:read'])"
        :to="{ name: 'products' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
        >
          <div class="flex items-center w-8">
            <BaseSVG
              name="store-2-fill"
              class="text-gray-600 mx-auto text-lg"
            />
          </div>
          <div class="flex items-center">
            <a class="m-0">
              {{ $t("products") }}
            </a>
          </div>
        </div>
      </router-link>
      <router-link
        v-if="
          !getCurrentSite.isSupplierView && getMe.canAccess(['promotion:read'])
        "
        :to="{ name: 'promotions' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
        >
          <div class="flex items-center w-8">
            <BaseSVG name="star-fill" class="text-gray-600 mx-auto text-lg" />
          </div>
          <div class="flex items-center">
            <a class="m-0"> Promotions </a>
          </div>
        </div>
      </router-link>
      <router-link
        v-if="!getCurrentSite.isSupplierView && getMe.canAccess(['site:read'])"
        :to="{ name: 'maintenances' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
        >
          <div class="flex items-center w-8">
            <BaseSVG name="tools-fill" class="text-gray-600 mx-auto text-lg" />
          </div>
          <div class="flex items-center">
            <a class="m-0"> Maintenances </a>
          </div>
        </div>
      </router-link>
      <router-link
        v-if="!getCurrentSite.isSupplierView && getMe.canAccess(['tag:read'])"
        :to="{ name: 'tags' }"
        active-class
      >
        <div
          style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
          class="text-white text-sm font-bold px-8 py-4 my-3"
        >
          <div class="flex items-center w-8">
            <BaseSVG
              name="price-tag-3-fill"
              class="text-gray-600 mx-auto text-lg"
            />
          </div>
          <div class="flex items-center">
            <a class="m-0">
              {{ $t("tags") }}
            </a>
          </div>
        </div>
      </router-link>
      <div
        v-if="
          getMe.canAccess(['order:read']) ||
          getMe.canAccess(['demand:read']) ||
          getMe.canAccess(['supply:read'])
        "
        id="exportButton"
        style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
        class="text-white text-sm font-bold px-8 py-4 my-3"
        @click="showExportModal"
      >
        <div class="flex items-center w-8">
          <BaseSVG
            name="download-cloud-fill"
            class="text-gray-600 mx-auto text-lg"
          />
        </div>
        <div class="flex items-center">
          <a class="m-0">
            {{ $t("exportTitle") }}
          </a>
        </div>
      </div>
      <div
        v-if="getMe.demoUser"
        id="initButton"
        style="display: grid; grid-template-columns: 1fr 10fr; grid-gap: 15px"
        class="text-white text-sm font-bold px-8 py-4 my-3"
        @click="showInitModal"
      >
        <div class="flex items-center w-8">
          <BaseSVG name="refresh-line" class="text-gray-600 mx-auto" />
        </div>
        <div class="flex items-center">
          <a class="m-0">
            {{ $t("initTitle") }}
          </a>
        </div>
      </div>
    </aside>
    <router-view class="flex-1 overflow-y-auto" />
  </div>
</template>
<script>
import AdminExportModal from "@/components/contents/admin/AdminExportModal.vue";
import AdminInitModal from "@/components/contents/admin/AdminInitModal.vue";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import { mapGetters } from "vuex";

export default {
  name: "Admin",
  components: {
    BaseSVG,
    AdminInitModal,
    AdminExportModal
  },
  data() {
    return {
      collapsed: false,
      exportModalVisible: false,
      initModalVisible: false,
      sideBarHeight: window.innerHeight - 60
    };
  },
  computed: {
    ...mapGetters("common", ["getMe", "getCurrentSite"])
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.sideBarHeight = window.innerHeight - 60;
    });
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    showExportModal() {
      this.exportModalVisible = !this.exportModalVisible;
    },
    showInitModal() {
      this.initModalVisible = !this.initModalVisible;
    }
  }
};
</script>

<style scoped>
a:hover {
  @apply underline;
  @apply text-white;
}

aside div:hover {
  border-radius: 8px;
  background-color: #2d3748;
}
.router-link-exact-active {
  color: white;
  text-decoration: none;
}
.router-link-exact-active div {
  background-color: #2d3748;
  border-radius: 8px;
}
</style>
