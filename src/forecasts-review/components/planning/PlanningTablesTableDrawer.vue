<i18n>
{
  "en": {
    "productData": "Product Information",
    "tagProductsInfo": "Tag Products",
    "price": "Price/unit",
    "lastStock": "Last known stock",
    "noStock": "No registered stock value found",
    "primaryUnit": "Primary unit",
    "secondaryUnitConv": "Secondary unit conversion",
    "productOptions": "Product options",
    "preferUnit": "Choose your prefer unit to display: ",
    "moq":"Minimum order quantity",
    "fixedLotSize":"Fixed lot size",
    "editProduct": "Edit product",
    "editTag": "Edit tag",
    "leadTime": "Lead time | Lead time | Lead times",
    "days": "days",
    "unsavedWarningTitle": "Unsaved work",
    "unsavedWarningText": "Your changes will be automatically discarded",
    "unsavedWarningConfirmButton": "OK, DISCARD",
    "unsavedWarningCancelButton": "KEEP EDITING"
  },
  "fr": {
    "productData": "Information Produit",
    "tagProductsInfo": "Produits du Tag",
    "price": "Prix/unité",
    "lastStock": "Dernier niveau de stock",
    "noStock": "Aucune valeur de stock n'a été trouvée",
    "primaryUnit": "Unité primaire",
    "secondaryUnitConv": "Conversion en unité secondaire",
    "productOptions": "Options produit",
    "preferUnit": "Choisissez votre unité préférée à afficher: ",
    "moq":"Qte min de commande",
    "fixedLotSize":"Taille de lot fixe",
    "editProduct": "Modifier le produit",
    "editTag": "Modifier le tag",
    "leadTime": "Temps d'approvisionnement",
    "days": "jours",
    "unsavedWarningTitle": "Des données sont non sauvegardées",
    "unsavedWarningText": "Vos changements ne seront pas sauvegardés",
    "unsavedWarningConfirmButton": "OK",
    "unsavedWarningCancelButton": "CONTINUER D'EDITER"
  }
}
</i18n>

