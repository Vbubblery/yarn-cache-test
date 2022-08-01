<i18n>
{
  "en": {
    "back" : "all suppliers",
    "title": "Edit the supplier",
    "name": "Name",
    "email": "Contact email (optional)",
    "address": "address (optional)",
    "constraints": "Constraints (optional)",
    "fullTruckQte": "Full truck qte",
    "minOrderQte": "Min order qte",
    "unit": "unit",
    "unitPlaceholder": "Select unit",
    "orderFrequency": "Order frequency",
    "save": "Save",
    "cancel": "Cancel",
    "errorName": "Please add a supplier name",
    "externalId": "Ref",
    "days": "days",
    "maxSuppliesByOrder": "Max rows by order (export only)"
    },
  "fr": {
    "back" : "retour",
    "title": "Editer un fournisseur",
    "name": "Nom",
    "email": "Email du contact (optionnel)" ,
    "address": "Adresse postale (optionnel)",
    "constraints": "Contraintes (optionnel)",
    "fullTruckQte": "Quantité camion plein",
    "minOrderQte": "Quantité commande min",
    "unit": "Unité",
    "unitPlaceholder": "Sélectionnez l'unité",
    "orderFrequency": "Fréquence de commande", 
    "save": "Valider",
    "cancel": "Annuler",
    "errorName": "Veuillez ajouter le nom du fournisseur",
    "externalId": "Ref",
    "days": "jours",
    "maxSuppliesByOrder": "Nombre maximum de lignes par commande (export seulement)"
  }
}
</i18n>

