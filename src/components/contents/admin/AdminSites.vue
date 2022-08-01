<i18n>
{
  "en": {
    "title" : "All sites",
    "noSite": "No site found"
  },
  "fr": {
    "title" : "Tous les sites",
    "noSite": "Pas de site trouvé"
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
        <div v-if="isLoading" class="flex justify-center items-center">
          <base-dot-loader />
        </div>
        <div v-else-if="noSite" class="my-5 text-center">
          {{ $t("noSite") }}
        </div>
        <ul v-else>
          <li v-for="item in items" :key="item.id">
            <router-link
              :to="`/admin/site/${item.id}`"
              style="text-decoration: none"
            >
              <div>
                <hr class="my-4" />
                <span class="text-gray-700">
                  {{ item.name }}
                </span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "AdminSites",
  components: {
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue")
  },
  computed: {
    ...mapGetters("common", ["getSitesByCompany", "getCompany"]),
    ...mapState("common", { isLoading: state => state.site.sitesLoading }),
    items() {
      return Object.values(this.getSitesByCompany(this.getCompany.id)).map(
        site => ({
          id: site.id,
          name: site.name,
          info: site.currency,
          editPath: { name: "siteid", params: { siteid: site.id } }
        })
      );
    },
    noSite() {
      return this.items.length === 0;
    }
  },
  watch: {
    getCompany() {
      this.getCompany();
    }
  }
};
</script>
