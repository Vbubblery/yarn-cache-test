<i18n>
{
  "en": {
    "back" : "all sites",
    "title": "Edit the site",
    "name": "Name",
    "address": "Address",
    "currency": "Currency (EUR, USD, CAD, ...)",
    "save": "Save",
    "cancel": "Cancel",
    "errorName": "Please add a site name",
    "errorAddress": "Please add a site address",
    "demandDistribution": "Demand distribution throughout the week",
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday",
    "addMaintenance": "Add a new maintenance time",
    "showFutureDashboard": "Show future values in inventory dashboard",
    "inventoryDashboardTitle": "Inventory Dashboard properties",
    "stockCompTitle": "Stock computation properties",
    "shelfLife": "Products' shelf life"
  },
  "fr": {
    "back" : "retour",
    "title": "Editer le site",
    "name": "Nom",
    "address": "Adresse",
    "currency": "Devise (EUR, USD, CAD, ...)",
    "save": "Valider",
    "cancel": "Annuler",
    "errorName": "Ajoutez un nom",
    "errorAddress": "Ajoutez une adresse",
    "demandDistribution": "Distribution de la demande à la semaine",
    "monday": "Lundi",
    "tuesday": "Mardi",
    "wednesday": "Mercredi",
    "thursday": "Jeudi",
    "friday": "Vendredi",
    "saturday": "Samedi",
    "sunday": "Dimanche",
    "addMaintenance": "Créer une nouvelle période de maintenance",
    "showFutureDashboard": "Afficher les valeurs futures dans le dashboard d'inventaire",
    "inventoryDashboardTitle": "Propriétés du dashboard d'inventaire",
    "stockCompTitle": "Propriétés de la computation de stock",
    "shelfLife": "Durée de vie des produits"
  }
}
</i18n>

<template>
  <div class="bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div class="relative bg-white px-12 py-10 rounded-lg shadow-2xl">
        <router-link
          :to="{ name: 'sites' }"
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
        <p class="text-gray-800 font-bold text-xl mb-12">
          {{ $t("title") }}
        </p>
        <a-form :form="form" @submit="handleSubmit">
          <p class="m-0 text-gray-600">
            {{ $t("name") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'name',
                {
                  initialValue: site.name,
                  rules: [{ required: true, message: $t(`errorName`) }]
                }
              ]"
              :disabled="!getMe.admin"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">
            {{ $t("address") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'address',
                {
                  initialValue: site.address,
                  rules: [{ message: $t(`errorAddress`) }]
                }
              ]"
              :disabled="!getMe.admin"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">
            {{ $t("currency") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'currency',
                {
                  initialValue: site.currency,
                  rules: [{ required: true }]
                }
              ]"
              :disabled="!getMe.superAdmin"
            />
          </a-form-item>
          <div class="mt-8">
            <p class="m-0 text-gray-600">
              {{ $t("demandDistribution") }}
            </p>
            <div
              class="mt-2 text-xs text-gray-500 font-bold"
              style="
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr;
                grid-gap: 5px;
                justify-items: center;
                align-items: center;
              "
            >
              <p class="m-0">
                {{ $t("monday") }}
              </p>
              <p class="m-0">
                {{ $t("tuesday") }}
              </p>
              <p class="m-0">
                {{ $t("wednesday") }}
              </p>
              <p class="m-0">
                {{ $t("thursday") }}
              </p>
              <p class="m-0">
                {{ $t("friday") }}
              </p>
              <p class="m-0">
                {{ $t("saturday") }}
              </p>
              <p class="m-0">
                {{ $t("sunday") }}
              </p>
              <p class="m-0 text-gray-400">Total</p>
            </div>
            <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr;
                grid-gap: 5px;
              "
            >
              <a-form-item
                v-for="(value, index) in demandDistributionWeek"
                :key="index"
              >
                <a-input
                  v-model.number="demandDistributionWeek[index]"
                  :disabled="true"
                  style="text-align: right"
                  @keypress="onlyNumber($event)"
                  @change="e => formatDemandDistributionWeek(e, index)"
                >
                  <template #suffix>
                    <span> % </span>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                has-feedback
                :validate-status="`${sumOfDist === 100 ? 'success' : 'error'}`"
              >
                <a-input :disabled="true" :value="`${sumOfDist}%`" />
              </a-form-item>
            </div>
            <!-- maintenances -->
            <div v-if="!site.isSupplierView">
              <p class="text-lg font-bold my-4">Maintenances</p>
              <router-link
                v-for="maintenance in maintenances"
                :key="maintenance.id"
                class="hover:no-underline"
                :to="{
                  name: 'editMaintenance',
                  params: { maintenanceId: maintenance.id }
                }"
              >
                <div
                  class="group flex justify-between items-center rounded-md py-2 px-3 hover:bg-gray-200 text-gray-600"
                >
                  <div>
                    <h6 class="font-bold">
                      {{ maintenance.description }}
                    </h6>
                    <div>
                      <span class="text-base">
                        {{ maintenance.startDate }}
                      </span>
                      <BaseSVG name="arrow-right-s-line" class="inline" />
                      <span class="text-base">
                        {{ maintenance.endDate }}
                      </span>
                    </div>
                  </div>
                  <BaseSVG
                    name="arrow-right-s-line"
                    class="hidden group-hover:block"
                  />
                </div>
              </router-link>
              <div class="mt-3 px-3">
                <router-link
                  v-if="getMe.canAccess(['site:write'])"
                  :to="{
                    name: 'editMaintenance',
                    params: { maintenanceId: 'new' }
                  }"
                >
                  <BaseButton type="secondary">
                    {{ $t("addMaintenance") }}
                  </BaseButton>
                </router-link>
              </div>
            </div>
            <!--  Dashboard config if superadmin -->
            <div v-if="getMe.superAdmin">
              <p class="text-lg font-bold my-4">
                {{ $t("inventoryDashboardTitle") }}
              </p>
              <a-form-item>
                <a-checkbox
                  v-decorator="[
                    'showFutureDashboard',
                    {
                      initialValue: site.showFutureDashboard
                    }
                  ]"
                  :disabled="!getMe.superAdmin"
                  :default-checked="site.showFutureDashboard"
                >
                  <span class="text-gray-600">{{
                    $t("showFutureDashboard")
                  }}</span>
                </a-checkbox>
              </a-form-item>
            </div>
            <!-- Stock computation config if superadmin -->
            <div v-if="getMe.superAdmin">
              <p class="text-lg font-bold my-4">
                {{ $t("stockCompTitle") }}
              </p>
              <a-form-item>
                <a-checkbox
                  v-decorator="[
                    'hasShelfLife',
                    {
                      initialValue: site.hasShelfLife
                    }
                  ]"
                  :disabled="!getMe.superAdmin"
                  :default-checked="site.hasShelfLife"
                >
                  <span class="text-gray-600">{{ $t("shelfLife") }}</span>
                </a-checkbox>
              </a-form-item>
            </div>
          </div>
          <a-form-item v-if="getMe.admin" class="mt-12">
            <div class="flex space-x-2">
              <BaseButton :loading="saving" @click="handleSubmit">
                {{ $t("save") }}
              </BaseButton>
              <BaseButton
                type="secondary"
                @click="$router.push({ name: 'sites' })"
              >
                {{ $t("cancel") }}
              </BaseButton>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import helper from "@/helper/helper";
