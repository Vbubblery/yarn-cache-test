<i18n>
{
  "en": {
    "back" : "back",
    "title": "Edit tag",
    "name": "Name",
    "tagDetails": "Tag details",
    "requiredError": "This field is required",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "products": "Products",
    "updateSuccess": "Tag updated successfully",
    "updateError": "An error occurred while updating the tag",
    "deleteSuccess": "Tag deleted successfully",
    "deleteDescription": "This action is permanent",
    "deleteQuestion": "This will permanently delete this tag. Continue?",
    "add": "To tag",
    "remove": "Untag",
    "all": "Products list",
    "nonAdminWarningText": "Please contact your admin for any modification",
    "search": "Search by product name",
    "notTaggedProducts": "available products | available product | available products",
    "taggedProducts": "tagged products | tagged product | tagged products",
    "selectAll": "Select all",
    "isTagGrouper": "Used to group orders"
  },
  "fr": {
    "back" : "retour",
    "title": "Modifier Tag",
    "name": "Nom",
    "tagDetails": "Details du Tag",
    "requiredError": "Ce champ est requis",
    "save": "Valider",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "products": "Produits",
    "updateSuccess": "Tag mis à jour avec succès",
    "updateError": "Une erreur est survenue durant la mise à jour du Tag",
    "deleteSuccess": "Tag supprimé avec succès",
    "deleteDescription": "Cette action est définitive",
    "deleteQuestion": "Ceci va définitivement supprimer le Tag. Continuer ?",
    "add": "Ajouter",
    "remove": "Enlever",
    "all": "Liste de produits",
    "nonAdminWarningText": "Veuillez contacter votre admin pour tout besoin de modification",
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
        <a-alert
          v-if="!getMe.canAccess(['tag:write'])"
          :message="$t('nonAdminWarningText')"
          banner
          closable
        />
        <div v-if="loading" class="flex justify-center">
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
                      rules: [{ required: true, message: $t('requiredError') }],
                      initialValue: tag.name
                    }
                  ]"
                  :disabled="!getMe.canAccess(['tag:write'])"
                />
              </a-form-item>
            </a-col>
            <a-col class="text-gray-600" span="8" offset="8">
              <a-form-item>
                <a-checkbox
                  v-model="tag.isTagGrouper"
                  v-decorator="['isTagGrouper']"
                  :disabled="!getMe.canAccess(['tag:write'])"
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
            <div
              :class="`w-full ${getMe.canAccess(['tag:write']) ? '' : 'mr-12'}`"
            >
              <p class="mb-1 ml-2 text-gray-600 text-sm">
                {{
                  getMe.canAccess(["tag:write"])
                    ? `${
                        Object.values(products).filter(p => p.checked).length
                      } / `
                    : ""
                }}
                {{
                  `${Object.values(products).length} ${$tc(
                    "notTaggedProducts",
                    Object.values(products).length
                  )}`
                }}
              </p>
              <a-checkbox
                v-if="getMe.canAccess(['tag:write'])"
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
            <div
              v-if="getMe.canAccess(['tag:write'])"
              class="mx-2 flex flex-col justify-center w-[220px]"
            >
              <BaseButton
                condensed
                icon="arrow-right-s-line"
                icon-position="right"
                class="my-2"
                @click="handleTagging('add')"
              >
                <span>{{ $t("add") }}</span>
              </BaseButton>
              <BaseButton
                condensed
                icon="arrow-left-s-line"
                class="my-2"
                @click="handleTagging('remove')"
              >
                <span>{{ $t("remove") }}</span>
              </BaseButton>
            </div>
            <div class="w-full">
              <p class="mb-1 ml-2 text-gray-600 text-sm">
                {{
                  getMe.admin
                    ? `${
                        Object.values(targetProducts).filter(p => p.checked)
                          .length
                      } / `
                    : ""
                }}
                {{
                  `${Object.values(targetProducts).length} ${$tc(
                    "taggedProducts",
                    Object.values(targetProducts).length
                  )}`
                }}
              </p>
              <a-checkbox
                v-if="getMe.canAccess(['tag:write'])"
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
                :data-sources="Object.values(targetProducts)"
                :data-component="itemComponent"
                :estimate-size="20"
              />
            </div>
          </div>
          <a-form-item class="mt-12">
            <div
              v-if="getMe.canAccess(['tag:write'])"
              class="flex justify-between"
            >
              <div class="flex space-x-2">
                <BaseButton :loading="saving" @click="handleSubmit">
                  {{ $t("save") }}
                </BaseButton>
                <BaseButton
                  type="secondary"
                  @click="$router.push({ name: 'tags' })"
                >
                  {{ $t("cancel") }}
                </BaseButton>
              </div>
              <a-popconfirm @confirm="confirmDelete">
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
</template>

<script>
import { mapGetters } from "vuex";
import {
  Form,
  Input,
  Popconfirm,
  Alert,
  Checkbox,
  Row,
  Col
} from "ant-design-vue";
import VirtualList from "vue-virtual-scroll-list";
import NotificationService from "@/services/notification.service";
import TagsService from "@/services/tags.service";
import AdminTagItemList from "@/components/contents/admin/AdminTagItemList.vue";
import debounceMixin from "@/helper/debounceMixin";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import emitterMixin from "@/helper/emitterMixin";

