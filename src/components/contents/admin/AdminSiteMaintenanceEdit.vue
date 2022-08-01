<i18n>
{
  "en": {
    "back" : "back",
    "editTitle": "Edit maintenance",
    "createTitle": "Create maintenance",
    "name": "Name",
    "maintenanceDetails": "Maintenance details",
    "requiredError": "This field is required",
    "startDate": "Start date",
    "endDate": "End date",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "percentageOff": "Percentage off",
    "requiredNumberError": "Please provide a valid number",
    "updateSuccess": "Maintenance updated successfully",
    "createSuccess": "Maintenance created successfully",
    "deleteSuccess": "Maintenance deleted successfully",
    "deleteDescription": "This action is permanent",
    "deleteQuestion": "This will permanently delete this maintenance. Continue?",
    "notFound": "Maintenance not found"
  },
  "fr": {
    "back" : "retour",
    "editTitle": "Modifier maintenance",
    "createTitle": "Créer maintenance",
    "name": "Nom",
    "maintenanceDetails": "Details de la maintenance",
    "requiredError": "Ce champ est requis",
    "startDate": "Date de début",
    "endDate": "Date de fin",
    "save": "Valider",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "percentageOff": "Pourcentage de réduction",
    "requiredNumberError": "Merci de renseigner un nombre valide",
    "updateSuccess": "Maintenance mise à jour avec succès",
    "createSuccess": "Maintenance créée avec succès",
    "deleteSuccess": "Maintenance supprimée avec succès",
    "deleteDescription": "Cette action est définitive",
    "deleteQuestion": "Ceci va définitivement supprimer la maintenance. Continuer ?",
    "notFound": "Maintenance introuvable"
  }
}
</i18n>

<template>
  <div class="bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div
        style="width: 500px"
        class="relative bg-white px-12 py-10 rounded-lg shadow-2xl"
      >
        <router-link
          :to="{ name: 'maintenances' }"
          style="
            text-decoration: none;
            position: absolute;
            top: 25px;
            right: 25px;
          "
          class="flex items-center"
        >
          <BaseSVG name="arrow-left-s-line" class="text-gray-400 mx-auto" />
          <p class="mb-0 ml-2 text-gray-500">
            {{ $t("back") }}
          </p>
        </router-link>
        <div v-if="loading" class="flex justify-center items-center">
          <base-dot-loader />
        </div>
        <div v-else>
          <p class="text-gray-800 font-bold text-xl mb-12">
            {{ $t(pageTitle) }}
          </p>
          <p class="text-xl font-bold mb-4">
            {{ $t("maintenanceDetails") }}
          </p>
          <!-- form -->
          <a-form :form="form" @submit.prevent="handleSubmit">
            <p class="m-0 text-gray-600">Description</p>
            <a-form-item>
              <a-input
                v-decorator="[
                  'description',
                  {
                    rules: [{ required: true, message: $t('requiredError') }],
                    initialValue: maintenance.description
                  }
                ]"
                :disabled="!getMe.canAccess(['site:write'])"
              />
            </a-form-item>
            <div class="flex justify-between">
              <a-form-item>
                <p class="m-0 text-gray-600">
                  {{ $t("startDate") }}
                </p>
                <a-date-picker
                  v-decorator="[
                    'start_date',
                    {
                      rules: [{ required: true, message: $t('requiredError') }],
                      initialValue: makeDate(maintenance.startDate)
                    }
                  ]"
                  :disabled="!getMe.canAccess(['site:write'])"
                  class="mr-1"
                  :disabled-date="disabledStartDate"
                  @change="handleStartDateChange"
                />
              </a-form-item>
              <a-form-item>
                <p class="m-0 text-gray-600">
                  {{ $t("endDate") }}
                </p>
                <a-date-picker
                  v-decorator="[
                    'end_date',
                    {
                      rules: [{ required: true, message: $t('requiredError') }],
                      initialValue: makeDate(maintenance.endDate)
                    }
                  ]"
                  :disabled="!getMe.canAccess(['site:write'])"
                  :disabled-date="disabledEndDate"
                  @change="handleEndDateChange"
                />
              </a-form-item>
            </div>
            <a-form-item class="mt-12">
              <div
                v-if="getMe.canAccess(['site:write'])"
                class="flex justify-between"
              >
                <div class="flex space-x-2">
                  <BaseButton :loading="saving" @click="handleSubmit">
                    {{ $t("save") }}
                  </BaseButton>
                  <BaseButton
                    type="secondary"
                    @click="$router.push({ name: 'maintenances' })"
                  >
                    {{ $t("cancel") }}
                  </BaseButton>
                </div>
                <a-popconfirm
                  v-if="
                    getMe.canAccess(['site:write']) && maintenanceId !== 'new'
                  "
                  @confirm="confirmDelete"
                >
                  <template #title>
                    <p class="m-0">
                      {{ $t("deleteDescription") }}
                    </p>
                    <p class="m-0">
                      {{ $t("deleteQuestion") }}
                    </p>
                  </template>
                  <BaseButton type="danger">
                    {{ $t("delete") }}
                  </BaseButton>
                </a-popconfirm>
              </div>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import { promotionsMixins } from "./adminMixins";
import NotificationService from "@/services/notification.service";
import SiteMaintenanceService from "@/services/siteMaintenance.service";
import { Form, Input, DatePicker, Popconfirm } from "ant-design-vue";
import BaseDotLoader from "@/components/contents/common/BaseDotLoader.vue";
import debounceMixin from "@/helper/debounceMixin";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminSiteMaintenanceEdit",
  components: {
    BaseSVG,
    BaseButton,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-date-picker": DatePicker,
    "a-popconfirm": Popconfirm,
    "base-dot-loader": BaseDotLoader
  },
  mixins: [promotionsMixins, debounceMixin],
  props: {
    maintenanceId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: Form.createForm(this),
      saving: false,
      maintenance: {},
      loading: false
    };
  },
  computed: {
    ...mapGetters("common", ["getMe"]),
    pageTitle() {
      return this.maintenanceId === "new" ? "createTitle" : "editTitle";
    },
    successMessage() {
      return this.maintenanceId === "new" ? "createSuccess" : "updateSuccess";
    }
  },
  async created() {
    if (this.maintenanceId !== "new")
      try {
        this.loading = true;
        this.maintenance =
          await SiteMaintenanceService.fetchSiteMaintenanceById(
            this.maintenanceId
          );
        this.loading = false;
      } catch (e) {
        this.$router.push({ name: "maintenances" });
        NotificationService.error(this.$t("notFound"));
      }
  },
  methods: {
    makeDate(isoDate) {
      if (!isoDate) return null;
      return dayjs(isoDate);
    },
    handleSubmit() {
      const oldMaintenance = this.maintenance;
      this.form.validateFieldsAndScroll(async (err, updatedMaintenanceData) => {
        if (!err) {
          this.saving = true;
          try {
            if (this.maintenanceId === "new") {
              await SiteMaintenanceService.createSiteMaintenance(
                updatedMaintenanceData
              );
            } else
              await SiteMaintenanceService.updateSiteMaintenance(
                oldMaintenance,
                updatedMaintenanceData
              );
            this.saving = false;
            this.$router.push({ name: "maintenances" });
            NotificationService.success(this.$t(this.successMessage));
          } catch (error) {
            this.saving = false;
            NotificationService.error(error.message);
            throw error;
          }
        }
      });
    },
    async confirmDelete() {
      await SiteMaintenanceService.deleteSiteMaintenance(this.maintenance);
      NotificationService.success(this.$t("deleteSuccess"));
      this.$router.push({ name: "maintenances" });
    }
  }
};
</script>
