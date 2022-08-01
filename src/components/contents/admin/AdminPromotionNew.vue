<i18n>
{
  "en": {
    "back" : "back",
    "title": "Create a new promotion",
    "name": "Name",
    "promotionDetails": "Promotion details",
    "requiredError": "This field is required",
    "startDate": "Start date",
    "endDate": "End date",
    "create": "Create",
    "cancel": "Cancel",
    "products": "Products",
    "coefficient": "Sales impact in (%)",
    "requiredNumberError": "Please provide a valid number",
    "createSuccess": "Promotion created successfully"
  },
  "fr": {
    "back" : "retour",
    "title": "Créer une nouvelle promotion",
    "name": "Nom",
    "promotionDetails": "Details de la promotion",
    "requiredError": "Ce champ est requis",
    "startDate": "Date de début",
    "endDate": "Date de fin",
    "create": "Créer",
    "cancel": "Annuler",
    "products": "Produits",
    "coefficient": "Impact sur les ventes en (%)",
    "requiredNumberError": "Merci de renseigner un nombre valide",
    "createSuccess": "Promotion créée avec succès"
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
          :to="{ name: 'promotions' }"
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
        <p class="text-xl font-bold mb-4">
          {{ $t("promotionDetails") }}
        </p>
        <!-- form -->
        <a-form :form="form" @submit.prevent="handleSubmit">
          <p class="m-0 text-gray-600">
            {{ $t("name") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'name',
                {
                  rules: [{ required: true, message: $t('requiredError') }]
                }
              ]"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">Description</p>
          <a-form-item>
            <a-input
              v-decorator="[
                'description',
                {
                  rules: [{ required: false, message: $t('requiredError') }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item>
            <p class="m-0 text-gray-600">
              {{ $t("coefficient") }}
            </p>
            <a-input-number
              v-decorator="[
                'coefficient',
                {
                  initialValue: 0,
                  rules: [
                    { required: false, message: $t('requiredNumberError') }
                  ]
                }
              ]"
              :min="-100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
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
                    rules: [{ required: true, message: $t('requiredError') }]
                  }
                ]"
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
                    rules: [{ required: true, message: $t('requiredError') }]
                  }
                ]"
                :disabled-date="disabledEndDate"
                @change="handleEndDateChange"
              />
            </a-form-item>
          </div>
          <a-form-item>
            <p class="m-0 text-gray-600">
              {{ $t("products") }}
            </p>
            <a-select
              v-decorator="[
                'products',
                {
                  rules: [{ required: false, message: $t('requiredError') }]
                }
              ]"
              show-search
              :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
              :filter-option="false"
              :not-found-content="null"
              :allow-clear="true"
              :options="productsList"
              mode="multiple"
              @search="handleProductsSearch"
            />
          </a-form-item>
          <a-form-item class="mt-12">
            <div class="flex space-x-2">
              <BaseButton :loading="saving" @click="handleSubmit">
                {{ $t("create") }}
              </BaseButton>
              <BaseButton
                type="secondary"
                @click="$router.push({ name: 'promotions' })"
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
import NotificationService from "@/services/notification.service";
import ProductsService from "@/services/products.service";
import PromotionsService from "@/services/promotions.service";
import { promotionsMixins } from "./adminMixins";
import debounceMixin from "@/helper/debounceMixin";
import { Form, Input, DatePicker, Select, InputNumber } from "ant-design-vue";
import { mapGetters } from "vuex";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminPromotionNew",
  components: {
    BaseButton,
    BaseSVG,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-date-picker": DatePicker,
    "a-select": Select,
    "a-input-number": InputNumber
  },
  mixins: [promotionsMixins, debounceMixin],
  data() {
    return {
      form: Form.createForm(this),
      saving: false,
      productsList: []
    };
  },
  computed: {
    ...mapGetters("common", ["getCompany"])
  },
  async created() {
    await this.searchProducts("");
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format("YYYY-MM-DD");
    },
    handleSubmit() {
      this.form.validateFieldsAndScroll(async (err, promotionData) => {
        if (!err) {
          this.saving = true;
          promotionData.company = this.getCompany.id;
          promotionData.start_date = this.formatDate(promotionData.start_date);
          promotionData.end_date = this.formatDate(promotionData.end_date);
          await PromotionsService.createPromotion(promotionData);
          this.saving = false;
          this.$router.push({ name: "promotions" });
          NotificationService.success(this.$t("createSuccess"));
        }
      });
    },
    handleProductsSearch(value) {
      value = value.trim();
      this.debounce(async () => {
        await this.searchProducts(value);
      }, 300);
    },
    async searchProducts(value) {
      const products = await ProductsService.fetchProducts(
        {
          pattern: value
        },
        {
          only: ["id", "name"]
        }
      );
      this.productsList = (products || []).map(p => {
        return { label: p.name, key: p.id, value: p.id };
      });
    }
  }
};
</script>
