<i18n>
{
  "en": {
    "back" : "all suppliers",
    "title": "Create a new supplier",
    "name": "Name",
    "email": "Contact email (optional)",
    "address": "address (optional)",
    "constraints": "Constraints (optional)",
    "fullTruckQte": "Full truck qte",
    "minOrderQte": "Min order qte",
    "unit": "unit",
    "unitPlaceholder": "Select unit",
    "orderFrequency": "Order frequency",
    "create": "Create",
    "cancel": "Cancel",
    "errorName": "Please add a supplier name",
    "externalId": "Ref",
    "errorExtId": "Please add a supplier reference",
    "days": "days",
    "maxSuppliesByOrder": "Max rows by order (export only)"
  },
  "fr": {
    "back" : "retour",
    "title": "Créer un nouveau fournisseur",
    "name": "Nom",
    "email": "Email du contact (optionnel)" ,
    "address": "Adresse postale (optionnel)",
    "constraints": "Contraintes (optionnel)",
    "fullTruckQte": "Quantité camion plein",
    "minOrderQte": "Quantité commande min",
    "unit": "Unité",
    "unitPlaceholder": "Sélectionnez l'unité",
    "orderFrequency": "Fréquence de commande", 
    "create": "Créer",
    "cancel": "Annuler",
    "errorName": "Veuillez ajouter le nom du fournisseur",
    "externalId": "Ref",
    "errorExtId": "Veuillez ajouter la référence du fournisseur",
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
        <a-form :form="form" @submit="handleSubmit">
          <p class="m-0 text-gray-600">
            {{ $t("externalId") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'externalId',
                {
                  rules: [{ required: true, message: $t(`errorExtId`) }]
                }
              ]"
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
                  rules: [{ required: true, message: $t('errorName') }]
                }
              ]"
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
                  initialValue: ''
                }
              ]"
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
                  initialValue: ''
                }
              ]"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">
            {{ $t("maxSuppliesByOrder") }}
          </p>
          <a-form-item class="mb-2">
            <a-input
              v-decorator="['maxSuppliesByOrder']"
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
                      v-decorator="['fullTruckQte']"
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
                      v-decorator="['minOrderQte']"
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
                      v-decorator="['orderFrequency']"
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
              <BaseButton :loading="saving" @click="handleSubmit">
                {{ $t("create") }}
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
import PartnersService from "@/services/partners.service";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import BaseDropdown from "@/components/base/components/BaseDropdown.vue";
import {
  FULL_TRUCK_UNITS,
  MOQ_UNITS
} from "@/components/contents/admin/constants/suppliers";

export default {
  name: "AdminSupplierNew",
  components: {
    BaseSVG,
    BaseButton,
    BaseDropdown,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-menu-item": Menu.Item,
    "a-input": Input,
    "a-collapse": Collapse,
    "a-collapse-panel": Collapse.Panel
  },
  data() {
    this.password = "";
    return {
      form: Form.createForm(this),
      saving: false,
      fullTruckUnit: "",
      moqUnit: "",
      FULL_TRUCK_UNITS,
      MOQ_UNITS
    };
  },
  computed: {
    ...mapGetters("common", ["getMe"])
  },
  methods: {
    handlePasswordChange(e) {
      this.password = e.target.value;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        try {
          if (!err) {
            this.saving = true;
            await PartnersService.postPartnerSite({
              name: values.name,
              contact_email: values.email,
              adress: values.address,
              full_truck_quantity: values.fullTruckQte,
              full_truck_unit: this.fullTruckUnit,
              minimum_order_quantity: values.minOrderQte,
              minimum_order_unit: this.moqUnit,
              order_frequency: values.orderFrequency,
              company: this.getMe.company.id,
              is_supplier: true,
              external_id: values.externalId,
              max_supplies_by_order: values.maxSuppliesByOrder || null
            });
            this.saving = false;
            this.$router.push({ name: "suppliers" });
          }
        } catch (error) {
          this.saving = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.supplier-edit {
  // Ant Design sets line-height that is higher than block; let's remove it
  ::v-deep &__control .ant-form-item-control {
    line-height: unset;
  }
}
</style>
