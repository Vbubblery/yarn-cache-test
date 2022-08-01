<i18n>
{
  "en": {
    "product": "Product",
    "addProduct": "Add Product",
    "coeff": "Coeff x demand",
    "addProducts": "Add former similar products",
    "addPromotion": "Add Promotion",
    "addSuppliers": "Add suppliers",
    "addTag": "Add Tag",
    "alternativeProduct": "Similar products",
    "back" : "all products",
    "cancel": "Cancel",
    "constraints": "Product Constraints",
    "create": "Create",
    "dangerZone": "Danger Zone",
    "defaultUnit": "Default unit",
    "delete": "Delete",
    "deleteDescription": "Delete this product",
    "deleteQuestion": "Are you sure you want to delete this product?",
    "demandStorage": "Main consumption storage",
    "description": "Description",
    "egUnits": "(e.g. Kg, L)",
    "endOfProduction":"End of production",
    "endOfSale":"End of sale",
    "errorDefaultValue": "Please add a default unit value",
    "errorExtId": "Please add the reference",
    "errorName": "Please add a product name",
    "errorSecondaryName": "Please add a secondary unit name",
    "errorSecondaryValue": "Please add a secondary unit value",
    "errorSuppliers": "Please add at least one supplier",
    "externalId": "Ref",
    "fixedLotSize":"Fixed lot size",
    "goToPromotions": "Go to promotions",
    "goToTags": "Go to tags",
    "hasSecondaryUnit": "The product has a secondary unit",
    "leadTime": "Lead time",
    "missingRequiredFieldsError": "Missing or invalid fields",
    "moq":"Minimum order quantity",
    "tagGrouper": "Tags for order grouping",
    "name": "Name",
    "nonAdminWarningText": "Please contact your admin for any modification",
    "price": "Price",
    "productCreateSuccess": "Product successfully added",
    "productDeleteSuccess": "Product successfully deleted",
    "productLifeCycle": "Product life cycle",
    "productUpdateSuccess": "Product successfully updated",
    "remove": "Remove",
    "save": "Save",
    "secondaryUnit": "Secondary unit",
    "selectASupplier": "Select a supplier",
    "serviceLevel": "Service Level (0-100%)",
    "startOfProduction": "Start of production",
    "startOfSale": "Start of sale",
    "storages": "Storage sites",
    "suppliers": "Suppliers",
    "supplyStorage": "Main supply storage",
    "title": "Edit the product",
    "titleNew": "Create a new product",
    "value": "Value",
    "units": "Units",
    "replacedBy": "New products linked",
    "shelfLife": "Shelf life (days)"
  },
  "fr": {
    "product": "Produit",
    "coeff": "Coeff x demande",
    "addProduct": "Ajouter produit",
    "addProducts": "Ajoutez des anciens produits similaires",
    "addPromotion": "Créer Promotion",
    "addSuppliers": "Ajoutez des fournisseurs",
    "addTag": "Créer Tag",
    "alternativeProduct": "Produits similaires",
    "back" : "retour",
    "cancel": "Annuler",
    "constraints": "Contraintes produits",
    "create": "Créer",
    "dangerZone": "Zone de danger",
    "defaultUnit": "Unité par défaut",
    "delete": "Supprimer",
    "deleteDescription": "Supprimer ce produit",
    "deleteQuestion": "Êtes-vous sûr de vouloir supprimer ce produit ?",
    "demandStorage": "Stockage principale de consommation",
    "description": "Description",
    "egUnits": "(e.g. Kg, L )",
    "endOfProduction":"Fin de production",
    "endOfSale":"Fin de vente",
    "errorDefaultValue": "Ajoutez une unité par défaut",
    "errorExtId": "Veuillez ajouter la référence produit",
    "errorName": "Ajoutez un nom",
    "errorSecondaryName": "Ajoutez une unité secondaire",
    "errorSecondaryValue": "Ajoutez une unité secondaire",
    "errorSuppliers": "Ajoutez au moins un fournisseur",
    "externalId": "Ref",
    "fixedLotSize":"Taille de lot fixe",
    "goToPromotions": "Aller aux promotions",
    "goToTags": "Aller aux tags",
    "hasSecondaryUnit": "Le produit a une unité secondaire",
    "leadTime": "Temps d'appro",
    "missingRequiredFieldsError": "Champs manquants ou incorrects",
    "moq":"Qte min de commande",
    "tagGrouper": "Tags pour regrouper les commandes",
    "name": "Nom",
    "nonAdminWarningText": "Veuillez contacter votre admin pour tout besoin de modification",
    "price": "Prix",
    "productCreateSuccess": "Produit ajouté avec succès",
    "productDeleteSuccess": "Produit supprimé avec succès",
    "productLifeCycle": "Cycle de vie",
    "productUpdateSuccess": "Produit mis à jour avec succès",
    "remove": "Supprimer",
    "save": "Valider",
    "secondaryUnit": "Unité secondaire",
    "selectASupplier": "Sélectionnez un fournisseur",
    "serviceLevel": "Niveau de service (0-100%)",
    "startOfProduction": "Début de production",
    "startOfSale": "Début de vente",
    "storages": "Points de stockage",
    "suppliers": "Fournisseurs",
    "supplyStorage": "Stockage principale de livraison",
    "title": "Editer le produit",
    "titleNew": "Créer un nouveau produit",
    "value": "Valeur",
    "units": "Unités",
    "replacedBy": "Nouveaux produits liés",
    "shelfLife": "Durée de vie (jours)"
  }
}
</i18n>

