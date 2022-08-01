<i18n>
{
  "en": {
    "back" : "back",
    "title": "Edit promotion",
    "name": "Name",
    "promotionDetails": "Promotion details",
    "requiredError": "This field is required",
    "startDate": "Start date",
    "endDate": "End date",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "products": "Products",
    "coefficient": "Sales impact in (%)",
    "requiredNumberError": "Please provide a valid number",
    "updateSuccess": "Promotion updated successfully",
    "deleteSuccess": "Promotion deleted successfully",
    "deleteDescription": "This action is permanent",
    "deleteQuestion": "This will permanently delete this promotion. Continue?"
  },
  "fr": {
    "back" : "retour",
    "title": "Modifier promotion",
    "name": "Nom",
    "promotionDetails": "Details de la promotion",
    "requiredError": "Ce champ est requis",
    "startDate": "Date de début",
    "endDate": "Date de fin",
    "save": "Valider",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "products": "Produits",
    "coefficient": "Impact sur les ventes en (%)",
    "requiredNumberError": "Merci de renseigner un nombre valide",
    "updateSuccess": "Promotion mise à jour avec succès",
    "deleteSuccess": "Promotion supprimée avec succès",
    "deleteDescription": "Cette action est définitive",
    "deleteQuestion": "Ceci va définitivement supprimer la promotion. Continuer ?"
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
        <div v-if="!promotion" class="flex justify-center items-center">
          <base-dot-loader />
        </div>
        <div v-else>
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
                    rules: [{ required: true, message: $t('requiredError') }],
                    initialValue: promotion.name
                  }
                ]"
                :disabled="!getMe.canAccess(['promotion:write'])"
              />
            </a-form-item>
            <p class="m-0 text-gray-600">Description</p>
            <a-form-item>
              <a-input
                v-decorator="[
                  'description',
                  {
                    rules: [{ required: false, message: $t('requiredError') }],
                    initialValue: promotion.description
                  }
                ]"
                :disabled="!getMe.canAccess(['promotion:write'])"
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
                    rules: [
                      { required: false, message: $t('requiredNumberError') }
                    ],
                    initialValue: promotion.coefficient
                  }
                ]"
                :disabled="!getMe.canAccess(['promotion:write'])"
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
                      rules: [{ required: true, message: $t('requiredError') }],
                      initialValue: makeDate(promotion.startDate)
                    }
                  ]"
                  :disabled="!getMe.canAccess(['promotion:write'])"
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
                      initialValue: makeDate(promotion.endDate)
                    }
                  ]"
                  :disabled="!getMe.canAccess(['promotion:write'])"
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
                    rules: [{ required: false, message: $t('requiredError') }],
                    initialValue: promotionProducts
                  }
                ]"
                show-search
                :disabled="!getMe.canAccess(['promotion:write'])"
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
              <div
                v-if="getMe.canAccess(['promotion:write'])"
                class="flex justify-between"
              >
                <div class="flex space-x-2">
                  <BaseButton :loading="saving" @click="handleSubmit">
                    {{ $t("save") }}
                  </BaseButton>
                  <BaseButton
                    type="secondary"
                    @click="$router.push({ name: 'promotions' })"
                  >
                    {{ $t("cancel") }}
                  </BaseButton>
                </div>
                <a-popconfirm
                  v-if="getMe.canAccess(['promotion:delete'])"
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
import ProductsService from "@/services/products.service";
import PromotionsService from "@/services/promotions.service";
import {
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Popconfirm
} from "ant-design-vue";
import BaseDotLoader from "@/components/contents/common/BaseDotLoader.vue";
import debounceMixin from "@/helper/debounceMixin";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminPromotionEdit",
  components: {
    BaseButton,
    BaseSVG,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-date-picker": DatePicker,
    "a-select": Select,
    "a-input-number": InputNumber,
    "a-popconfirm": Popconfirm,
    "base-dot-loader": BaseDotLoader
  },
  mixins: [promotionsMixins, debounceMixin],
  props: {
    promotionId: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      form: Form.createForm(this),
      saving: false,
      promotion: null,
      productsList: [],
      promotionProducts: []
    };
  },
  computed: {
    ...mapGetters("common", ["getMe", "getCompany", "getCurrentSite"])
  },
  async created() {
    try {
      this.promotion = await PromotionsService.fetchPromotionById(
        this.promotionId
      );
    } catch (e) {
      this.$router.push({ name: "promotions" });
    }

    await this.searchProducts("");
    this.addExistingProducts();
  },
  methods: {
    makeDate(isoDate) {
      return dayjs(isoDate);
    },
    formatDate(date) {
      return dayjs(date).format("YYYY-MM-DD");
    },
    handleProductsSearch(value) {
      value = value.trim();
      this.debounce(async () => {
        await this.searchProducts(value);
      }, 300);
    },
    handleSubmit() {
      const oldPromotion = this.promotion;
      this.form.validateFieldsAndScroll(async (err, updatedPromoData) => {
        if (!err) {
          this.saving = true;
          updatedPromoData.company = this.getCompany.id;
          updatedPromoData.start_date = this.formatDate(
            updatedPromoData.start_date
          );
          updatedPromoData.end_date = this.formatDate(
            updatedPromoData.end_date
          );
          const otherSitesProducts =
            oldPromotion.products
              .filter(p => p.site !== this.getCurrentSite.id)
              .map(p => p.id) || [];
          const thisSiteProducts = updatedPromoData.products || [];
          updatedPromoData.products = [
            ...otherSitesProducts,
            ...thisSiteProducts
          ];
          await PromotionsService.updatePromotion(
            oldPromotion,
            updatedPromoData
          );
          this.saving = false;
          this.$router.push({ name: "promotions" });
          NotificationService.success(this.$t("updateSuccess"));
        }
      });
    },
    async confirmDelete() {
      await PromotionsService.deletePromotion(this.promotion);
      NotificationService.success(this.$t("deleteSuccess"));
      this.$router.push({ name: "promotions" });
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
    },
    addExistingProducts() {
      this.promotion.products.forEach(product => {
        if (product.site === this.getCurrentSite.id) {
          this.promotionProducts.push(product.id);
          this.productsList.push({
            label: product.name,
            key: product.id,
            value: product.id
          });
        }
      });
    }
  }
};
</script>
