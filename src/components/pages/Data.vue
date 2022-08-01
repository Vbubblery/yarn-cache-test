<i18n>
{
  "en": {
    "emptyTitle": "Select products",
    "emptySubtitle1": "and choose a period to",
    "emptySubtitle2": "begin data analysis"
  },
  "fr": {
    "emptyTitle": "Choisissez un produit",
    "emptySubtitle1": "et une période pour commencer ",
    "emptySubtitle2": "à analyser les données"
  }
}
</i18n>

<template>
  <div class="bg-gray-100 flex overflow-y-auto">
    <BaseButton
      type="secondary"
      icon="arrow-right-s-line"
      @click="toggleSidebar"
    />
    <data-sidebar
      v-show="showSidebar"
      id="sidebar"
      @toggle-sidebar="toggleSidebar"
    />
    <div v-if="getIsLoading" class="w-full flex justify-center items-center">
      <base-dot-loader />
    </div>
    <div
      v-else
      :class="`mx-auto mt-4 min-h-screen ${showSidebar ? 'w-full' : 'w-4/5'}`"
    >
      <div
        v-if="getHasDataToShow"
        :style="` ${
          showSidebar ? 'margin-left:450px' : 'margin: 0 auto'
        }; max-width: 1400px`"
      >
        <div class="p-16 bg-white shadow-lg rounded-lg mb-4">
          <data-chart />
        </div>
      </div>
      <div
        v-else
        class="h-full flex items-center"
        :style="`${
          showSidebar ? 'margin-left:500px' : 'justify-content: center'
        };`"
      >
        <base-empty-state
          :title="$t('emptyTitle')"
          :subtitle1="$t('emptySubtitle1')"
          :subtitle2="$t('emptySubtitle2')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DataChart from "@/components/contents/data/DataChart.vue";
import DataSidebar from "@/components/contents/data/DataSidebar.vue";
import BaseDotLoader from "@/components/contents/common/BaseDotLoader.vue";
import BaseEmptyState from "@/components/contents/common/BaseEmptyState.vue";
import { mapGetters } from "vuex";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "Data",
  components: {
    BaseButton,
    DataChart,
    DataSidebar,
    BaseDotLoader,
    BaseEmptyState
  },
  data() {
    return {
      showSidebar: true
    };
  },
  computed: {
    ...mapGetters("data", ["getIsLoading", "getHasDataToShow"])
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    closeSidebar() {
      this.showSidebar = false;
    }
  }
};
</script>
