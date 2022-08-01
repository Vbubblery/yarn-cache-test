<i18n>
{
  "en": {
    "site": "Select a site",
    "products": "Select products",
    "productsError": "Please select at least one product",
    "source": "Select sources",
    "sourceError": "Please select at least one source",
    "submit": "Submit"
  },
  "fr": {
    "site": "Sélectionnez un site",
    "products": "Sélectionnez des produits",
    "productsError": "Sélectionnez au moins un produit",
    "source": "Sélectionnez des sources",
    "sourceError": "Sélectionnez au moins une source",
    "submit": "Valider"
  }
}
</i18n>

<template>
  <transition name="slide">
    <aside
      :style="`position: fixed; top: ${
        dataJobsIsRunning && dataJobsLastCompletionTime ? '121px' : '64px'
      }; bottom: 0px`"
      class="sidebar bg-white z-20 px-10 shadow-xl overflow-auto"
    >
      <div class="mt-8 flex justify-end relative left-4">
        <BaseButton
          type="secondary"
          icon="arrow-left-s-line"
          @click="toggleSidebar"
        />
      </div>
      <div class="mt-8 mx-auto">
        <section class="mb-5">
          <div class="flex items-center mb-2">
            <p class="text-gray-600 text-sm font-bold my-0">
              {{ $t("products") }}
            </p>
          </div>
          <BaseProductDropdown />
        </section>
        <BaseSidebarDatepicker target-module="data" />
        <section class="mb-5">
          <div class="flex items-center mb-2">
            <p class="text-gray-600 text-sm font-bold my-0">
              {{ $t("source") }}
            </p>
          </div>
          <DataSidebarSources />
          <div v-if="getHasSelectedSourcesError">
            <p class="text-red-500 font-bold text-sm mt-2">
              {{ $t("sourceError") }}
            </p>
          </div>
        </section>
        <section class="mb-16">
          <BaseButton data-testid="submit_data_page" @click="handleSubmit">
            {{ $t("submit") }}
          </BaseButton>
        </section>
      </div>
    </aside>
  </transition>
</template>

<script>
import helper from "@/helper/helper";
import { mapState, mapGetters, mapActions } from "vuex";
import BaseProductDropdown from "@/components/contents/common/BaseProductDropdown.vue";
import BaseSidebarDatepicker from "@/components/contents/common/BaseSidebarDatepicker.vue";
import DataSidebarSources from "@/components/contents/data/DataSidebarSources.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "DataSideBar",
  components: {
    BaseButton,
    BaseProductDropdown,
    BaseSidebarDatepicker,
    DataSidebarSources
  },
  emits: ["toggle-sidebar"],
  computed: {
    ...mapState("alerts", {
      dataJobsIsRunning: state => state.dataJobsAlerts?.dataJobsIsRunning,
      dataJobsLastCompletionTime: state =>
        state.dataJobsAlerts?.dataJobsLastCompletionTime
    }),
    ...mapGetters("common", ["getSelectedProducts"]),
    ...mapGetters("data", ["getSelectedSources", "getHasSelectedSourcesError"])
  },
  methods: {
    ...mapActions("data", ["updateDataPage", "updateHasSelectedSourcesError"]),
    ...mapActions("common", ["updateHasSelectedProductError"]),
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },
    handleSubmit() {
      let hasError = false;
      if (helper.isEmpty(this.getSelectedProducts)) {
        this.updateHasSelectedProductError(true);
        hasError = true;
      }
      if (helper.objHasOnlyFalsyValue(this.getSelectedSources)) {
        this.updateHasSelectedSourcesError(true);
        hasError = true;
      }
      if (hasError) return;

      this.updateDataPage();
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 400px;
}
@media (max-width: 400px) {
  .sidebar {
    width: 100vw;
  }
}
.slide-enter-active {
  animation: slide-in 0.3s ease-out forwards;
}
.slide-leave-active {
  animation: slide-out 0.3s ease-out forwards;
}
@keyframes slide-in {
  from {
    transform: translateX(-400px);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-400px);
  }
}
</style>
