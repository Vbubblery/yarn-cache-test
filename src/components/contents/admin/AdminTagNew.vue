<i18n>
{
  "en": {
    "back" : "back",
    "title": "Create a new Tag",
    "name": "Name",
    "tagDetails": "Tag details",
    "requiredError": "This field is required",
    "create": "Create",
    "cancel": "Cancel",
    "products": "Products",
    "createSuccess": "Tag created successfully",
    "createError": "An error occurred during the tag creation",
    "add": "To tag",
    "remove": "Untag",
    "search": "Search by product name",
    "notTaggedProducts": "available products | available product | available products",
    "taggedProducts": "tagged products | tagged product | tagged products",
    "selectAll": "Select all",
    "isTagGrouper": "Used to group orders"
  },
  "fr": {
    "back" : "retour",
    "title": "Créer un nouveau Tag",
    "name": "Nom",
    "tagDetails": "Details du Tag",
    "requiredError": "Ce champ est requis",
    "create": "Créer",
    "cancel": "Annuler",
    "products": "Produits",
    "createSuccess": "Tag créé avec succès",
    "createError": "Une erreur est survenue durant la création du Tag",
    "add": "Ajouter",
    "remove": "Enlever",
    "search": "Chercher par nom de produit",
    "notTaggedProducts": "produit disponible | produit disponible | produits disponibles",
    "taggedProducts": "produit tagué | produit tagué | produits tagués",
    "selectAll": "Tout sélectionner",
    "isTagGrouper": "Utilisé pour regrouper les commandes"
  }
}
</i18n>

<template>
  <div class="bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div
        style="width: 60vw"
        class="relative bg-white px-12 py-10 rounded-lg shadow-2xl"
      >
        <router-link
          :to="{ name: 'tags' }"
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
          {{ $t("tagDetails") }}
        </p>
        <div v-if="loading" class="flex justify-center items-center">
          <base-dot-loader />
        </div>
        <a-form v-else :form="form" @submit.prevent="handleSubmit">
          <a-row>
            <a-col class="text-gray-600" span="8">
              {{ $t("name") }}
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
            </a-col>
            <a-col class="text-gray-600" span="8" offset="8">
              <a-form-item>
                <a-checkbox
                  v-model="tag.isTagGrouper"
                  v-decorator="['isTagGrouper']"
                  @click="toggleTagGrouper"
                >
                  <span class="m-0 text-gray-600">
                    {{ $t("isTagGrouper") }}
                  </span>
                </a-checkbox>
              </a-form-item>
            </a-col>
          </a-row>
          <p class="m-0 text-gray-600">
            {{ $t("products") }}
          </p>
          <a-input-search
            v-model="searchName"
            :placeholder="$t('search')"
            class="w-1/3"
            :loading="isSearchLoading"
            @change="handleSearch"
          />
          <div class="flex justify-between mt-3">
            <div class="w-full">
              <p class="mb-1 ml-2 text-gray-600 text-sm">
                {{ Object.values(products).filter(p => p.checked).length }} /
                {{ Object.values(products).length }} -
                {{ $tc("notTaggedProducts", Object.values(products).length) }}
              </p>
              <a-checkbox
                class="ml-3 mb-1"
                :checked="selectAllChecked.left"
                @change="e => handleSelectAll('left', e)"
              >
                <span class="m-0 text-gray-600">{{ $t("selectAll") }}</span>
              </a-checkbox>
              <virtual-list
                class="border rounded-lg p-3"
                style="height: 360px; overflow-y: auto"
                data-key="id"
                :data-sources="Object.values(products)"
                :data-component="itemComponent"
                :estimate-size="20"
              />
            </div>
            <div class="mx-2 flex flex-col justify-center w-[220px]">
              <BaseButton
                icon="arrow-right-s-line"
                class="my-2"
                @click="handleTagging('add')"
              >
                {{ $t("add") }}
              </BaseButton>
              <BaseButton
                icon="arrow-left-s-line"
                class="my-2"
                @click="handleTagging('remove')"
              >
                {{ $t("remove") }}
              </BaseButton>
            </div>
            <div class="w-full">
              <p class="mb-1 ml-2 text-gray-600 text-sm">
                {{
                  Object.values(targetProductsFiltered).filter(p => p.checked)
                    .length
                }}
                / {{ Object.values(targetProductsFiltered).length }} -
                {{
                  $tc(
                    "taggedProducts",
                    Object.values(targetProductsFiltered).length
                  )
                }}
              </p>
              <a-checkbox
                class="ml-3 mb-1"
                :checked="selectAllChecked.right"
                @change="e => handleSelectAll('right', e)"
              >
                <span class="m-0 text-gray-600">{{ $t("selectAll") }}</span>
              </a-checkbox>
              <virtual-list
                class="border rounded-lg p-3"
                style="height: 360px; overflow-y: auto"
                data-key="id"
                :data-sources="Object.values(targetProductsFiltered)"
                :data-component="itemComponent"
                :estimate-size="20"
              />
            </div>
          </div>
          <a-form-item class="mt-12">
            <div class="flex justify-between">
              <div class="flex space-x-2">
                <BaseButton :loading="saving" @click="handleSubmit">
                  {{ $t("create") }}
                </BaseButton>
                <BaseButton
                  type="secondary"
                  @click="$router.push({ name: 'tags' })"
                >
                  {{ $t("cancel") }}
                </BaseButton>
              </div>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Form, Input, Checkbox, Col, Row } from "ant-design-vue";