<template>
  <div class="supplier-edit bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div
        style="width: 500px"
        class="relative bg-white px-12 py-10 rounded-lg shadow-2xl"
      >
        <router-link
          :to="{ name: 'suppliers' }"
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
        <div v-if="!supplier" class="flex justify-center items-center">
          <base-dot-loader />
        </div>
        <a-form v-else :form="formInfo" @submit="handleSubmitInfo">
          <p v-if="supplier.external_id" class="m-0 text-gray-600">
            {{ $t("externalId") }}
          </p>
          <a-form-item v-if="supplier.external_id">
            <a-input
              v-decorator="[
                'externalId',
                {
                  initialValue: supplier.external_id
                }
              ]"
              :disabled="true"
            />
          </a-form-item>

          <p class="m-0 text-gray-600">
            {{ $t("name") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'name',
                {
                  initialValue: supplier.name,
                  rules: [{ required: true, message: $t('errorName') }]
                }
              ]"
              :disabled="!getMe.canAccess(['partnersite:write'])"
              autocomplete="name"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">
            {{ $t("email") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'email',
                {
                  initialValue: supplier.contact_email
                }
              ]"
              :disabled="!getMe.canAccess(['partnersite:write'])"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">
            {{ $t("address") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'adress',
                {
                  initialValue: supplier.adress
                }
              ]"
              :disabled="!getMe.canAccess(['partnersite:write'])"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">
            {{ $t("maxSuppliesByOrder") }}
          </p>
          <a-form-item class="mb-2">
            <a-input
              v-decorator="[
                'maxSuppliesByOrder',
                {
                  initialValue: supplier.max_supplies_by_order
                }
              ]"
              :disabled="!getMe.canAccess(['partnersite:write'])"
              type="number"
              min="0"
            />
          </a-form-item>
          <a-collapse default-active-key="constraints" :bordered="false">
            <a-collapse-panel
              key="constraints"
              style="
                background: #f7f7f7;
                border-radius: 4px;
                margin-bottom: 24px;
                border: 0;
                overflow: hidden;
              "
            >
              <template #header>
                <span class="m-0 text-gray-600">
                  {{ $t("constraints") }}
                </span>
              </template>
              <div
                style="
                  display: grid;
                  grid-template-columns: 3fr 3fr;
                  grid-gap: 10px;
                "
              >
                <div>
                  <p class="mb-1 text-gray-600">
                    {{ $t("fullTruckQte") }}
                  </p>
                  <a-form-item class="supplier-edit__control mb-2">
                    <a-input
                      v-decorator="[
                        'fullTruckQte',
                        {
                          initialValue: supplier.full_truck_quantity
                        }
                      ]"
                      :disabled="!getMe.canAccess(['partnersite:write'])"
                      type="number"
                      min="0"
                    />
                  </a-form-item>
                </div>
                <div>
                  <p class="mb-1 text-gray-600">
                    {{ $t("unit") }}
                  </p>
                  <BaseDropdown
                    :menu-title="fullTruckUnit || $t('unitPlaceholder')"
                    class="border border-gray-300 rounded h-8"
                    style="min-width: auto !important"
                  >
                    <a-menu-item
                      v-for="unit in FULL_TRUCK_UNITS"
                      :key="unit.value"
                      :disabled="!getMe.canAccess(['partnersite:write'])"
                      @click="fullTruckUnit = unit.value"
                    >
                      {{ unit.label }}
                    </a-menu-item>
                  </BaseDropdown>
                </div>
                <div>
                  <p class="mb-1 text-gray-600">
                    {{ $t("minOrderQte") }}
                  </p>
                  <a-form-item class="supplier-edit__control mb-2">
                    <a-input
                      v-decorator="[
                        'minOrderQte',
                        {
                          initialValue: supplier.minimum_order_quantity
                        }
                      ]"
                      :disabled="!getMe.canAccess(['partnersite:write'])"
                      type="number"
                      min="0"
                    />
                  </a-form-item>
                </div>
                <div>
                  <p class="mb-1 text-gray-600">
                    {{ $t("unit") }}
                  </p>
                  <BaseDropdown
                    :menu-title="moqUnit || $t('unitPlaceholder')"
                    class="border border-gray-300 rounded h-8"
                    style="min-width: auto !important"
                  >
                    <a-menu-item
                      v-for="unit in MOQ_UNITS"
                      :key="unit.value"
                      :disabled="!getMe.canAccess(['partnersite:write'])"
                      @click="moqUnit = unit.value"
                    >
                      {{ unit.label }}
                    </a-menu-item>
                  </BaseDropdown>
                </div>
                <div>
                  <p class="m-0 text-gray-600">
                    {{ $t("orderFrequency") }}
                  </p>
                  <a-form-item class="mb-2">
                    <a-input
                      v-decorator="[
                        'orderFrequency',
                        {
                          initialValue: supplier.order_frequency
                        }
                      ]"
                      :disabled="!getMe.canAccess(['partnersite:write'])"
                      type="number"
                      min="0"
                    />
                  </a-form-item>
                </div>
                <div>
                  <p class="m-0 text-gray-600">
                    {{ $t("unit") }}
                  </p>
                  <a-form-item class="mb-2">
                    <a-input
                      v-decorator="[
                        'orderFrequencyUnit',
                        {
                          initialValue: $t('days')
                        }
                      ]"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
          <a-form-item>
            <div class="flex space-x-2">
              <BaseButton
                v-if="getMe.canAccess(['partnersite:write'])"
                :loading="savingInfo"
                @click="handleSubmitInfo"
              >
                {{ $t("save") }}
              </BaseButton>
              <BaseButton
                type="secondary"
                @click="$router.push({ name: 'suppliers' })"
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
import { mapGetters } from "vuex";
import { Form, Input, Collapse, Menu } from "ant-design-vue";
import NotificationService from "@/services/notification.service";
import PartnersService from "@/services/partners.service";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseDropdown from "@/components/base/components/BaseDropdown.vue";
import {
  FULL_TRUCK_UNITS,
  MOQ_UNITS
} from "@/components/contents/admin/constants/suppliers";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminSupplierEdit",
  components: {
    BaseSVG,
    BaseButton,
    BaseDropdown,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-menu-item": Menu.Item,
    "a-input": Input,
    "a-collapse": Collapse,
    "a-collapse-panel": Collapse.Panel,
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue")
  },
  props: {
    supplierId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formInfo: Form.createForm(this),
      savingInfo: false,
      supplier: null,
      fullTruckUnit: "",
      moqUnit: "",
      FULL_TRUCK_UNITS,
      MOQ_UNITS
    };
  },
  computed: {
    ...mapGetters("common", ["getMe"])
  },
  async created() {
    try {
      this.supplier = await PartnersService.get(this.supplierId, {
        exclude: ["product_supplier_link", "orders"]
      });
      this.fullTruckUnit = this.supplier.full_truck_unit;
      this.moqUnit = this.supplier.minimum_order_unit;
    } catch (e) {
      this.$router.push({ name: "suppliers" });
    }
  },
  methods: {
    handleSubmitInfo(e) {
      if (e) e.preventDefault();
      this.formInfo.validateFields(async (err, values) => {
        if (err) NotificationService.error(err);
        if (err || !this.getMe.permissions.includes("partnersite:write"))
          return;

        this.savingInfo = true;
        await PartnersService.updatePartnerSite(this.supplier.id, {
          name: values.name,
          contact_email: values.email,
          adress: values.adress,
          full_truck_quantity: parseInt(values.fullTruckQte),
          full_truck_unit: this.fullTruckUnit,
          minimum_order_quantity: parseInt(values.minOrderQte),
          minimum_order_unit: this.moqUnit,
          order_frequency: parseInt(values.orderFrequency),
          company: this.getMe.company.id,
          is_supplier: true,
          max_supplies_by_order: values.maxSuppliesByOrder || null
        });
        this.savingInfo = false;
        this.$router.push({ name: "suppliers" });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.supplier-edit {
  ::v-deep &__control .ant-form-item-control {
    line-height: unset;
  }
}
</style>
