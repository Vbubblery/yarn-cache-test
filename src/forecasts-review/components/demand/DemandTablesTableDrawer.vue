<i18n>
{
  "en": {
    "productOptions": "Product options",
    "tagProductsInfo": "Tag Products",
    "editProduct": "Edit product",
    "preferUnit":"Choose your prefer unit to display: ",
    "editTag": "Edit tag",
    "leadTime": "Lead time | Lead time | Lead times",
    "moq": "Minimum order quantity",
    "lotSize": "Fixed lot size",
    "unsavedWarningTitle": "Unsaved work",
    "unsavedWarningText": "Your changes will be automatically discarded",
    "unsavedWarningConfirmButton": "OK, DISCARD",
    "unsavedWarningCancelButton": "KEEP EDITING"
  },
  "fr": {
    "productOptions": "Options produit",
    "tagProductsInfo": "Produits du Tag",
    "editProduct": "Modifier le produit",
    "preferUnit":"Choisissez votre unité préférée à afficher: ",
    "editTag": "Modifier le tag",
    "leadTime": "Temps d'approvisionnement",
    "moq": "Minimum de commande",
    "lotSize": "Taille de lot fixe",
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
            <a-statistic
              v-if="productSite.description"
              title="Material Description"
              :value="productSite.description"
              :value-style="{ fontSize: '14px' }"
              class="pb-2"
            />
            <a-statistic
              v-if="productSite.fixed_lot_size"
              :title="$t('lotSize')"
              :value="`${productSite.fixed_lot_size} ${
                productSite.is_default_unit
                  ? productSite.default_unit_name
                  : productSite.secondary_unit_name
              }`"
              :value-style="{ fontSize: '14px' }"
              class="pb-4"
            />
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
                      {{ constraints.moq }}
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
          </slot>

          <slot v-if="productSite.secondary_unit_name" name="drawer-info">
            <a-divider>{{ $t("productOptions") }}</a-divider>
            <template ref="unitSwitch">
              <span>{{ $t("preferUnit") }}</span>
              <a-radio-group
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
import { mapGetters, mapMutations } from "vuex";
import SupervisorService from "@/services/supervisor.service";
import { Skeleton, Divider, Radio, Button, Statistic } from "ant-design-vue";
import TagsService from "@/services/tags.service";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import { baseOptions } from "@/sweetalert";

export default {
  name: "DemandTablesTableDrawer",
  components: {
    "a-divider": Divider,
    "a-statistic": Statistic,
    "a-radio-group": Radio.Group,
    "a-radio-button": Radio.Button,
    "a-button": Button,
    "a-skeleton": Skeleton
  },
  props: {
    productSiteId: {
      type: Number,
      required: true
    },
    tagData: {
      type: Object,
      required: false,
      default: () => ({})
    },
    isEditable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["preferUnitChange"],
  data() {
    return {
      loading: false,
      productSite: null,
      tagProducts: null,
      suppliersConstraints: null
    };
  },
  computed: {
    ...mapGetters("common", ["getStorageSitesById", "getCurrentSite", "getMe"]),
    ...mapGetters("demand", ["getHasTablesWithChanges"]),
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
              "description",
              "default_unit_name",
              "default_unit_value",
              "secondary_unit_name",
              "secondary_unit_value",
              "is_default_unit",
              "fixed_lot_size",
              "product_supplier_link"
            ]
          }
        )
      )?.data?.product_site;
      this.suppliersConstraints = this.productSite?.product_supplier_link;
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
    ...mapMutations("demand", ["resetTablesWithChanges"]),
    async preferUnitHandler(e) {
      if (this.getHasTablesWithChanges) {
        const status = await Swal.fire({
          ...baseOptions,
          title: this.$t("unsavedWarningTitle"),
          text: this.$t("unsavedWarningText"),
          confirmButtonText: this.$t("unsavedWarningConfirmButton"),
          cancelButtonText: this.$t("unsavedWarningCancelButton")
        }).then(result => result.isConfirmed);
        if (!status) {
          return;
        } else {
          this.resetTablesWithChanges();
        }
      }
      this.$emit("preferUnitChange", e.target.value, {
        defaultUnitName: this.productSite.default_unit_name,
        defaultUnitValue: this.productSite.default_unit_value,
        secondaryUnitName: this.productSite.secondary_unit_name,
        secondaryUnitValue: this.productSite.secondary_unit_value
      });
    }
  }
};
</script>
