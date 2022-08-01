<template>
  <div v-if="formattedBody.length" class="bg-white">
    <ADrawer
      destroy-on-close
      placement="right"
      :title="itemName"
      :closable="true"
      :width="356"
      :visible="drawerVisible"
      @close="closeDrawer"
    >
      <DemandTablesTableDrawer
        :tag-data="tagData"
        :is-editable="!dataJobsIsRunning"
        :product-site-id="tableDataProps.productId"
        @preferUnitChange="selectedUnit => preferUnitChange(selectedUnit)"
      />
    </ADrawer>
    <div
      class="relative grid grid-cols-[313px_1fr] h-10 border-y border-t-original-300 border-b-original-200"
    >
      <div
        class="flex justify-center items-center border-r border-original-400"
      >
        <BaseTooltip
          :content="buttonLabel"
          placement="top"
          class="w-full h-full"
        >
          <div
            class="w-full h-full flex justify-center items-center py-[3px] pl-4 pr-3 hover:bg-original-100"
            :class="{ 'cursor-pointer': !isAggregated }"
            @click="showDrawer"
          >
            <BaseSVG
              v-if="!isAggregated"
              name="settings-4-fill"
              size="20"
              class="text-original-500 mr-1"
            />
            <span class="truncate text-original-600">{{ itemName }}</span>
          </div>
        </BaseTooltip>
      </div>
      <div
        class="flex justify-between items-center py-[3px] pl-2 pr-6 overflow-hidden"
      >
        <div v-if="havingChanges" class="flex justify-center items-center">
          <BaseSVG name="pencil-fill" size="20" class="mr-1 text-blue-600" />
          <span class="text-gray-700">
            {{ $t("demandTable.editingMyForecast") }}
          </span>
        </div>

        <div
          v-if="!havingChanges && tableDataProps.demandType === 'punctual'"
          class="flex items-center space-x-1 pr-4 overflow-hidden"
        >
          <BaseTooltip placement="top" :content="punctualWarning">
            <BaseSVG
              name="error-warning-fill"
              size="20"
              class="text-orange-600"
            />
          </BaseTooltip>

          <p class="truncate text-base text-original-800">
            {{ punctualWarning }}
          </p>
        </div>

        <div
          v-if="hasDemandFrozenHorizon && !havingChanges"
          class="flex-none flex items-center justify-end space-x-2 ml-auto"
        >
          <div class="rounded-full bg-purple-500 w-[20px] h-[5px]"></div>
          <div class="flex items-center space-x-2">
            <span>{{ $t("forecastsReview.legendDemandFrozenHorizon") }}</span>
            <BaseTooltip placement="top">
              <template #content>
                {{ $t("forecastsReview.tooltipLegendDemandFrozenHorizon") }}
              </template>
              <BaseSVG
                name="information-fill"
                size="20"
                class="text-gray-400"
              />
            </BaseTooltip>
          </div>
        </div>

        <div v-if="havingChanges" class="ml-auto flex space-x-2">
          <BaseButton
            v-if="!savingDraft"
            type="secondary"
            @click="showDiscardConfirm"
          >
            {{ $t("demandTable.discardChanges") }}
          </BaseButton>
          <BaseButton :loading="savingDraft" @click="showSaveDraftConfirm">
            {{ $t("demandTable.saveUpdateButton") }}
          </BaseButton>
        </div>

        <!-- should be done later; replace on v-if="!havingChanges" -->
        <!--  <BaseButton-->
        <!--    v-if="!havingChanges"-->
        <!--    type="action"-->
        <!--    condensed-->
        <!--    icon="add-circle-fill"-->
        <!--    class="ml-auto"-->
        <!--  >-->
        <!--    Create Event-->
        <!--  </BaseButton>-->
      </div>
    </div>
    <BaseTable
      view="demand"
      :headers="formattedHeaders"
      :body-data="formattedBody"
      :loading-older-data="loadingOlderData"
      :load-older-data-mode="canLoadOlderData"
      :hidden-items-count="hiddenItemsLength"
      :is-editable="!dataJobsIsRunning"
      @action:load-more="loadMore"
      @action:set-begin-date="setBeginDate"
      @update:preview="updatePreview"
      @update:value="updateValue"
      @update:collapse="updateCollapse"
      @reset:value="resetValue"
      @save:data="showSaveDraftConfirm"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { Drawer } from "ant-design-vue";
