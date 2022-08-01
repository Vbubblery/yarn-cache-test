<i18n>
{
  "en": {
    "title": "Reinitialize demo data",
    "desc": "Do you want reinitialize the demonstration dataset?",
    "success": "succeeded",
    "error": "Couldn't update, please try again later",
    "dataIntegration": "Data integration: ",
    "run": "Run init demo"
  },
  "fr": {
    "title": "Reinitialiser les données de démo",
    "desc":"Voulez-vous réinitialiser le dataset de démonstration?",
    "success": "Mise à jour réussi",
    "error": "Erreur lors de la mise à jour, veuillez réessayer",
    "dataIntegration": "Intégration de données: ",
    "run": "Lancer l'initialisation"
  }
}
</i18n>

<template>
  <a-modal
    :title="$t('title')"
    :visible="showModal"
    :ok-text="$t('run')"
    :confirm-loading="modalLoading"
    :mask-closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>{{ $t("desc") }}</p>
    <div v-if="computationLoading">
      <p>
        {{ $t("dataIntegration") }} ~1min
        <BaseSpinner v-if="loading" class="text-white mx-auto" />
        <b v-if="success" style="color: green">
          {{ $t("success") }}
        </b>
        <b v-if="error" style="color: red">
          {{ $t("error") }}
        </b>
      </p>
    </div>
  </a-modal>
</template>

<script>
import DataIntegrationService from "@/services/dataIntegration.service";
import { Modal } from "ant-design-vue";
import { mapGetters } from "vuex";
import BaseSpinner from "@/components/base/components/BaseSpinner.vue";

export default {
  name: "AdminInitModal",
  components: {
    BaseSpinner,
    "a-modal": Modal
  },
  props: {
    modalVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["show-modal"],
  data() {
    return {
      modalLoading: false,
      computationLoading: false,
      error: false,
      success: false,
      loading: false
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite", "getMe"]),
    showModal: {
      get() {
        return this.modalVisible;
      },
      set() {
        this.$emit("show-modal");
      }
    }
  },
  methods: {
    async handleOk() {
      this.modalLoading = true;
      this.computationLoading = true;
      this.loading = true;
      this.error = false;
      this.success = false;
      // Update Data integration
      try {
        await DataIntegrationService.initData(
          this.getMe.company.name.toLowerCase()
        );
        this.success = true;
      } catch (e) {
        this.error = true;
      }
      this.loading = false;
      this.modalLoading = false;
      this.showModal = false;
    },
    handleCancel() {
      this.showModal = false;
      this.computationLoading = false;
      this.error = false;
      this.success = false;
      this.loading = false;
    }
  }
};
</script>