<template>
  <div>
    <div v-if="!loading">
      <div v-if="productSite">
        <div style="padding-bottom: 50px">
          <slot name="drawer-info">
            <a-divider>{{ $t("productData") }}</a-divider>
            <a-statistic
              title="Ref"
              group-separator=""
              :value="productSite.external_id"
              :value-style="{ fontSize: '14px' }"
              class="pb-4"
            />
            <a-statistic
              v-if="productSite.description"
              title="Material Description"
              :value="productSite.description"
              :value-style="{ fontSize: '14px' }"
              class="pb-4"
            />
            <a-statistic
              v-if="
                productSite.product_supplier_link.some(
                  link => link.fixed_lot_size
                )
              "
              :title="$t('fixedLotSize')"
              value=" "
              :value-style="{ fontSize: '14px' }"
              class="pb-4"
            >
              <template #prefix>
                <div
                  v-for="link in productSite.product_supplier_link"
                  :key="link.supplier.id"
                  class="grid grid-cols-2 gap-4"
                >
                  <p>{{ link.supplier.name }}:</p>
                  <p>
                    {{
                      productSite.is_default_unit
                        ? link.fixed_lot_size
                        : productSite.secondary_unit_value * link.fixed_lot_size
                    }}
                    {{
                      productSite.is_default_unit
                        ? productSite.default_unit_name
                        : productSite.secondary_unit_name
                    }}
                  </p>
                </div>
              </template>
            </a-statistic>
            <a-statistic
              v-if="displayLeadTime"
              :title="$tc('leadTime', Object.keys(suppliersConstraints).length)"
              value=" "
              :value-style="{ fontSize: '14px' }"
              class="pb-4"
            >
              <template #prefix>
                <div
                  v-for="(constraints, index) in suppliersConstraints"
                  :key="index"
                  class="grid grid-cols-2 gap-4"
                >
                  <template
                    v-if="
                      constraints.lead_time >= 0 &&
                      constraints.supplier &&
                      constraints.supplier.name
                    "
                  >
                    <p>{{ constraints.supplier.name }}:</p>
                    <p>
                      {{ constraints.lead_time || "" }}
                      {{ $t("days") }}
                    </p>
                  </template>
                </div>
              </template>
            </a-statistic>
            <a-statistic
              v-if="displayMoq"
              :title="$t('moq')"
              value=" "
              :value-style="{ fontSize: '14px' }"
              class="pb-4"
            >
              <template #prefix>
                <div
                  v-for="(constraints, index) in suppliersConstraints"
                  :key="index"
                  class="grid grid-cols-2 gap-4"
                >
                  <template
                    v-if="constraints.supplier && constraints.supplier.name"
                  >
                    <p>{{ constraints.supplier.name }}:</p>
                    <p>
                      {{
                        productSite.is_default_unit
                          ? constraints.moq
                          : productSite.secondary_unit_value * constraints.moq
                      }}
                      {{
                        productSite.is_default_unit
                          ? productSite.default_unit_name
                          : productSite.secondary_unit_name
                      }}
                    </p>
                  </template>
                </div>
              </template>
            </a-statistic>
            <a-statistic
              v-if="tags.length > 0"
              title="Tags"
              value=" "
              :value-style="{ fontSize: '14px' }"
            >
              <template #prefix>
                <div v-for="tag in tags" :key="tag.id">
                  <router-link :to="`/admin/tag/${tag.id}`">
                    <a-tag class="cursor-pointer hover:bg-blue-300">
                      {{ tag.name }}
                    </a-tag>
                  </router-link>
                </div>
              </template>
            </a-statistic>
            <a-divider dashed />
            <a-statistic
              v-if="initialStock.length"
              :value-style="{ fontSize: '14px' }"
              :title="$t('lastStock')"
              value=" "
              class="pb-2"
            >
              <template #prefix>
                <div
                  v-for="stock in initialStock"
                  :key="stock.product_site_id + '-' + stock.storage_site_id"
                >
                  {{ stock.date }}
                  {{
                    stock.storage_site_id !== 0
                      ? " - " + getStorageSitesById(stock.storage_site_id).name
                      : ""
                  }}
                  : {{ stock.quantity }}
                  {{
                    productSite.is_default_unit
                      ? productSite.default_unit_name
                      : productSite.secondary_unit_name
                  }}
                </div>
              </template>
            </a-statistic>
            <span v-else>
              {{ $t("noStock") }}
            </span>
            <a-divider dashed />
            <a-statistic
              v-if="productSite.default_unit_name"
              :title="$t('primaryUnit')"
              :value="productSite.default_unit_name"
              :value-style="{ fontSize: '14px' }"
              class="pb-4"
            />
            <template v-if="productSite.secondary_unit_name">
              <a-statistic
                :title="$t('secondaryUnitConv')"
                :value="`${productSite.default_unit_value} ${productSite.default_unit_name} = ${productSite.secondary_unit_value} ${productSite.secondary_unit_name}`"
                :value-style="{ fontSize: '14px' }"
                class="pb-4"
              />
            </template>
          </slot>
          <slot v-if="productSite.secondary_unit_name" name="drawer-info">
            <a-divider>{{ $t("productOptions") }}</a-divider>
            <template ref="unitSwitch">
              <span>{{ $t("preferUnit") }}</span>
              <a-radio-group
                :value="unitValue"
                :default-value="
                  productSite.is_default_unit ? 'default' : 'secondary'
                "
                button-style="solid"
                :disabled="
                  !getMe.canAccess(['productsite:write']) || !isEditable
                "
                @change="e => preferUnitHandler(e)"
              >
                <a-radio-button value="default">
                  {{ productSite.default_unit_name || "default unit" }}
                </a-radio-button>
                <a-radio-button value="secondary">
                  {{ productSite.secondary_unit_name || "secondary unit" }}
                </a-radio-button>
              </a-radio-group>
            </template>
          </slot>
        </div>
        <div
          class="absolute bg-white right-0 bottom-0 w-full text-left p-2 border-t z-50"
        >
          <router-link :to="`/admin/product/${productSiteId}`">
            <a-button type="link">
              {{ $t("editProduct") }}
            </a-button>
          </router-link>
        </div>
      </div>

      <div v-if="tagData">
        <div
          class="fixed right-0"
          style="top: 60px; width: 356px; height: 60px"
        >
          <a-divider>{{ $t("tagProductsInfo") }}</a-divider>
        </div>
        <div
          class="fixed right-0"
          style="width: 330px; top: 120px; bottom: 50px; overflow-y: scroll"
        >
          <ul v-if="tagProducts">
            <li v-for="product in tagProducts" :key="product.id">
              <router-link
                :to="`/admin/product/${product.id}`"
                style="text-decoration: none"
              >
                <div>
                  <span class="text-gray-700">
                    {{ product.name }}
                  </span>
                  <hr class="my-4" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div
          class="fixed right-0 bottom-0 text-left p-2 border-t"
          style="width: 356px; height: 50px"
        >
          <router-link :to="`/admin/tag/${tagData.id}`">
            <a-button type="link">
              {{ $t("editTag") }}
            </a-button>
          </router-link>
        </div>
      </div>
    </div>
    <div v-else>
      <a-skeleton active />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import SupervisorService from "@/services/supervisor.service";