import VirtualList from "vue-virtual-scroll-list";
import NotificationService from "@/services/notification.service";
import TagsService from "@/services/tags.service";
import AdminTagItemList from "@/components/contents/admin/AdminTagItemList.vue";
import ProductsService from "@/services/products.service";
import debounceMixin from "@/helper/debounceMixin";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import emitterMixin from "@/helper/emitterMixin";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminTagNew",
  components: {
    BaseSVG,
    BaseButton,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-input-search": Input.Search,
    "virtual-list": VirtualList,
    "a-checkbox": Checkbox,
    "a-row": Row,
    "a-col": Col,
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue")
  },
  mixins: [debounceMixin, emitterMixin],
  data() {
    return {
      form: Form.createForm(this),
      saving: false,
      itemComponent: AdminTagItemList,
      products: {},
      targetProducts: {},
      targetProductsFiltered: {},
      tag: { isTagGrouper: false },
      loading: true,
      selectAllChecked: { left: false, right: false },
      searchName: "",
      isSearchLoading: false
    };
  },
  computed: {
    ...mapGetters("common", ["getCompany", "getCurrentSite"])
  },
  watch: {
    getCurrentSite() {
      this.$router.push({ name: "tags" });
    }
  },
  async created() {
    try {
      this.loading = true;
      this.products = await this.fetchProducts("");
      this.loading = false;
    } catch (e) {
      this.$router.push({ name: "tags" });
    }
  },
  methods: {
    async fetchProducts(pattern) {
      let res = await ProductsService.fetchProducts({
        pattern,
        perPage: 99999
      });
      return res.reduce((obj, curr) => {
        obj[curr.id] = {
          id: curr.id,
          name: curr.name,
          checked: false,
          toBold: pattern,
          parentName: "AdminTagNew"
        };
        return obj;
      }, {});
    },
    async handleSearch() {
      this.debounce(async () => {
        try {
          this.isSearchLoading = true;
          const value = this.searchName;
          this.products = await this.fetchProducts(value);
          Object.values(this.targetProducts).forEach(p => {
            if (this.products.hasOwnProperty(p.id.toString()))
              delete this.products[p.id];
          });
          this.selectAllChecked.left = false;
          this.selectAllChecked.right = false;
          this.targetProductsFiltered = Object.values(
            this.targetProducts
          ).reduce((obj, product) => {
            if (product.name.match(new RegExp(value, "gi"))) {
              obj[product.id] = product;
              obj[product.id].checked = false;
              obj[product.id].toBold = value;
            }
            return obj;
          }, {});
          this.isSearchLoading = false;
        } catch {
          this.isSearchLoading = false;
        }
      }, 300);
    },
    handleSelectAll(direction, event) {
      if (direction === "left") {
        this.selectAllChecked.left = event.target.checked;
        Object.values(this.products).forEach(
          product => (product.checked = event.target.checked)
        );
      } else if (direction === "right") {
        this.selectAllChecked.right = event.target.checked;
        Object.values(this.targetProducts).forEach(
          product => (product.checked = event.target.checked)
        );
      }
    },
    handleTagging(type) {
      if (type === "add") {
        const selected = Object.values(this.products).filter(p => p.checked);
        selected.forEach(p => {
          this.targetProducts[p.id] = p;
          this.targetProducts[p.id].checked = false;
          this.targetProductsFiltered[p.id] = p;
          this.targetProductsFiltered[p.id].checked = false;
          delete this.products[p.id];
        });
        this.selectAllChecked.left = false;
      } else {
        const selected = Object.values(this.targetProductsFiltered).filter(
          p => p.checked
        );
        selected.forEach(p => {
          this.products[p.id] = p;
          this.products[p.id].checked = false;
          delete this.targetProducts[p.id];
          delete this.targetProductsFiltered[p.id];
        });
        this.selectAllChecked.right = false;
      }
    },
    handleSubmit() {
      this.form.validateFieldsAndScroll(async (err, tagData) => {
        if (!err) {
          this.saving = true;
          let productIds = Object.keys(this.targetProducts).map(id =>
            parseInt(id)
          );
          await TagsService.createTag({
            name: tagData.name,
            products: productIds,
            company: this.getCompany.id,
            is_tag_grouper: tagData.isTagGrouper
          });
          this.saving = false;
          this.$router.push({ name: "tags" });
          NotificationService.success(this.$t("createSuccess"));
        } else {
          NotificationService.error(this.$t("createError"));
        }
      });
    },
    toggleTagGrouper() {
      this.tag.isTagGrouper = !this.tag.isTagGrouper;
    }
  }
};
</script>