<template>
  <div class="bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div
        class="w-full max-w-3xl relative bg-white px-12 py-10 rounded-lg shadow-2xl"
      >
        <router-link
          :to="{ name: 'products' }"
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

        <p v-if="productId" class="text-gray-800 font-bold text-xl mb-12">
          {{ $t("title") }}
        </p>
        <p v-else class="text-gray-800 font-bold text-xl mb-12">
          {{ $t("titleNew") }}
        </p>
        <div v-if="!product" class="flex justify-center items-center">
          <base-dot-loader />
        </div>
        <div v-else>
          <p class="text-xl font-bold mb-4">
            {{ $t("externalId") }}: {{ product.externalId }}
          </p>
          <a-alert
            v-if="!getMe.canAccess(['productsite:write'])"
            :message="$t('nonAdminWarningText')"
            banner
            closable
          />
          <ul class="flex border-b mb-4 select-none">
            <li :class="isActiveTab('info')">
              <a @click="activeTab = 'info'">Info</a>
            </li>
            <li :class="isActiveTab('promotions')">
              <a @click="activeTab = 'promotions'">Promotions</a>
            </li>
            <li :class="isActiveTab('tags')">
              <a @click="activeTab = 'tags'">Tags</a>
            </li>
            <li :class="isActiveTab('alternativeProduct')">
              <a @click="activeTab = 'alternativeProduct'">
                {{ $t("alternativeProduct") }}
              </a>
            </li>
            <li v-if="storageOptions.length" :class="isActiveTab('storages')">
              <a @click="activeTab = 'storages'">{{ $t("storages") }}</a>
            </li>
            <li :class="isActiveTab('suppliers')">
              <a @click="activeTab = 'suppliers'">{{ $t("suppliers") }}</a>
            </li>
          </ul>
          <a-form :form="form" @submit="handleSubmit">
            <div v-show="activeTab === 'info'">
              <p class="m-0 text-gray-600">
                {{ $t("externalId") }}
              </p>
              <a-form-item>
                <!-- disable when not admin, or when editing and value already set -->
                <a-input
                  v-decorator="[
                    'externalId',
                    {
                      initialValue: product.externalId,
                      rules: [{ required: true, message: $t(`errorExtId`) }]
                    }
                  ]"
                  :disabled="
                    !getMe.canAccess(['productsite:write']) ||
                    (productId != null && product.externalId != null)
                  "
                  @pressEnter="handleSubmit"
                  @change="handleStringChange"
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
                      initialValue: product.name,
                      rules: [{ required: true, message: $t(`errorName`) }]
                    }
                  ]"
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  @change="handleStringChange"
                  @pressEnter="handleSubmit"
                />
              </a-form-item>

              <p class="m-0 text-gray-600">
                {{ $t("description") }}
              </p>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'description',
                    {
                      initialValue: product.description
                    }
                  ]"
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  @pressEnter="handleSubmit"
                  @change="handleStringChange"
                />
              </a-form-item>

              <p v-if="getMe.superAdmin" class="m-0 text-gray-600">
                {{ $t("serviceLevel") }}
              </p>
              <a-form-item v-if="getMe.superAdmin">
                <a-input
                  v-decorator="[
                    'serviceLevel',
                    {
                      initialValue: Math.round(product.serviceLevel * 100)
                    }
                  ]"
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  @pressEnter="handleSubmit"
                  @change="handleServiceLevelChange"
                />
              </a-form-item>

              <p v-if="getMe.admin" class="m-0 text-gray-600">
                {{ $t("shelfLife") }}
              </p>
              <a-form-item v-if="getMe.admin">
                <a-input
                  v-decorator="[
                    'shelfLife',
                    {
                      initialValue: product.shelfLife
                    }
                  ]"
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  type="number"
                  min="0"
                  @change="handleShefLifeChange"
                  @pressEnter="handleSubmit"
                />
              </a-form-item>

              <a-collapse
                class="bg-white"
                default-active-key="units"
                :bordered="false"
              >
                <!-- units -->
                <a-collapse-panel
                  key="units"
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
                      {{ $t("units") }}
                    </span>
                  </template>
                  <div
                    style="
                      display: grid;
                      grid-template-columns: 1fr 3fr;
                      grid-gap: 10px;
                    "
                  >
                    <div>
                      <p class="m-0 text-gray-600">
                        {{ $t("value") }}
                      </p>
                      <a-form-item class="mb-2">
                        <a-input
                          v-decorator="[
                            'defaultUnitValue',
                            {
                              initialValue: product.units.defaultUnitValue,
                              rules: [
                                {
                                  required: true,
                                  message: $t(`errorDefaultValue`)
                                }
                              ]
                            }
                          ]"
                          class="text-right"
                          :disabled="!getMe.canAccess(['productsite:write'])"
                          type="number"
                          step="any"
                          min="0"
                          :placeholder="1"
                          @pressEnter="handleSubmit"
                          @change="handleUnitsChange(false, $event)"
                        />
                      </a-form-item>
                    </div>
                    <div>
                      <p class="m-0 text-gray-600">
                        {{ $t("defaultUnit") }}
                      </p>
                      <a-form-item class="mb-2">
                        <a-input
                          v-decorator="[
                            'defaultUnitName',
                            {
                              initialValue: product.units.defaultUnitName
                            }
                          ]"
                          :disabled="!getMe.canAccess(['productsite:write'])"
                          :placeholder="$t('egUnits')"
                          @pressEnter="handleSubmit"
                          @change="handleUnitsChange(true, $event)"
                        />
                      </a-form-item>
                    </div>
                  </div>
                  <a-form-item class="m-0">
                    <a-checkbox
                      v-model="hasSecondaryUnit"
                      v-decorator="['hasSecondaryUnit']"
                      :disabled="!getMe.canAccess(['productsite:write'])"
                      @click="toggleSecondaryUnit"
                    >
                      <span class="m-0 text-gray-600">{{
                        $t("hasSecondaryUnit")
                      }}</span>
                    </a-checkbox>
                  </a-form-item>
                  <div v-if="hasSecondaryUnit">
                    <div
                      style="
                        display: grid;
                        grid-template-columns: 1fr 3fr;
                        grid-gap: 10px;
                      "
                    >
                      <div>
                        <p class="m-0 text-gray-600">
                          {{ $t("value") }}
                        </p>
                        <a-form-item class="mb-2">
                          <a-input
                            v-decorator="[
                              'secondaryUnitValue',
                              {
                                initialValue: product.units.secondaryUnitValue,
                                rules: [
                                  {
                                    required: true,
                                    message: $t(`errorSecondaryValue`)
                                  }
                                ]
                              }
                            ]"
                            class="text-right"
                            :disabled="!getMe.canAccess(['productsite:write'])"
                            type="number"
                            step="any"
                            min="0"
                            :placeholder="1"
                            @pressEnter="handleSubmit"
                            @change="handleUnitsChange(false, $event)"
                          />
                        </a-form-item>
                      </div>
                      <div>
                        <p class="m-0 text-gray-600">
                          {{ $t("secondaryUnit") }}
                        </p>
                        <a-form-item class="mb-2">
                          <a-input
                            v-decorator="[
                              'secondaryUnitName',
                              {
                                initialValue: product.units.secondaryUnitName,
                                rules: [
                                  {
                                    required: true,
                                    message: $t(`errorSecondaryName`)
                                  }
                                ]
                              }
                            ]"
                            :disabled="!getMe.canAccess(['productsite:write'])"
                            :placeholder="$t('egUnits')"
                            @pressEnter="handleSubmit"
                            @change="handleUnitsChange(true, $event)"
                          />
                        </a-form-item>
                      </div>
                    </div>
                    <div
                      class="bg-gray-300 p-2 rounded flex justify-center w-full text-center"
                    >
                      <span class="text-gray-700 font-bold">
                        {{
                          product.units.defaultUnitValue
                            ? product.units.defaultUnitValue
                            : 1
                        }}
                        {{
                          product.units.defaultUnitName
                            ? product.units.defaultUnitName
                            : $t("egUnits")
                        }}
                        =
                        {{
                          product.units.secondaryUnitValue
                            ? product.units.secondaryUnitValue
                            : 1
                        }}
                        {{
                          product.units.secondaryUnitName
                            ? product.units.secondaryUnitName
                            : $t("egUnits")
                        }}
                      </span>
                    </div>
                    <div class="pt-2">
                      <span class="m-0 text-gray-600 pr-2">Display Unit</span>
                      <a-radio-group
                        v-model="product.isDefaultUnit"
                        button-style="solid"
                      >
                        <a-radio-button :value="true">
                          {{ product.units.defaultUnitName || "default unit" }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                          {{
                            product.units.secondaryUnitName || "secondary unit"
                          }}
                        </a-radio-button>
                      </a-radio-group>
                    </div>
                  </div>
                </a-collapse-panel>
                <!-- Production & sale dates -->
                <a-collapse-panel
                  key="productionSaleDates"
                  :style="'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'"
                >
                  <template #header>
                    <span class="m-0 text-gray-600">
                      {{ $t("productLifeCycle") }}
                    </span>
                  </template>
                  <div
                    style="
                      display: grid;
                      grid-template-columns: 2fr 2fr;
                      grid-gap: 10px;
                    "
                  >
                    <div>
                      <p class="m-0 text-gray-600">
                        {{ $t("startOfProduction") }}
                      </p>
                      <a-date-picker
                        v-model="startProductionValue"
                        :disabled-date="disabledProductionStartDate"
                        allow-clear
                        format="DD/MM/YYYY"
                        placeholder="SOP"
                      />
                    </div>
                    <div>
                      <p class="m-0 text-gray-600">
                        {{ $t("endOfProduction") }}
                      </p>
                      <a-date-picker
                        v-model="endProductionValue"
                        :disabled-date="disabledProductionEndDate"
                        allow-clear
                        format="DD/MM/YYYY"
                        placeholder="EOP"
                      />
                    </div>
                    <div>
                      <p class="m-0 text-gray-600">
                        {{ $t("startOfSale") }}
                      </p>
                      <a-date-picker
                        v-model="startSaleValue"
                        :disabled-date="disabledSaleStartDate"
                        allow-clear
                        format="DD/MM/YYYY"
                        placeholder="SOS"
                      />
                    </div>
                    <div>
                      <p class="m-0 text-gray-600">
                        {{ $t("endOfSale") }}
                      </p>
                      <a-date-picker
                        v-model="endSaleValue"
                        :disabled-date="disabledSaleEndDate"
                        allow-clear
                        format="DD/MM/YYYY"
                        placeholder="EOS"
                      />
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
            <!-- promotions -->
            <div v-show="activeTab === 'promotions'">
              <p class="text-xl font-bold mb-4">Promotions</p>
              <a-form-item>
                <a-select
                  v-decorator="[
                    'promotions',
                    {
                      initialValue: product.promotions,
                      rules: [{ required: false, message: $t(`errorName`) }]
                    }
                  ]"
                  mode="multiple"
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  :options="promotions"
                  class="w-full"
                  @change="handlePromotionChange"
                />
              </a-form-item>
              <router-link
                v-if="getMe.canAccess(['productsite:write'])"
                :to="{ name: 'newPromotion' }"
              >
                <BaseButton icon="add-line-alt">
                  {{ $t("addPromotion") }}
                </BaseButton>
              </router-link>
            </div>
            <!-- tags -->
            <div v-show="activeTab === 'tags'">
              <p class="text-xl font-bold mb-4">Tags</p>
              <a-form-item>
                <a-select
                  v-decorator="[
                    'tags',
                    {
                      initialValue: product.tags,
                      rules: [{ required: false, message: $t(`errorName`) }]
                    }
                  ]"
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  mode="multiple"
                  :options="tags"
                  class="w-full"
                  @change="handleTagChange"
                />
              </a-form-item>
              <router-link
                v-if="getMe.canAccess(['productsite:write'])"
                :to="{ name: 'newTag' }"
              >
                <BaseButton icon="add-line-alt">
                  {{ $t("addTag") }}
                </BaseButton>
              </router-link>
            </div>
            <!-- lookALikes & be replaced -->
            <div v-show="activeTab === 'alternativeProduct'">
              <p class="text-xl font-bold mb-1">
                {{ $t("alternativeProduct") }}
              </p>
              <p class="mb-4 text-gray-600">
                {{ $t("addProducts") }}
              </p>
              <div
                v-for="(pid, idx) in similarProducts.lookALikes"
                :key="pid"
                class="flex items-center mb-4"
              >
                <p class="whitespace-nowrap mr-2">{{ $t("coeff") }}:</p>
                <a-input
                  v-model="similarProducts.lookALikesCoeff[idx]"
                  type="number"
                  step="any"
                  min="0"
                  :placeholder="1"
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  class="basis-20 mr-4"
                  @pressEnter="handleSubmit"
                  @change="handleLookALikesCoeffSelectChange($event, idx)"
                />
                <p class="whitespace-nowrap mr-2">{{ $t("product") }}:</p>
                <a-select
                  v-model="similarProducts.lookALikes[idx]"
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  show-search
                  :options="filterProductsList(similarProducts.lookALikes[idx])"
                  :get-popup-container="getPopupContainer"
                  :filter-option="false"
                  :not-found-content="null"
                  :allow-clear="true"
                  :dropdown-match-select-width="false"
                  dropdown-class-name="similar-product-dropdown"
                  class="flex-1 mr-4 overflow-hidden"
                  @change="handleLookALikesSelectChange($event, idx)"
                  @search="handleLookALikesProductsSearch"
                />
                <BaseSVG
                  name="indeterminate-circle-line"
                  class="cursor-pointer text-gray-500"
                  @click="removeLookAlikeProduct(idx)"
                />
              </div>

              <div
                class="p-2 flex justify-center items-center text-center cursor-pointer border rounded border-gray-400 hover:border-gray-600"
                @click="addSimilarProductsCounter"
              >
                <BaseSVG name="add-line-alt" class="mr-2" />
                {{ $t("addProduct") }}
              </div>
              <div v-if="replacedByProductsList.length > 0" class="pt-3">
                <p class="m-0 text-gray-600">
                  {{ $t("replacedBy") }}
                </p>
                <a-tag
                  v-for="replaceable in replacedByProductsList"
                  :key="replaceable"
                >
                  {{ replaceable }}
                </a-tag>
              </div>
            </div>
            <!-- default storage sites by product -->
            <div v-show="activeTab === 'storages'">
              <p class="text-xl font-bold mb-4">
                {{ $t("storages") }}
              </p>
              <p class="m-0 text-gray-600">
                {{ $t("supplyStorage") }}
              </p>
              <a-form-item>
                <a-select
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  :value="product.defaultSupplyStorage"
                  show-search
                  class="w-full"
                  :options="storageOptions"
                  :get-popup-container="getPopupContainer"
                  :filter-option="dropdownFilterOption"
                  @change="handleDefaultSupplyStorageChange"
                />
              </a-form-item>
              <p class="m-0 text-gray-600">
                {{ $t("demandStorage") }}
              </p>
              <a-form-item>
                <a-select
                  :disabled="!getMe.canAccess(['productsite:write'])"
                  :value="product.defaultDemandStorage"
                  show-search
                  class="w-full"
                  :options="storageOptions"
                  :get-popup-container="getPopupContainer"
                  :filter-option="dropdownFilterOption"
                  @change="handleDefaultDemandStorageChange"
                />
              </a-form-item>
            </div>

            <!-- supplier specific info -->
            <div v-show="activeTab === 'suppliers'">
              <div v-if="showSuppliersTab">
                <p class="text-xl font-bold mb-4">
                  {{ $t("suppliers") }}
                </p>
                <p class="m-0 text-gray-600">
                  {{ $t("addSuppliers") }}
                </p>
                <!-- {{ suppliers }} -->
                <a-form-item>
                  <a-select
                    v-decorator="[
                      'suppliers',
                      {
                        initialValue: suppliers
                      }
                    ]"
                    show-search
                    mode="multiple"
                    class="w-full"
                    :disabled="!getMe.canAccess(['productsite:write'])"
                    :placeholder="$t('selectASupplier')"
                    :filter-option="false"
                    :not-found-content="null"
                    :allow-clear="true"
                    :options="allSuppliers"
                    @change="handleSelectedSuppliers"
                    @search="handleSuppliersSearch"
                  />
                </a-form-item>

                <div
                  v-for="supplierId in suppliers"
                  :key="supplierId"
                  class="border rounded-lg p-2 mt-8"
                >
                  <div class="flex justify-between items-center mb-4">
                    <p
                      v-if="allSuppliersMap[supplierId]"
                      class="text-lg font-bold m-0"
                    >
                      {{ allSuppliersMap[supplierId].name }}
                    </p>
                    <BaseButton
                      v-if="getMe.canAccess(['productsite:write'])"
                      type="secondary"
                      @click="removeProductSupplierlink(supplierId)"
                    >
                      {{ $t("remove") }}
                    </BaseButton>
                  </div>
                  <!-- price supplier level -->
                  <p class="m-0 text-gray-600">
                    {{ $t("price") }}
                  </p>
                  <a-form-item class="mb-2">
                    <a-input
                      v-decorator="[
                        `${supplierId}#price`,
                        { initialValue: supplierLinks[supplierId].price }
                      ]"
                      :disabled="!getMe.canAccess(['productsite:write'])"
                      type="number"
                      step="any"
                      min="0"
                      @pressEnter="handleSubmit"
                      @change="
                        handleProductSupplierLinksChange(
                          false,
                          $event,
                          supplierId
                        )
                      "
                    />
                  </a-form-item>

                  <!-- leadtime supplier level -->
                  <p class="m-0 text-gray-600">
                    {{ $t("leadTime") }}
                  </p>
                  <a-form-item class="mb-2">
                    <a-input
                      v-decorator="[
                        `${supplierId}#leadTime`,
                        { initialValue: supplierLinks[supplierId].leadTime }
                      ]"
                      :disabled="!getMe.canAccess(['productsite:write'])"
                      type="number"
                      min="0"
                      @pressEnter="handleSubmit"
                      @change="
                        handleProductSupplierLinksChange(
                          false,
                          $event,
                          supplierId
                        )
                      "
                    />
                  </a-form-item>
                  <!-- moq supplier level -->
                  <p class="m-0 text-gray-600">
                    {{ $t("moq") }}
                  </p>
                  <a-form-item class="mb-2">
                    <a-input
                      v-decorator="[
                        `${supplierId}#moq`,
                        { initialValue: supplierLinks[supplierId].moq }
                      ]"
                      :disabled="!getMe.canAccess(['productsite:write'])"
                      type="number"
                      step="any"
                      min="0"
                      @pressEnter="handleSubmit"
                      @change="
                        handleProductSupplierLinksChange(
                          false,
                          $event,
                          supplierId
                        )
                      "
                    />
                  </a-form-item>
                  <!-- lot size product site level -->
                  <p class="m-0 text-gray-600">
                    {{ $t("fixedLotSize") }}
                  </p>
                  <a-form-item class="mb-2">
                    <a-input
                      v-decorator="[
                        `${supplierId}#fixedLotSize`,
                        {
                          initialValue: supplierLinks[supplierId].fixedLotSize
                        }
                      ]"
                      :disabled="!getMe.canAccess(['productsite:write'])"
                      type="number"
                      step="any"
                      min="0"
                      @pressEnter="handleSubmit"
                      @change="handleFixedLotSizeChange($event, supplierId)"
                    />
                  </a-form-item>
                  <!-- ratio supplier level -->
                  <p class="m-0 text-gray-600">Ratio (0-100%)</p>
                  <a-form-item class="mb-2">
                    <a-input
                      v-decorator="[
                        `${supplierId}#ratio`,
                        { initialValue: supplierLinks[supplierId].ratio * 100 }
                      ]"
                      :disabled="!getMe.canAccess(['productsite:write'])"
                      type="number"
                      min="0"
                      max="100"
                      @pressEnter="handleSubmit"
                      @change="
                        handleProductSupplierLinksRatioChange(
                          $event,
                          supplierId
                        )
                      "
                    />
                  </a-form-item>
                  <!-- tagGrouper supplier level -->
                  <p class="m-0 text-gray-600">
                    {{ $t("tagGrouper") }}
                  </p>
                  <a-form-item class="mb-2">
                    <a-select
                      v-decorator="[
                        `${supplierId}#tagGrouper`,
                        {
                          initialValue: supplierLinks[supplierId].tagGrouper.id
                        }
                      ]"
                      :disabled="!getMe.canAccess(['productsite:write'])"
                      allow-clear
                      show-search
                      :dropdown-match-select-width="false"
                      :filter-option="filterTagGrouperOption"
                      :options="grouperTagsList"
                      @change="handleTagGrouperChange($event, supplierId)"
                    />
                  </a-form-item>
                </div>
              </div>
            </div>

            <a-form-item class="mt-12">
              <div class="flex justify-between">
                <div class="flex space-x-2">
                  <BaseButton
                    v-if="getMe.canAccess(['productsite:write'])"
                    type="primary"
                    :loading="saving"
                    @click="handleSubmit"
                  >
                    {{ $t("save") }}
                  </BaseButton>
                  <BaseButton
                    type="secondary"
                    @click="$router.push({ name: 'products' })"
                  >
                    {{ $t("cancel") }}
                  </BaseButton>
                </div>
                <a-popconfirm @confirm="launchDeleteProduct">
                  <template #title>
                    <p class="m-0">
                      {{ $t("deleteDescription") }}
                    </p>
                    <p class="m-0">
                      {{ $t("deleteQuestion") }}
                    </p>
                  </template>
                  <BaseButton
                    v-if="getMe.permissions.includes('productsite:delete')"
                    type="danger"
                  >
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
import dayjs from "@/dayjs";
import debounceMixin from "@/helper/debounceMixin";
import NotificationService from "@/services/notification.service";
import { Product } from "@/objects/product";
import PartnersService from "@/services/partners.service";
import ProductsService from "@/services/products.service";
import PromotionsService from "@/services/promotions.service";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import {
  Form,
  Input,
  Checkbox,
  Collapse,
  Select,
  Tag,
  DatePicker,
  Popconfirm,
  Alert,
  Radio
} from "ant-design-vue";
import BaseDotLoader from "@/components/contents/common/BaseDotLoader.vue";
import TagsService from "@/services/tags.service";