export default {
  name: "AdminTagEdit",
  components: {
    BaseSVG,
    BaseButton,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-input-search": Input.Search,
    "a-popconfirm": Popconfirm,
    "a-alert": Alert,
    "virtual-list": VirtualList,
    "a-checkbox": Checkbox,
    "a-row": Row,
    "a-col": Col,
    "base-dot-loader": () =>
      import("@/components/contents/common/BaseDotLoader.vue")
  },
  mixins: [debounceMixin, emitterMixin],
  props: {
    tagId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: Form.createForm(this),
      saving: false,
      itemComponent: AdminTagItemList,
      targetProducts: {},
      tag: null,
      additions: {},
      removals: {},
      loading: true,
      selectAllChecked: { left: false, right: false },
      searchName: "",
      isSearchLoading: false
    };
  },
  computed: {
    ...mapGetters("common", ["getMe"])
  },
  watch: {
    getCurrentSite() {
      this.$router.push({ name: "tags" });
    }
  },
  async created() {
    try {
      this.loading = true;
      this.tag = await TagsService.fetchTagById(this.tagId);
      this.products = await this.fetchProducts(false, "");
      this.targetProducts = await this.fetchProducts(true, "");
      this.loading = false;
    } catch (e) {
      this.$router.push({ name: "tags" });
    }
  },

  methods: {
    async fetchProducts(alreadyRelated, pattern) {
      let res = await TagsService.fetchProductsForTagBySite(
        this.tagId,
        alreadyRelated,
        pattern,
        999999,
        { only: ["id", "name"] }
      );
      return res.reduce((obj, curr) => {
        obj[curr.id] = {
          id: curr.id,
          name: curr.name,
          checked: false,
          toBold: pattern,
          parentName: "AdminTagEdit"
        };
        return obj;
      }, {});
    },
    async handleSearch() {
      this.debounce(async () => {
        try {
          this.isSearchLoading = true;
          const value = this.searchName;
          this.products = await this.fetchProducts(false, value);
          this.targetProducts = await this.fetchProducts(true, value);
          this.selectAllChecked.left = false;
          this.selectAllChecked.right = false;
          // handle additions / removals
          Object.values(this.additions).forEach(p => {
            if (p.name.match(new RegExp(value, "gi"))) {
              this.targetProducts[p.id] = p;
              this.targetProducts[p.id].checked = false;
              this.targetProducts[p.id].toBold = value;
              if (this.products.hasOwnProperty(p.id.toString())) {
                delete this.products[p.id];
              }
            }
          });
          Object.values(this.removals).forEach(p => {
            if (p.name.match(new RegExp(value, "gi"))) {
              this.products[p.id] = p;
              this.products[p.id].checked = false;
              this.products[p.id].toBold = value;
              if (this.targetProducts.hasOwnProperty(p.id.toString())) {
                delete this.targetProducts[p.id];
              }
            }
          });
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
          if (Object.keys(this.removals).includes(p.id.toString())) {
            delete this.removals[p.id];
          } else {
            this.additions[p.id] = p;
          }
          this.targetProducts[p.id] = p;
          this.targetProducts[p.id].checked = false;
          delete this.products[p.id];
        });
        this.selectAllChecked.left = false;
      } else {
        const selected = Object.values(this.targetProducts).filter(
          p => p.checked
        );
        selected.forEach(p => {
          if (Object.keys(this.additions).includes(p.id.toString())) {
            delete this.additions[p.id];
          } else {
            this.removals[p.id] = p;
          }
          this.products[p.id] = p;
          this.products[p.id].checked = false;
          delete this.targetProducts[p.id];
        });
        this.selectAllChecked.right = false;
      }
    },
    handleSubmit() {
      this.form.validateFieldsAndScroll(async (err, updatedTagData) => {
        if (!err) {
          let productIds = [...this.tag.products];
          this.saving = true;
          productIds = productIds.filter(
            id => !Object.keys(this.removals).includes(id.toString())
          );
          productIds = [
            ...new Set([
              ...productIds,
              ...Object.keys(this.additions).map(id => parseInt(id))
            ])
          ];
          await TagsService.updateTag(this.tag, {
            name: updatedTagData.name,
            products: productIds,
            is_tag_grouper: updatedTagData.isTagGrouper
          });
          this.saving = false;
          this.$router.push({ name: "tags" });
          NotificationService.success(this.$t("updateSuccess"));
        } else {
          NotificationService.error(this.$t("updateError"));
        }
      });
    },
    async confirmDelete() {
      await TagsService.deleteTag(this.tag);
      NotificationService.success(this.$t("deleteSuccess"));
      this.$router.push({ name: "tags" });
    },
    toggleTagGrouper() {
      this.tag.isTagGrouper = !this.tag.isTagGrouper;
    }
  }
};
</script>
