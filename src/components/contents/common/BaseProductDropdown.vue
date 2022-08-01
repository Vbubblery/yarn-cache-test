<i18n>
{
  "en": {
    "placeholderMultiple": "Please select at least one product:",
    "productsError": "Please select at least one product"
  },
  "fr": {
    "placeholderMultiple": "Sélectionnez au moins un produit:",
    "productsError": "Sélectionnez au moins un produit"
  }
}
</i18n>

<template>
  <a-form>
    <div v-if="loading" class="flex justify-center">
      <base-dot-loader />
    </div>
    <a-form-item
      v-else
      :validate-status="`${hasSelectedProductError ? 'error' : ''}`"
      :help="`${hasSelectedProductError ? $t('productsError') : ''}`"
    >
      <a-select
        v-model="selectedProductsValues"
        show-search
        mode="multiple"
        class="w-full"
        :default-active-first-option="false"
        :get-popup-container="getPopupContainer"
        :dropdown-style="{
          maxHeight: '300px',
          maxWidth: '350px'
        }"
        :dropdown-match-select-width="false"
        :placeholder="$t('placeholderMultiple')"
        :filter-option="false"
        :not-found-content="null"
        :allow-clear="true"
        @search="handleSearch"
      >
        <a-select-option
          v-for="product in productsInDropdown"
          :key="product.value"
          :value="product.value"
        >
          <a-tooltip :title="product.label">
            {{ product.label }}
          </a-tooltip>
        </a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Select, Tooltip, Form } from "ant-design-vue";
import debounceMixin from "@/helper/debounceMixin";

export default {
  name: "BaseProductDropdown",
  components: {
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-select": Select,
    "a-select-option": Select.Option,
    "a-tooltip": Tooltip,
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue")
  },
  mixins: [debounceMixin],
  props: {
    targetModule: {
      type: String,
      default: "common"
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite"]),
    hasSelectedProductError() {
      return this.$store.getters[
        this.targetModule + "/getHasSelectedProductError"
      ];
    },
    productsInDropdown() {
      const selectedProducts =
        this.$store.getters[this.targetModule + "/getSelectedProducts"];
      let products = [];
      (Object.keys(selectedProducts || {}) || []).forEach(id => {
        if (selectedProducts[id]) products.push(selectedProducts[id]);
      });

      (this.$store.getters[this.targetModule + "/getProductsInDropdown"] || [])
        .filter(p => !selectedProducts[p.id])
        .forEach(p => products.push(p));

      return products.map(p => {
        return { label: p.name, value: p.id, key: p.name };
      });
    },
    selectedProductsValues: {
      get() {
        return Object.keys(
          this.$store.getters[this.targetModule + "/getSelectedProducts"] || {}
        ).map(key => parseInt(key));
      },
      set(selectedProductsValues) {
        const oldSelectedProducts =
          this.$store.getters[this.targetModule + "/getSelectedProducts"];
        let newProducts = {};
        selectedProductsValues.forEach(id => {
          if (oldSelectedProducts[id]) {
            newProducts[id] = oldSelectedProducts[id];
          } else {
            newProducts[id] =
              this.$store.getters[
                this.targetModule + "/getProductsInDropdownById"
              ](id);
          }
        });
        this.$store.dispatch(
          this.targetModule + "/updateSelectedProducts",
          newProducts
        );
      }
    }
  },
  watch: {
    async getCurrentSite() {
      this.loading = true;
      await this.$store.dispatch(this.targetModule + "/fetchProducts", {
        pattern: ""
      });
      this.loading = false;
    },
    async getSelectedProducts() {
      if (Object.keys(this.getSelectedProducts).length == 0) {
        await this.$store.dispatch(this.targetModule + "/fetchProducts", {
          pattern: ""
        });
      }
    }
  },
  async created() {
    this.loading = true;
    await this.$store.dispatch(this.targetModule + "/fetchProducts", {
      pattern: ""
    });
    this.loading = false;
  },

  methods: {
    ...mapActions("common", ["updateSelectedProducts"]),
    handleSearch(value) {
      value = value.trim();
      this.debounce(() => {
        this.$store.dispatch(this.targetModule + "/fetchProducts", {
          pattern: value
        });
      }, 300);
    },
    getPopupContainer(trigger) {
      return trigger.parentElement;
    }
  }
};
</script>