import {
  Skeleton,
  Divider,
  Statistic,
  Button,
  Tag,
  Radio
} from "ant-design-vue";
import TagsService from "@/services/tags.service";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import { baseOptions } from "@/sweetalert";

export default {
  name: "PlanningTablesTableDrawer",
  components: {
    "a-divider": Divider,
    "a-statistic": Statistic,
    "a-button": Button,
    "a-skeleton": Skeleton,
    "a-tag": Tag,
    "a-radio-group": Radio.Group,
    "a-radio-button": Radio.Button
  },
  props: {
    tagData: {
      type: Object,
      required: false,
      default: () => ({})
    },
    productSiteId: {
      type: Number,
      required: true
    },
    initialStock: {
      type: Array,
      required: false,
      default: () => []
    },
    isEditable: {
      type: Boolean,
      required: false,
      default: true
    },
    productId: {
      type: Number,
      required: true
    }
  },
  emits: ["update:preferUnitChange"],
  data() {
    return {
      loading: false,
      tagProducts: null,
      productSite: null,
      tags: [],
      unitValue: undefined,
      suppliersConstraints: null
    };
  },
  computed: {
    ...mapGetters("common", ["getStorageSitesById", "getCurrentSite", "getMe"]),
    ...mapGetters("planning", ["getHasTablesWithChanges"]),
    displayMoq() {
      return this.suppliersConstraints.some(
        supplierConstraints => supplierConstraints?.moq >= 1
      );
    },
    displayLeadTime() {
      return this.suppliersConstraints.some(
        supplierConstraints => supplierConstraints?.lead_time >= 1
      );
    }
  },
  async mounted() {
    this.loading = true;
    if (this.productSiteId) {
      const siteId = this.getCurrentSite.id;
      this.productSite = (
        await SupervisorService.get(
          `/api/v1/sites/${siteId}/products/${this.productSiteId}`,
          {
            only: [
              "name",
              "external_id",
              "description",
              "default_unit_name",
              "default_unit_value",
              "secondary_unit_name",
              "secondary_unit_value",
              "is_default_unit",
              "product_supplier_link"
            ]
          }
        )
      )?.data?.product_site;
      this.suppliersConstraints = this.productSite?.product_supplier_link;
      this.tags =
        (await TagsService.fetchTagsByProductSiteId(this.productSiteId))
          ?.results ?? [];
    }
    if (this.tagData) {
      this.tagProducts = await TagsService.fetchProductsForTagBySite(
        this.tagData.id,
        true,
        "",
        100,
        { only: ["id", "name"] }
      );
    }
    this.loading = false;
  },
  methods: {
    ...mapActions("planning", ["updatePlanningData"]),
    ...mapMutations("planning", ["resetTablesWithChanges"]),
    async preferUnitHandler(e) {
      this.unitValue = e.target.value;
      if (this.getHasTablesWithChanges) {
        const status = await Swal.fire({
          ...baseOptions,
          title: this.$t("unsavedWarningTitle"),
          text: this.$t("unsavedWarningText"),
          confirmButtonText: this.$t("unsavedWarningConfirmButton"),
          cancelButtonText: this.$t("unsavedWarningCancelButton")
        }).then(result => result.isConfirmed);
        if (!status) {
          this.unitValue = this.productSite.is_default_unit
            ? "default"
            : "secondary";
          return;
        } else {
          this.resetTablesWithChanges();
        }
      }
      this.$emit("update:preferUnitChange", {
        selectedUnit: e.target.value,
        productId: this.productId
      });
    }
  }
};
</script>