import helper from "@/helper/helper";
import { cloneDeep, isEqual } from "lodash";
import AlertApiService from "@/services/alerts.api.service";
import DemandService from "@/services/demand.service";
import ProductsService from "@/services/products.service";
import DemandTablesTableDrawer from "@/forecasts-review/components/demand/DemandTablesTableDrawer.vue";
import TagsService from "@/services/tags.service";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseTable from "@/components/base/table/BaseTable.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import { checkIfIsCurrentPeriod } from "@/components/base/table/utils/planning";
import {
  createSubItemsLoader,
  formatDemandValues,
  getOptionsBySourceName,
  ROW_TYPE,
  SOURCE_NAME
} from "@/components/base/table/utils/base";
import dayjs from "@/dayjs";
import { baseOptions } from "@/sweetalert";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import uuidMixin from "@/helper/uuidMixin";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import { getIsMediumFontBySourceName } from "@/components/base/table/utils/demand";

const BATCH_LOAD_MORE = 5;

export default {
  name: "DemandTablesTable",
  components: {
    BaseSVG,
    BaseButton,
    DemandTablesTableDrawer,
    BaseTable,
    BaseTooltip,
    ADrawer: Drawer
  },
  mixins: [uuidMixin],
  props: {
    tableDataProps: {
      type: Object,
      required: true
    },
    draftMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["handle-changes"],
  data() {
    return {
      drawerVisible: false,
      itemName: "",
      tagData: null,
      isLoadingMore: false,
      subItemsPage: 1,
      totalSubItems: null,
      subItemsDistributionRatios: {},
      sources: this.tableDataProps.sources,
      loadingOlderData: false,
      savingDraft: false,
      tableData: cloneDeep(this.tableDataProps.data),
      tableDataCopy: cloneDeep(this.tableDataProps.data),
      tableId: null
    };
  },
  computed: {
    ...mapState("alerts", {
      dataJobsIsRunning: state => state.dataJobsAlerts?.dataJobsIsRunning
    }),
    ...mapGetters("common", ["getCurrentSite", "getMe", "getSelectedProducts"]),
    ...mapGetters("demand", [
      "getSelectedStartDate",
      "getSelectedEndDate",
      "getSelectedPeriodType",
      "getBeginDate",
      "getUpdatingCount"
    ]),
    ...mapState("demand", {
      submittedOptions: state => state.submittedOptions
    }),
    isAggregated() {
      return this.tableDataProps.isAggregated;
    },
    buttonLabel() {
      const productsCount = this.tableDataProps.total;
      const label = this.$tc("forecastsReview.products", productsCount);
      return this.isAggregated ? `${productsCount} ${label}` : this.itemName;
    },
    productData() {
      return this.tableDataProps?.productData ?? {};
    },
    // a product can be MTS but still have a demand frozen horizon
    hasDemandFrozenHorizon() {
      return (
        this.productIsMto || this.productData?.demandFrozenHorizonDaysCount > 0
      );
    },
    productIsMto() {
      return this.productData?.isMto;
    },
    havingChanges() {
      // we just need to check a change on the parent MY_DEMAND_FORECAST since we don't allow to change values on its children
      const currentMyDemandForecastValues =
        this.tableData[SOURCE_NAME.MY_DEMAND_FORECAST]?.values;
      const initialMyDemandForecastValues =
        this.tableDataCopy[SOURCE_NAME.MY_DEMAND_FORECAST]?.values;
      if (currentMyDemandForecastValues && initialMyDemandForecastValues) {
        return !isEqual(
          currentMyDemandForecastValues,
          initialMyDemandForecastValues
        );
      }
      return false;
    },
    canLoadOlderData() {
      const endDate = this.$store.getters["demand/getSelectedEndDate"];
      return helper.dateDiff(endDate, this.getBeginDate, "year") < 3;
    },
    totalSubItemsPages() {
      return Math.ceil(this.totalSubItems / BATCH_LOAD_MORE);
    },

    hiddenItemsLength() {
      return this.formattedHeaders.filter(header => header.hide).length;
    },
    formattedHeaders() {
      const { periodType } = this.tableDataProps;
      const { isMto, demandFrozenHorizonDaysCount } = this.productData;

      return this.tableDataProps.periods.map(date => {
        const isCurrentPeriod = checkIfIsCurrentPeriod(date, periodType);
        return {
          content: helper.tableHeaderDateDisplay(date, periodType),
          isCurrentPeriod,
          isPast: helper.dateIsPast(date),
          hide: !helper
            .periodStartOrEnd(date, periodType, "start")
            .isSameOrAfter(this.getBeginDate, periodType),
          isInDemandFrozenHorizon: this.checkIsPeriodInDemandFrozenHorizon(
            date,
            periodType,
            isMto,
            demandFrozenHorizonDaysCount
          )
        };
      });
    },
    formattedBody() {
      const data = [];
      const sources = this.sources;
      const options = sourceName => ({
        ...getOptionsBySourceName(sourceName, {
          ...this.tableDataProps,
          bodyData: this.bodyData,
          access:
            this.getMe.canAccess(["demand:write"]) &&
            !this.getCurrentSite.isSupplierView,
          leadTimes: this.leadTimes,
          frozenPeriods: this.frozenPeriods,
          totalSubItems: this.totalSubItems
        }),
        headers: this.formattedHeaders
      });
      sources.forEach((sourceName, index) => {
        const item = this.tableData[sourceName];
        const isParent = this.tableDataProps.isAggregated && !item.parent;
        const currentItem = {
          sourceName,
          displayName: item.displayName || this.renameSource(sourceName),
          ...item,
          ...this.getTypeBySourceName(sources[index], isParent),
          values: formatDemandValues(
            sources[index],
            item,
            options(sources[index])
          ),
          isParent,
          isMediumFont: getIsMediumFontBySourceName(sources[index])
        };
        if (item.parent) {
          if (
            !this.getCurrentSite.displayFirmOrdersInDemand &&
            item.parent === SOURCE_NAME.SALES_ORDERS
          )
            return;
          const pos = data.findIndex(
            element => element.sourceName === item.parent
          );
          if (data[pos]) {
            data[pos].subItems = [...(data[pos].subItems || []), currentItem];
          } else {
            delete currentItem.parent;
            currentItem.type = this.getTypeBySourceName(sources[index], false);
            data.push(currentItem);
          }
        } else {
          data.push(currentItem);
        }
      });
      return data;
    },
    punctualWarning() {
      return this.tableDataProps.isAggregated
        ? this.$t("demandTable.punctualMessageAggr")
        : this.$t("demandTable.punctualMessage");
    }
  },
  watch: {
    getBeginDate: {
      deep: true,
      immediate: true,
      handler: async function (cur) {
        const startDate = this.$store.getters["demand/getSelectedStartDate"];
        const { periodType } = this.tableDataProps;
        if (dayjs(startDate).isAfter(cur, periodType)) {
          this.loadingOlderData = true;
          this.$store.dispatch("demand/updateSelectedStartDate", cur);
          this.setForceReload(false);
          await this.fetchDemandData();
          // this.tableDataCopy is used as the initial data, the data coming from the backend, to be compared with the current changes on MY_DEMAND_FORECAST
          // if the begin date is modified, we also need to update the initial data to be able to compare initial VS current changes on the same base
          this.tableDataCopy = cloneDeep(this.tableDataProps.data);

          this.setForceReload(true);
        }
        this.loadingOlderData = false;
      }
    },
    draftMode: {
      handler: function (curVal) {
        if (!curVal && this.getUpdatingCount === 0) {
          this.resetDraft();
        }
      }
    },
    tableData: {
      deep: true,
      handler: function (curVal) {
        const result = Object.entries(curVal).some(sourceData => {
          if (sourceData[0].startsWith(SOURCE_NAME.MY_DEMAND_FORECAST)) {
            const oldData = cloneDeep(sourceData[1].values);
            const refData = cloneDeep(
              this.tableDataCopy[sourceData[0]]?.values
            );
            return !isEqual(oldData, refData);
          }
          return false;
        });
        this.$emit("handle-changes", result);
      }
    },
    tableDataProps() {
      this.loadingOlderData = true;
      const data = this.tableDataProps.data;
      Object.keys(data).map(key => {
        const diff =
          data[key].values.length - this.tableData[key].values.length;
        const newValues = data[key].values.slice(0, diff);
        this.tableData[key].values = [
          ...newValues,
          ...this.tableData[key].values
        ];
      });

      this.loadingOlderData = false;
    }
  },
  mounted() {
    // we are using the uuidMixin to generate a unique ID for each table
    // to store which table has changes
    this.tableId = this.uuid;
    if (this.getBeginDate.isSame(dayjs(), this.getSelectedPeriodType)) {
      this.updateBeginDate(
        this.getBeginDate.subtract(3, this.getSelectedPeriodType)
      );
    }
  },
  async created() {
    this.itemName = this.$t("demandTable.common.aggregatedView");
    if (!this.tableDataProps.isAggregated) {
      const productRef =
        (this.productData?.name ?? "").includes(this.productData?.externalId) ||
        this.getCurrentSite.isSupplierView
          ? ""
          : `${this.productData?.externalId} - `;
      this.itemName =
        productRef +
        `${this.tableDataProps.name ?? ""} (${
          this.tableDataProps?.units?.isDefaultUnit
            ? this.tableDataProps?.units?.defaultUnitName
            : this.tableDataProps?.units?.secondaryUnitName
        })`;
    } else if (this.tableDataProps.tagIds?.length === 1) {
      const tagId = this.tableDataProps.tagIds[0];
      this.tagData = await TagsService.fetchTagById(tagId);
      this.itemName = "#" + this.tagData?.name;
    }
  },
  methods: {
    ...mapMutations("demand", [
      "updateChartDataFromTableData",
      "switchUnitChartData",
      "setIsUpdating",
      "setForceReload",
      "resetChartData",
      "addToTablesWithChanges",
      "removeFromTablesWithChanges",
      "setUpdatingCount",
      "updateBeginDate",
      "resetTablesWithChanges"
    ]),
    ...mapActions("demand", ["fetchDemandData"]),
    checkIsPeriodInDemandFrozenHorizon(
      periodDate,
      periodType,
      isMto,
      demandFrozenHorizonDaysCount
    ) {
      if (!isMto) return false;
      const periodIsPast = dayjs().isAfter(dayjs(periodDate), periodType);
      if (periodIsPast) return false;
      // if a product is MTO and has no demandFrozenHorizonDaysCount specified
      // it means all the current and future periods are frozen
      if (demandFrozenHorizonDaysCount === null) return true;
      const isPeriodInDemandFrozenPeriod = dayjs()
        .add(demandFrozenHorizonDaysCount, "day")
        .isSameOrAfter(dayjs(periodDate), periodType);
      return isPeriodInDemandFrozenPeriod;
    },
    async resetValue({ index, sourceName }) {
      const newValue = this.tableDataCopy[sourceName].values[index];
      this.tableData[sourceName] = {
        ...this.tableData[sourceName],
        changedIndexList: this.tableData[sourceName]?.changedIndexList.filter(
          item => item !== index
        )
      };
      this.updatePreview({ newValue, index, sourceName });
    },
    async updateValue({ index, sourceName }) {
      const originalValue = this.tableDataCopy[sourceName]?.values[index];
      const newValue = this.tableData[sourceName]?.values[index];
      let changedIndexList = this.tableData[sourceName]?.changedIndexList ?? [];
      if (originalValue === newValue) {
        changedIndexList = changedIndexList.filter(value => value !== index);
      } else {
        changedIndexList.push(index);
      }
      this.tableData[sourceName] = {
        ...this.tableData[sourceName],
        changedIndexList,
        originalValues: this.tableDataCopy[sourceName]?.values
      };
      if (this.havingChanges) this.addToTablesWithChanges(this.tableId);
      else this.removeFromTablesWithChanges(this.tableId);
    },
    showDiscardConfirm() {
      Swal.fire({
        ...baseOptions,
        title: this.$t("demandTable.discardTitle"),
        text: this.$t("demandTable.discardText"),
        confirmButtonText: this.$t("demandTable.discardConfirmButton"),
        cancelButtonText: this.$t("demandTable.discardCancelButton")
      }).then(result => {
        if (result.isConfirmed) {
          this.resetDraft();
        }
      });
    },
    showSaveDraftConfirm() {
      if (this.havingChanges && !this.savingDraft)
        Swal.fire({
          ...baseOptions,
          title: this.$t("demandTable.saveTitle"),
          confirmButtonText: this.$t("demandTable.saveConfirmButton"),
          cancelButtonText: this.$t("demandTable.saveCancelButton")
        }).then(async result => {
          if (result.isConfirmed) {
            await this.saveDraft();
          }
        });
    },
    resetDraft() {
      const curFinalForecastVals = cloneDeep(
        this.tableData[SOURCE_NAME.FINAL_DEMAND_FORECAST]?.values
      );
      this.tableData = cloneDeep(this.tableDataCopy);
      const deltas = curFinalForecastVals?.map(
        (val, index) =>
          this.tableDataCopy[SOURCE_NAME.FINAL_DEMAND_FORECAST]?.values[index] -
          val
      );
      this.tableDataProps.data = cloneDeep(this.tableData);
      this.resetChartData(deltas);
      this.resetTablesWithChanges();
    },
    async saveDraft() {
      this.savingDraft = true;
      this.setUpdatingCount(1);
      const productSiteIds = this.tableDataProps.productSiteIds;
      const period = this.tableDataProps.periodType;
      let payload = {
        productSiteIds:
          productSiteIds || this.tableDataProps.productId
            ? [this.tableDataProps.productId]
            : [],
        tagIds: this.tableDataProps.tagIds,
        customerId: this.submittedOptions.submittedCustomerSiteId,
        siteId: this.getCurrentSite.id,
        [SOURCE_NAME.MY_DEMAND_FORECAST]: []
      };
      Object.entries(this.tableData)
        .map(sourceData => ({
          sourceName: sourceData[0],
          changedIndexList: sourceData[1].changedIndexList
        }))
        .filter(sourceData => sourceData?.changedIndexList)
        .forEach(sourceData => {
          if (this.tableData[sourceData.sourceName]) {
            payload[sourceData.sourceName].push(
              ...sourceData.changedIndexList
                .map(index => {
                  const date = this.tableDataProps.periods[index];
                  return {
                    start_date: helper
                      .periodStartOrEnd(date, period, "start")
                      .format("YYYY-MM-DD"),
                    end_date: helper
                      .dateStrToLastDate(date, period)
                      .format("YYYY-MM-DD"),
                    value: this.tableData[sourceData.sourceName].values[index]
                  };
                })
                .flat()
            );
          }
        });
      try {
        await DemandService.updateMyForecast(payload);
        // copy mutable dataset is becoming the reference dataset after saving
        Object.keys(this.tableDataCopy).forEach(
          key =>
            (this.tableDataCopy[key].values = cloneDeep(
              this.tableData[key].values
            ))
        );
        this.resetDraft();
        await AlertApiService.computingAlerts(
          this.tableDataProps.productId
            ? { productSiteIds: [parseInt(this.tableDataProps.productId)] }
            : {}
        );
      } finally {
        this.savingDraft = false;
        this.setUpdatingCount(-1);
      }
    },
    updateFinalForecast(
      newValue,
      index,
      sourceName,
      salesOrderSourceName,
      isChild
    ) {
      const oldValue = this.tableData[sourceName].values[index];
      const salesOrderValue =
        this.tableData[salesOrderSourceName]?.values[index];
      if (
        this.getCurrentSite?.displayFirmOrdersInDemand === true &&
        salesOrderValue > newValue
      ) {
        this.tableData[sourceName].values[index] = salesOrderValue;
      } else {
        const curVal =
          this.tableData[SOURCE_NAME.FLOWLITY_DEMAND_FORECAST].values[index];
        this.tableData[sourceName].values[index] =
          newValue === null ? curVal : newValue;
      }
      if (isChild) {
        const delta = this.tableData[sourceName].values[index] - oldValue;
        this.tableData[SOURCE_NAME.FINAL_DEMAND_FORECAST].values[index] +=
          delta;
      }
      const finalValue =
        this.tableData[SOURCE_NAME.FINAL_DEMAND_FORECAST].values[index];
      if (finalValue !== oldValue) {
        this.updateChartDataFromTableData({
          value: finalValue,
          periodId: index
        });
      }
    },
    async updateCollapse(label) {
      const currentRow = this.tableData[label];
      const subItems = Object.values(this.tableData).find(
        obj => obj.parent === label
      );
      this.tableData[label] = {
        ...this.tableData[label],
        collapsed: !(currentRow?.collapsed ?? true)
      };
      if (!this.tableData[label].collapsed) {
        if (!subItems) {
          await this.loadMore(label);
        }
      }
    },
    showDrawer() {
      if (!this.tableDataProps.isAggregated || this.tagData) {
        this.drawerVisible = true;
      }
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
    updatePreview({ newValue, index, sourceName }) {
      newValue = newValue === null ? newValue : +newValue;
      switch (true) {
        case sourceName === SOURCE_NAME.MY_DEMAND_FORECAST: {
          const myForecast = this.formattedBody.find(
            item => item.sourceName === SOURCE_NAME.MY_DEMAND_FORECAST
          );
          if (myForecast.subItems) {
            myForecast.subItems.forEach(item => {
              const distributionRatio =
                this.subItemsDistributionRatios[item.productId][index];
              const newValues = this.tableData[item.sourceName].values;
              const distributionValue =
                newValue === null ? null : distributionRatio * newValue;
              newValues[index] = distributionValue;
              this.tableData[item.sourceName] = {
                ...this.tableData[item.sourceName],
                values: newValues
              };
            });
          }
          const values = this.tableData[sourceName].values;
          values[index] = newValue;
          this.tableData[sourceName] = {
            ...this.tableData[sourceName],
            values
          };
          const isChild = false;
          this.updateFinalForecast(
            newValue,
            index,
            SOURCE_NAME.FINAL_DEMAND_FORECAST,
            SOURCE_NAME.SALES_ORDERS,
            isChild
          );
          break;
        }
        case sourceName.startsWith(SOURCE_NAME.MY_DEMAND_FORECAST + "-"): {
          const values = this.tableData[sourceName].values;
          const myForecastValues =
            this.tableData[SOURCE_NAME.MY_DEMAND_FORECAST].values;
          const delta = newValue - values[index];
          values[index] = newValue;
          myForecastValues[index] = myForecastValues[index] + delta;
          if (myForecastValues[index] === 0 && newValue === null) {
            myForecastValues[index] = null;
          }
          this.tableData[sourceName] = {
            ...this.tableData[sourceName],
            values: values
          };
          const childFinalForecastSourceName = sourceName.replace(
            SOURCE_NAME.MY_DEMAND_FORECAST,
            SOURCE_NAME.FINAL_DEMAND_FORECAST
          );
          const childSalesOrderSourceName = sourceName.replace(
            SOURCE_NAME.MY_DEMAND_FORECAST,
            SOURCE_NAME.SALES_ORDERS
          );
          const isChild = true;
          this.updateFinalForecast(
            newValue,
            index,
            childFinalForecastSourceName,
            childSalesOrderSourceName,
            isChild
          );
          break;
        }
      }
    },
    setLoading(sourceName, isLoading) {
      this.tableData[sourceName] = {
        ...this.tableData[sourceName],
        isLoading
      };
    },
    async loadMore(sourceName) {
      this.setLoading(sourceName, true);
      const page = this.subItemsPage;
      const payload = {
        productSiteIds: this.tableDataProps.productSiteIds,
        tagIds: this.tableDataProps.tagIds,
        siteId: this.getCurrentSite.id,
        periodType: this.submittedOptions.submittedPeriodType,
        startDate: this.submittedOptions.submittedStartDate,
        endDate: this.submittedOptions.submittedEndDate,
        // we should load sub items without aggregation
        isAggregated: false,
        customerId: this.submittedOptions.submittedCustomerSiteId,
        perPage: BATCH_LOAD_MORE,
        page
      };
      const loader = createSubItemsLoader(sourceName);
      let subItems = await loader.fetch(payload);
      if (!this.getCurrentSite.displayDemandForecastExternal) {
        subItems = Object.keys(subItems)
          .filter(key => !key.startsWith(SOURCE_NAME.EXTERNAL_DEMAND_FORECAST))
          .reduce((obj, key) => {
            obj[key] = subItems[key];
            return obj;
          }, {});
      }
      const flowlityForecastChildren = Object.values(subItems).filter(
        item => item.parent === SOURCE_NAME.FLOWLITY_DEMAND_FORECAST
      );
      this.updateTotalSubItems(loader.getTotalSubItems());
      if (!this.getCurrentSite.isSupplierView)
        this.updateDistributionRatios(flowlityForecastChildren);
      this.updateSubItemsPage(page + 1);
      this.insertSubItems(subItems);
      this.updateShouldLoadMoreParents(subItems);
      this.setLoading(sourceName, false);
    },
    updateShouldLoadMoreParents(subItems) {
      const parentNames = new Set(
        Object.values(subItems).map(item => item.parent)
      );
      Array.from(parentNames).forEach(parentName => {
        this.tableData[parentName] = {
          ...this.tableData[parentName],
          shouldLoadMore: this.subItemsPage <= this.totalSubItemsPages
        };
      });
    },
    updateTotalSubItems(total) {
      this.totalSubItems = total;
    },
    updateSubItemsPage(pageNum) {
      this.subItemsPage = pageNum;
    },
    insertSubItems(subItems) {
      this.tableData = { ...this.tableData, ...subItems };
      this.tableDataCopy = cloneDeep({ ...this.tableDataCopy, ...subItems });
      this.sources = [...this.sources, ...Object.keys(subItems)];
    },
    updateDistributionRatios(flowlityForecastChildren) {
      const result = {};
      const flowlityForecastValues =
        this.tableDataProps.data[SOURCE_NAME.FLOWLITY_DEMAND_FORECAST].values;
      flowlityForecastChildren.forEach(item => {
        const ratios = item.values.map((value, idx) => {
          return flowlityForecastValues[idx]
            ? value / flowlityForecastValues[idx]
            : 1 / this.totalSubItems;
        });
        result[item.productId] = ratios;
      });
      this.subItemsDistributionRatios = {
        ...this.subItemsDistributionRatios,
        ...result
      };
    },
    getTypeBySourceName(sourceName, isParent) {
      const result = {};
      switch (true) {
        case sourceName === SOURCE_NAME.MY_DEMAND_FORECAST:
          result.type = ROW_TYPE.INPUT;
          result.childType = ROW_TYPE.INPUT;
          break;
        default:
          break;
      }
      if (isParent) {
        result.type = ROW_TYPE.MULTI_ROW;
      }
      return result;
    },
    async preferUnitChange(selectedUnit) {
      await ProductsService.updateProductIsDefaultUnit(
        parseInt(this.tableDataProps.productId),
        selectedUnit === "default"
      );
      this.$store.dispatch("demand/fetchDemandData");
      this.$store.dispatch("planning/resetState");
      this.$store.dispatch("data/resetState");
      this.$store.dispatch("alerts/computingAlerts", {
        ...(this.tableDataProps.productId && {
          productSiteIds: [parseInt(this.tableDataProps.productId)]
        })
      });
    },

    renameSource(source) {
      const { isSupplierView } = this.getCurrentSite;
      let prefix = "common";
      if (
        source.localeCompare(SOURCE_NAME.FIRM_ORDERS) == 0 ||
        source.localeCompare(SOURCE_NAME.ALL_ORDERS) == 0 ||
        source.localeCompare(SOURCE_NAME.PAST_DEMAND) == 0
      ) {
        prefix = isSupplierView ? "supplierView" : "regularView";
      }
      if (
        source.localeCompare(SOURCE_NAME.MY_DEMAND_FORECAST) == 0 ||
        source.localeCompare(SOURCE_NAME.FLOWLITY_DEMAND_FORECAST) == 0
      ) {
        prefix = "regularView";
      }
      return this.$t(`demandTable.${prefix}.${source}`);
    },
    checkIfIsCurrentPeriod(date, periodType) {
      return helper.isDateStrCurrentPeriod(date, periodType);
    },
    setBeginDate(months) {
      this.updateBeginDate(this.getBeginDate.add(months, "month"));
    }
  }
};
</script>