import { Form, Input, Checkbox } from "ant-design-vue";
import { mapGetters, mapActions } from "vuex";
import SiteMaintenanceService from "@/services/siteMaintenance.service";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminSiteEdit",
  components: {
    BaseButton,
    BaseSVG,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-checkbox": Checkbox
  },
  props: {
    siteId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: Form.createForm(this),
      saving: false,
      demandDistributionWeek: [],
      maintenances: []
    };
  },
  computed: {
    ...mapGetters("common", ["getSite", "getMe"]),
    site() {
      return this.getSite(parseInt(this.siteId));
    },
    sumOfDist() {
      return this.demandDistributionWeek.reduce((a, b) => a + b, 0);
    }
  },
  async created() {
    this.demandDistributionWeek = this.site.demandDistributionWeek.map(
      value => value * 100
    );
    const maintenances = await SiteMaintenanceService.getSiteMaintenances();
    this.maintenances = Object.values(maintenances).map(maintenance => ({
      id: maintenance.id,
      description: maintenance.description,
      startDate: dayjs(maintenance.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(maintenance.endDate).format("YYYY-MM-DD")
    }));
  },
  methods: {
    ...mapActions("common", ["updateSite"]),
    onlyNumber($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (keyCode < "0".charCodeAt(0) || keyCode > "9".charCodeAt(0))
        $event.preventDefault();
    },
    formatDemandDistributionWeek(event, index) {
      if (this.demandDistributionWeek[index] === "")
        this.demandDistributionWeek[index] = 0;
      if (this.demandDistributionWeek[index] > 100)
        this.demandDistributionWeek[index] = 100;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err && this.sumOfDist === 100) {
          if (this.getMe.admin) {
            const site = helper.clone(this.site);
            site.name = values.name;
            site.address = values.address;
            site.currency = values.currency;
            site.demandDistributionWeek = this.demandDistributionWeek.map(
              value => value / 100
            );
            if (this.getMe.superAdmin) {
              site.showFutureDashboard = values.showFutureDashboard;
              site.hasShelfLife = values.hasShelfLife;
            }
            this.saving = true;
            await this.updateSite(site);
            this.saving = false;
            this.$router.push({ name: "sites" });
          }
        }
      });
    }
  }
};
</script>