export default {
  name: "AdminProductEdit",
  components: {
    BaseButton,
    BaseSVG,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-checkbox": Checkbox,
    "a-collapse": Collapse,
    "a-collapse-panel": Collapse.Panel,
    "a-select": Select,
    "a-tag": Tag,
    "a-date-picker": DatePicker,
    "a-popconfirm": Popconfirm,
    "a-alert": Alert,
    "base-dot-loader": BaseDotLoader,
    "a-radio-group": Radio.Group,
    "a-radio-button": Radio.Button
  },
  mixins: [debounceMixin],
  props: {
    productId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: Form.createForm(this),
      activeTab: "info",
      modalIsVisible: false,
      saving: false,
      showSuppliersTab: false,
      allSuppliers: [],
      allSuppliersMap: {},
      suppliers: [],
      supplierLinks: {},
      startProductionValue: null,
      endProductionValue: null,
      startSaleValue: null,
      endSaleValue: null,
      product: null,
      productsList: [],
      replacedByProductsList: [],
      tags: [],
      grouperTagsList: [],
      promotions: [],
      hasSecondaryUnit: false,
      similarProducts: {
        lookALikes: [],
        lookALikesCoeff: []
      }
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite", "getMe"]),
    storageOptions() {
      return this.getCurrentSite.storages.map(s => {
        return { label: s.name, value: s.id, key: s.name };
      });
    }
  },
  watch: {
    getCurrentSite() {
      this.$router.push({ name: "products" });
    }
  },
  async created() {
    if (this.productId) {
      // fetch product for editing
      try {
        const product = await ProductsService.getSiteProductById(
          this.productId,
          {
            only: [
              "id",
              "external_id",
              "name",
              "description",
              "production_start_at",
              "production_end_at",
              "sale_start_at",
              "sale_end_at",
              "is_default_unit",
              "default_unit_name",
              "default_unit_value",
              "secondary_unit_name",
              "secondary_unit_value",
              "service_level",
              "shelf_life",
              "promotions",
              "tags",
              "look_alikes",
              "default_demand_storage_site",
              "default_supply_storage_site",
              "product_supplier_link",
              "replaced_by"
            ]
          }
        );
        this.hasSecondaryUnit = !!product.units.secondaryUnitName;
        this.product = product;
        this.product.lookALikes.forEach(o => {
          this.similarProducts.lookALikesCoeff.push(o.coefficient);
          this.productsList.push(this.productTransform(o.source));
          this.similarProducts.lookALikes.push(o.source.id);
        });
      } finally {
        if (!this.product) this.$router.push({ name: "products" });
      }
    } else {
      // create new product
      this.product = Product.create({
        site: this.getCurrentSite.id,
        service_level: 0.98
      });
    }

    // fetch replacedBy products names
    if (this.product.replacedBy.length > 0) {
      this.product.replacedBy.forEach(async o => {
        const product = await ProductsService.getSiteProductById(o.target_id, {
          only: ["name"]
        });
        this.replacedByProductsList.push(product.name);
      });
    }

    // fetch similar products options list
    const products = await ProductsService.fetchProducts(
      {
        pattern: ""
      },
      {
        only: ["id", "name", "external_id"],
        include_unused: true
      }
    );
    // Avoid having twice the same product in the list
    (products || []).forEach(product => {
      if (
        this.productsList.findIndex(
          existingProduct => existingProduct.key === product.id
        ) < 0
      )
        this.productsList.push(this.productTransform(product));
    });

    // fetch grouper tags options list
    const grouperTagsList = await TagsService.fetchTags({
      isAllCompanyTags: true,
      productSiteId: this.productId,
      isTagGrouper: true,
      perPage: 99999
    });
    this.grouperTagsList = (Object.values(grouperTagsList) || []).map(
      this.tagTransform
    );
    await this.searchSuppliers("");
    this.showSuppliersTab = Object.keys(this.allSuppliersMap).length > 0;

    this.processProduct();

    if (!this.promotions.length) {
      try {
        const promotions = await PromotionsService.getPromotions();
        this.promotions = (Object.values(promotions) || []).map(
          this.promoTransform
        );

        (this.product.promotions || [])
          .filter(id => !promotions[id])
          .forEach(async id => {
            const promo = await PromotionsService.fetchPromotionById(id);
            this.promotions.push(this.promoTransform(promo));
          });
      } catch (e) {
        NotificationService.error(e.message);
      }
    }
    if (!this.tags.length) {
      try {
        const tags = await TagsService.fetchTags({ isAllCompanyTags: true });
        this.tags = (Object.values(tags) || []).map(this.tagTransform);

        (this.product.tags || [])
          .filter(id => !tags[id])
          .forEach(async id => {
            const tag = await TagsService.fetchTagById(id, {
              only: ["id", "name"]
            });
            this.tags.push(this.tagTransform(tag));
          });
      } catch (e) {
        NotificationService.error(e.message);
      }
    }
  },
  methods: {
    addSimilarProductsCounter() {
      this.similarProducts.lookALikes.push(null);
      this.similarProducts.lookALikesCoeff.push(1);
    },
    filterProductsList(lookALikeIdToKeep) {
      // Remove all the lookALikes that are previously selected
      // except the current one (lookALikeIdTokeep) to keep the display of the name
      return this.productsList.filter(product => {
        const duplicateIdx = this.similarProducts.lookALikes.findIndex(
          lookALikeId => lookALikeId === product.key
        );
        return (
          duplicateIdx < 0 ||
          this.similarProducts.lookALikes[duplicateIdx] === lookALikeIdToKeep
        );
      });
    },
    isActiveTab(tabName) {
      return this.activeTab === tabName ? "activeTab" : "inactiveTab";
    },
    processProduct() {
      this.supplierLinks = {};
      this.product.productSupplierLinks.forEach(link => {
        if (link.isSupplier) {
          this.supplierLinks[link.partnerId] = link;
          this.suppliers.push(link.partnerId);
          if (!this.allSuppliersMap[link.partnerId]) {
            this.allSuppliersMap[link.partnerId] = link.partner;
            this.allSuppliers.push(this.partnerTransform(link.partner));
          }
        }
      });

      if (this.product.productionDate?.start) {
        this.startProductionValue = dayjs(this.product.productionDate.start);
      }
      if (this.product.productionDate?.end) {
        this.endProductionValue = dayjs(this.product.productionDate.end);
      }
      if (this.product.saleDate?.start) {
        this.startSaleValue = dayjs(this.product.saleDate.start);
      }
      if (this.product.saleDate?.end) {
        this.endSaleValue = dayjs(this.product.saleDate.end);
      }
    },
    toggleModal() {
      this.modalIsVisible = !this.modalIsVisible;
    },
    toggleSecondaryUnit() {
      this.product.units.hasSecondaryUnit =
        !this.product.units.hasSecondaryUnit;
    },
    handleUnitsChange(isString, e) {
      this.product.units[e.target.id] = isString
        ? e.target.value
        : parseFloat(e.target.value);
    },
    handleFixedLotSizeChange(e, supplierId) {
      const val = parseInt(e.target.value);
      this.supplierLinks[supplierId][e.target.id.match(/#(.*)/i)[1]] = val;
    },
    handleServiceLevelChange(e) {
      this.product.serviceLevel = parseFloat(e.target.value / 100);
    },
    handleShefLifeChange(e) {
      this.product.shelfLife = parseInt(e.target.value);
    },
    handleStringChange(e) {
      this.product[e.target.id] = e.target.value;
    },
    handleProductSupplierLinksRatioChange(e, supplierId) {
      let val = parseFloat(e.target.value / 100);
      this.supplierLinks[supplierId][e.target.id.match(/#(.*)/i)[1]] = val;
    },
    handleProductSupplierLinksChange(isString, e, supplierId) {
      let val = isString ? e.target.value : parseFloat(e.target.value);
      this.supplierLinks[supplierId][e.target.id.match(/#(.*)/i)[1]] = val;
    },
    removeProductSupplierlink(supplierId) {
      let index = this.suppliers.findIndex(id => id === supplierId);
      if (index >= 0) {
        this.suppliers.splice(index, 1);
        delete this.supplierLinks[supplierId];
      }
    },
    handleSelectedSuppliers(suppliers) {
      this.suppliers = suppliers;

      // append new selected
      (suppliers || [])
        .filter(s => !this.supplierLinks[s])
        .forEach(id => {
          this.supplierLinks[id] = {
            partnerId: id,
            product: this.product.id,
            tagGrouper: { id: null },
            ratio: 1,
            price: 1
          };
        });

      // remove unselected
      (Object.keys(this.supplierLinks) || [])
        .filter(id => !suppliers.includes(parseInt(id)))
        .forEach(id => delete this.supplierLinks[id]);
    },
    handleLookALikesSelectChange(value, idx) {
      this.similarProducts.lookALikes[idx] = value;
    },
    handleLookALikesCoeffSelectChange(e, idx) {
      this.similarProducts.lookALikesCoeff[idx] = parseFloat(e.target.value);
    },
    filterTagGrouperOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleTagGrouperChange(tagId, supplierId) {
      this.supplierLinks[supplierId].tagGrouper.id = tagId;
    },
    removeLookAlikeProduct(idx) {
      this.similarProducts.lookALikes = this.similarProducts.lookALikes.filter(
        (_, index) => index !== idx
      );
      this.similarProducts.lookALikesCoeff =
        this.similarProducts.lookALikesCoeff.filter(
          (_, index) => index !== idx
        );
    },
    handleDefaultSupplyStorageChange(value) {
      this.product.defaultSupplyStorage = value;
    },
    handleDefaultDemandStorageChange(value) {
      this.product.defaultDemandStorage = value;
    },
    handlePromotionChange(value) {
      this.product.promotions = value;
    },
    handleTagChange(value) {
      this.product.tags = value;
    },
    disabledProductionStartDate(start) {
      const end = this.endProductionValue;
      return start && end && start.valueOf() > end.valueOf();
    },
    disabledProductionEndDate(end) {
      const start = this.startProductionValue;
      return start && end && start.valueOf() >= end.valueOf();
    },
    disabledSaleStartDate(start) {
      const end = this.endSaleValue;
      return start && end && start.valueOf() > end.valueOf();
    },
    disabledSaleEndDate(end) {
      const start = this.startSaleValue;
      return start && end && start.valueOf() >= end.valueOf();
    },
    handleLookALikesProductsSearch(value) {
      value = value.trim();
      this.debounce(async () => {
        const products = await ProductsService.fetchProducts(
          {
            pattern: value
          },
          {
            only: ["id", "name", "external_id"],
            include_unused: true
          }
        );
        this.productsList = products?.map(this.productTransform) || [];
      }, 300);
    },
    handleSuppliersSearch(value) {
      value = value.trim();
      this.debounce(async () => {
        this.searchSuppliers(value);
      }, 300);
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async err => {
        if (err) {
          NotificationService.error(this.$t("missingRequiredFieldsError"));
        }
        if (err || !this.getMe.permissions.includes("productsite:write"))
          return;

        this.product.productionDate = {
          start: this.startProductionValue?.utc()?.format(),
          end: this.endProductionValue?.utc()?.format()
        };
        this.product.saleDate = {
          start: this.startSaleValue?.utc()?.format(),
          end: this.endSaleValue?.utc()?.format()
        };

        this.product.productSupplierLinks = Object.values(this.supplierLinks);
        let lookAlikes = [];
        for (let i = 0; i < this.similarProducts.lookALikes.length; i++) {
          if (this.similarProducts.lookALikes[i] !== null) {
            lookAlikes.push({
              source_id: this.similarProducts.lookALikes[i],
              coefficient: this.similarProducts.lookALikesCoeff[i]
            });
          }
        }
        this.product.lookALikes = lookAlikes;
        const secondaryUnit = {
          secondaryUnitName: this.hasSecondaryUnit
            ? this.product.units.secondaryUnitName
            : "",
          secondaryUnitValue: this.hasSecondaryUnit
            ? this.product.units.secondaryUnitValue
            : null
        };

        this.product.units = { ...this.product.units, ...secondaryUnit };

        this.saving = true;
        try {
          if (this.productId) {
            this.product.site = undefined;
            await ProductsService.updateProduct(this.product);
            this.$store.dispatch("planning/resetState");
            this.$store.dispatch("demand/resetState");
            this.$store.dispatch("data/resetState");
            this.$store.dispatch("alerts/computingAlerts", {
              productSiteIds: [+this.productId]
            });
            NotificationService.info(this.$t("productUpdateSuccess"));
          } else {
            await ProductsService.createProduct(this.product);
            NotificationService.info(this.$t("productCreateSuccess"));
          }
          this.$router.push({ name: "products" });
        } finally {
          this.saving = false;
        }
      });
    },
    async launchDeleteProduct() {
      try {
        await ProductsService.deleteProduct(this.product);
        NotificationService.success(this.$t("productDeleteSuccess"));

        this.$destroy();
        this.$router.push({ name: "products" });
      } catch (error) {
        NotificationService.error(error.message);
        throw error;
      }
    },
    getPopupContainer(trigger) {
      return trigger.parentElement.parentElement;
    },
    dropdownFilterOption(input, option) {
      return option.data.key.toLocaleLowerCase().includes(input);
    },
    productTransform(product) {
      return {
        label: `${product.external_id} – ${product.name}`,
        key: product.id,
        value: product.id
      };
    },
    partnerTransform(partner) {
      return { label: partner.name, value: partner.id, key: partner.id };
    },
    async searchSuppliers(value) {
      const allSuppliers = await PartnersService.search({
        name: value,
        isSupplier: true
      });
      this.allSuppliers = (allSuppliers || []).map(this.partnerTransform);
      allSuppliers.forEach(s => (this.allSuppliersMap[s.id] = s));
    },
    tagTransform(t) {
      return { label: t.name, value: t.id, key: t.name };
    },
    promoTransform(p) {
      return { label: p.name, value: p.id, key: p.name };
    }
  }
};
</script>

<style lang="scss" scoped>
.activeTab {
  @apply bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold text-sm #{!important};
}
.inactiveTab {
  @apply bg-white inline-block border-l border-t border-r border-white py-2 px-4 font-semibold text-sm #{!important};
}
.inactiveTab:hover {
  @apply text-blue-500 #{!important};
}
::v-deep .similar-product-dropdown {
  max-width: 540px;
}
</style>
