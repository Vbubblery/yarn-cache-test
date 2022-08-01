<template>
  <div class="flex-1 overflow-hidden flex flex-col">
    <BaseTable
      :selected-objects="currentConfig.selectedItems"
      :data="currentConfig.items"
      :config="tableConfig"
      :sorting="sorting"
      @click:item="openForecastsReviewModalWith([$event], true)"
      @input="handleSelectChange"
    >
      <template v-if="hasSelectedItems" #header="{ headerStyle }">
        <ForecastReviewTableHeader
          :selected-items-quantity="currentConfig.selectedItems.length"
          :total-items="currentConfig.items.length"
          :selected-view-type="selectedViewType"
          :style="headerStyle"
          @input="switchSelectionAll"
          @view="openForecastsReviewModalWith(currentConfig.selectedItems)"
        />
      </template>

      <!-- TABLE CUSTOM HEADERS -->
      <template #header(checkbox)>
        <BaseCheckbox
          :value="
            hasSelectedItems &&
            currentConfig.selectedItems.length === currentConfig.items.length
          "
          @input="switchSelectionAll"
        />
      </template>

      <!-- TABLE CUSTOM CONTENT -->
      <template #content(checkbox)="{ switchSelection, selected }">
        <BaseCheckbox
          :value="selected"
          @input="switchSelection"
          @click="$event.stopPropagation()"
        />
      </template>
      <template #content(partners)="{ value }">
        <BaseTooltip
          v-if="value.length > 1"
          placement="top"
          class="pl-[6px] inline-block hover:text-blue-600"
        >
          <span>
            {{ value.length }}
            {{ $tc("forecastsReview.suppliers", value.length) }}
          </span>
          <template #content>
            <p v-for="supplier in value" :key="supplier">
              {{ supplier }}
            </p>
          </template>
        </BaseTooltip>
        <span v-else class="pl-[6px]">
          {{ value[0] }}
        </span>
      </template>

      <template #content(alerts)="{ value }">
        <div
          v-for="(formattedAlerts, indexAlerts) in formatAlerts(value)"
          :key="indexAlerts"
          class="ml-[6px]"
        >
          <p
            v-if="
              !formattedAlerts.alerts || formattedAlerts.alerts.length === 0
            "
          >
            -
          </p>
          <div v-else>
            <BaseTooltip light placement="top">
              <p :style="`color: ${formattedAlerts.highestCriticalityColor}`">
                {{
                  formattedAlerts.alerts.length === 1
                    ? $t(`forecastsReview.${formattedAlerts.alerts[0].text}`)
                    : `${$t("forecastsReview.multipleIssues")} (${
                        formattedAlerts.alerts.length
                      })`
                }}
              </p>
              <template #content>
                <div
                  v-for="(alert, indexAlert) in formattedAlerts.alerts"
                  :key="indexAlert"
                  class="grid grid-cols-3 gap-2 font-semibold"
                >
                  <p class="col-span-1">
                    {{ alert.displayStartDate }}
                  </p>
                  <div class="col-span-2 flex items-center space-x-6">
                    <p :style="`color: ${alert.color}`">
                      {{ $t(`forecastsReview.${alert.text}`) }}
                    </p>
                    <p v-if="alert.criticality === 0" class="lowercase">
                      {{
                        `${Math.round(alert.exceeding_value)} ${
                          alert.unit_name
                        }`
                      }}
                    </p>
                  </div>
                </div>
              </template>
            </BaseTooltip>
          </div>
        </div>
      </template>
    </BaseTable>

    <div
      v-if="currentConfig.pages >= 2 && currentConfig.items.length > 0"
      class="py-3 border-t border-original-300"
    >
      <BasePagination
        :pages="currentConfig.pages"
        :current-page="currentConfig.currentPage"
        :current-items-per-page="currentConfig.itemsPerPage"
        :items-total="currentConfig.selectableItemCount"
        @items-per-page="setItemsPerPage"
        @change-page="handlePageChange"
      />
    </div>

    <!-- NO RESULTS FOUND -->
    <div
      v-if="showNoResultsPlaceholder"
      class="flex-1 w-full flex items-center justify-center"
    >
      <div class="text-center space-y-2">
        <BaseSVG
          name="file-search-fill"
          size="48"
          class="text-original-500 mx-auto"
        />
        <p class="text-gray-700 text-2xl">
          {{ $t(`forecastsReview.noResultsFound`) }}
        </p>
        <p class="text-original-500">
          {{ $t(`forecastsReview.refineSearch`) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  watch,
  computed
} from "@vue/composition-api";
import {
  CONFIG_NAME,
  IConfig,
  IListProps,
  IProduct,
  PLANNING_DEMAND_VIEW
} from "@/forecasts-review/typings";
import { useItemsListHandlers } from "@/forecasts-review/composables/itemsList";
import { useBaseResources } from "@/forecasts-review/store";
import BasePagination from "@/components/base/components/BasePagination.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import { useForecastsReviewNavigation } from "@/forecasts-review/composables/forecastsReviewNavigation";
import { useProductsFiltersAlerts } from "@/forecasts-review/composables/productFiltersAlerts";
import { useProductsFiltersTags } from "@/forecasts-review/composables/productFiltersTags";
import { debounce } from "@/helper/debounceHelper";
import { cloneDeep } from "lodash";
import { useProductsSuppliers } from "@/forecasts-review/composables/productFilterSuppliers";
import BaseTable from "@/components/base/components/table/BaseTable.vue";
import BaseCheckbox from "@/components/base/components/BaseCheckbox.vue";
import ForecastReviewTableHeader from "@/forecasts-review/components/ForecastReviewTableHeader.vue";
import { useTable } from "@/forecasts-review/composables/table";
import BaseSVG from "@/components/base/components/BaseSVG.vue";

export default defineComponent({
  components: {
    ForecastReviewTableHeader,
    BaseCheckbox,
    BaseTable,
    BasePagination,
    BaseTooltip,
    BaseSVG
  },
  props: {
    selectedViewType: {
      type: String,
      required: true
    }
  },
  setup(props: IListProps, context: SetupContext) {
    const { currentSite, planningDemandView, selectedCustomerId } =
      useBaseResources(context);

    const { updateCriticalities, selectedCriticalities } =
      useProductsFiltersAlerts(currentSite);

    const {
      configs,
      updateConfigs,
      backupConfig,
      isForecastsReviewModalOpen,
      openForecastsReviewModal,
      currentConfig
    } = useForecastsReviewNavigation();

    const { hasSelectedItems, tableConfig, sorting } = useTable(
      currentConfig,
      planningDemandView
    );
    const { selectedProductsFiltersTags } = useProductsFiltersTags();
    const { selectedSuppliers } = useProductsSuppliers();
    const {
      isLoading,
      getProducts,
      getTags,
      formatAlerts,
      handleSelectChange,
      switchSelectionAll,
      handlePageChange,
      setItemsPerPage
    } = useItemsListHandlers(
      configs,
      updateConfigs,
      currentConfig,
      selectedProductsFiltersTags,
      selectedSuppliers,
      selectedCustomerId
    );

    const showNoResultsPlaceholder = computed<boolean>(() => {
      return !isLoading.value && currentConfig.value.items.length === 0;
    });

    const openForecastsReviewModalWith = (
      items: Array<IProduct>,
      previewMode: boolean = false
    ) => {
      //backup the config while clicking on single item
      if (previewMode) {
        const backup = cloneDeep(currentConfig.value);
        backupConfig.value = backup;
      }
      handleSelectChange(items);
      openForecastsReviewModal();
    };

    //CREATED
    getProducts(currentConfig.value, selectedCriticalities.value);
    getTags();

    const paginationWatcher = async (
      current: IConfig,
      old: IConfig | undefined,
      type: CONFIG_NAME
    ) => {
      if (
        current.itemsPerPage !== old?.itemsPerPage ||
        current.currentPage !== old?.currentPage
      ) {
        await (type === CONFIG_NAME.PRODUCT
          ? getProducts(
              current,
              planningDemandView.value === PLANNING_DEMAND_VIEW.PLANNING
                ? selectedCriticalities.value
                : null
            )
          : getTags());
        const { selectedItems, items } = configs[currentConfig.value.name];
        if (isForecastsReviewModalOpen.value && selectedItems.length === 1) {
          updateConfigs(currentConfig.value.name, {
            selectedItems: [
              current.currentPage > (old?.currentPage || 0)
                ? configs[currentConfig.value.name].items[0]
                : configs[currentConfig.value.name].items[items.length - 1]
            ]
          });
        }
      }
    };

    watch(planningDemandView, current =>
      currentConfig.value.name === CONFIG_NAME.PRODUCT
        ? getProducts(
            currentConfig.value,
            current === PLANNING_DEMAND_VIEW.PLANNING
              ? selectedCriticalities.value
              : null
          )
        : getTags()
    );
    watch(
      () => configs.product,
      (current, old) => paginationWatcher(current, old, CONFIG_NAME.PRODUCT),
      { immediate: true }
    );
    watch(
      () => configs.tag,
      (current, old) => paginationWatcher(current, old, CONFIG_NAME.TAG)
    );

    const resetPaginationAndfetchItems = debounce(() => {
      updateConfigs(currentConfig.value.name, { currentPage: 1 });
      if (currentConfig.value.name === CONFIG_NAME.PRODUCT)
        getProducts(configs.product, selectedCriticalities.value);
      else getTags();
    });

    watch(
      () => [
        selectedProductsFiltersTags,
        selectedSuppliers,
        selectedCriticalities,
        selectedCustomerId
      ],
      () => resetPaginationAndfetchItems(),
      { deep: true }
    );

    watch(
      () => configs.product.searchText,
      () => resetPaginationAndfetchItems()
    );
    watch(
      () => configs.tag.searchText,
      () => resetPaginationAndfetchItems()
    );

    watch(currentSite, () => {
      resetPaginationAndfetchItems();
      updateCriticalities();
    });

    return {
      formatAlerts,
      handleSelectChange,
      handlePageChange,
      setItemsPerPage,
      openForecastsReviewModalWith,
      switchSelectionAll,
      currentConfig,
      hasSelectedItems,
      selectedCriticalities,
      PLANNING_DEMAND_VIEW,
      planningDemandView,
      sorting,
      tableConfig,
      showNoResultsPlaceholder
    };
  }
});
</script>
