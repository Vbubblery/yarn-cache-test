<template>
  <div>
    <div class="mb-8 bg-white">
      <ADrawer
        destroy-on-close
        :title="itemName"
        placement="right"
        :closable="true"
        :width="400"
        :visible="drawerVisible"
        :drawer-style="{ overflow: 'initial' }"
        @close="closeDrawer"
      >
        <PlanningTablesTableDrawer
          :tag-data="tagData"
          :product-site-id="productData ? productData.id : 0"
          :initial-stock="initialStock"
          :is-editable="!dataJobsIsRunning"
          :product-id="tableDataProps.productId"
          v-on="$listeners"
        />
      </ADrawer>
      <div
        class="relative grid grid-cols-[313px_1fr] h-10 border-y border-t-original-300 border-b-original-200"
      >
        <div
          class="flex justify-center items-center border-r border-original-400"
        >
          <BaseTooltip
            v-if="itemName"
            :content="itemName"
            placement="top"
            class="w-full h-full"
          >
            <div
              class="w-full h-full flex justify-center items-center py-[3px] pl-4 pr-3 hover:bg-original-100 cursor-pointer"
              @click="showDrawer"
            >
              <BaseSVG
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
          <div
            v-if="havingChanges || isSimulationOnly"
            class="flex justify-center items-center"
          >
            <BaseSVG name="pencil-fill" size="20" class="mr-1 text-blue-600" />
            <span class="text-gray-700">
              {{ $t("planningTable.editingMySupply") }}
            </span>
          </div>

          <div
            v-if="
              !havingChanges &&
              !isSimulationOnly &&
              (displayNoSupplierWarning ||
                productData.demandType == 'punctual' ||
                productData.isJustInTime ||
                (productData.isJustInTime == false &&
                  initialStock &&
                  (initialStock.length === 0 ||
                    initialStock[0].quantity == null)))
            "
            class="flex items-center space-x-1 pr-4 overflow-hidden"
          >
            <BaseTooltip placement="top" :content="concatenatedWarnings">
              <BaseSVG
                name="error-warning-fill"
                size="20"
                class="text-orange-600"
              />
            </BaseTooltip>
            <div class="truncate text-base text-original-800">
              <span v-if="displayNoSupplierWarning">
                {{ $t("planningTable.noSupplierWarning") }}
                <router-link
                  :to="`/admin/product/${tableDataProps.productId}`"
                  class="underline"
                >
                  {{ $t("planningTable.productAdminPage") }}
                </router-link>
              </span>
              <span v-if="productData.demandType == 'punctual'">
                {{ $t("planningTable.punctualMessage") }}
              </span>
              <span v-if="productData.isJustInTime">
                {{ $t("planningTable.justInTime") }}
              </span>
              <span
                v-if="
                  productData.isJustInTime == false &&
                  initialStock &&
                  (initialStock.length === 0 ||
                    initialStock[0].quantity == null)
                "
              >
                {{ $t("planningTable.noStock") }}
              </span>
            </div>
          </div>

          <div
            v-if="tableHasFixedReco && !(havingChanges || isSimulationOnly)"
            class="shrink-0 flex items-center justify-end space-x-4 pr-4"
          >
            <div class="rounded-full bg-blue-500 w-[20px] h-[5px]"></div>
            <div class="flex items-center space-x-2">
              <span>{{ $t("forecastsReview.legendFixReco") }}</span>
              <BaseTooltip placement="top">
                <template #content>
                  {{ $t("forecastsReview.tooltipLegendFixReco") }}
                </template>
                <BaseSVG name="information-fill" class="text-gray-400" />
              </BaseTooltip>
            </div>
          </div>

          <div
            v-if="havingChanges || isSimulationOnly"
            class="ml-auto flex space-x-2"
          >
            <BaseButton
              v-if="!savingDraft"
              type="secondary"
              @click="showDiscardConfirm"
            >
              {{ $t("planningTable.discardChanges") }}
            </BaseButton>
            <BaseButton
              v-if="!isSimulationOnly"
              :loading="savingDraft"
              @click="showSaveDraftConfirm"
            >
              {{ $t("planningTable.saveUpdateButton") }}
            </BaseButton>
          </div>
        </div>
      </div>
      <BaseTable
        view="planning"
        :headers="formattedHeaders"
        :body-data="formattedBody"
        :saving-draft="savingDraft"
        :is-editable="!dataJobsIsRunning"
        :index-fixing-reco-date="indexFixingRecoDate"
        :index-hover-fixing-reco-date="indexHoverFixingRecoDate"
        @update:saveFixingRecoDate="saveFixingRecoDate"
        @update:hoverFixingRecoDate="hoverFixingRecoDate"
        @update:value="updateValue"
        @reset:value="resetValue"
        @update:preview="updatePreview"
        @update:collapse="updateCollapse"
        @save:data="showSaveDraftConfirm"
      />
    </div>
  </div>
</template>

<script>
import SupervisorService from "@/services/supervisor.service";
import { mapState, mapGetters, mapMutations } from "vuex";
import helper from "@/helper/helper";
import PlanningTablesTableDrawer from "@/forecasts-review/components/planning/PlanningTablesTableDrawer.vue";
import { Drawer } from "ant-design-vue";
import PlanningService from "@/services/planning.service";
import AlertApiService from "@/services/alerts.api.service";
import { cloneDeep } from "lodash";
import TagsService from "@/services/tags.service";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import BaseTable from "@/components/base/table/BaseTable.vue";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import { baseOptions } from "@/sweetalert";
import {
  getOptionsBySourceName,
  formatPlanningValues,
  createSubItemsLoader,
  SOURCE_NAME
} from "@/components/base/table/utils/base";
import {
  checkIfIsCurrentPeriod,
  checkIfIsWeekend,
  getDisplayName,
  getTypeBySourceName,
  getAsideColorBySourceName,
  getIconBySourceName,
  getIndentBySourceName,
  getCollapsedBySourceName,
  getIsMediumFontBySourceName,
  leadTimes,
  updateRelatedSourcesWithChildren
} from "@/components/base/table/utils/planning";
import uuidMixin from "@/helper/uuidMixin";
import ProductsService from "@/services/products.service";
import dayjs from "@/dayjs";
import NotificationService from "@/services/notification.service";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "PlanningTablesTable",
  components: {
    BaseSVG,
    BaseButton,
    BaseTooltip,
    BaseTable,
    PlanningTablesTableDrawer,
    ADrawer: Drawer
  },
  mixins: [uuidMixin],
  props: {
    tableDataProps: {
      type: Object,
      required: true
    }
  },
  emits: ["handle-changes", "update:preferUnitChange"],
  data() {
    return {
      tableRows: {},
      drawerVisible: false,
      tagData: null,
      itemName: "",
      savingDraft: false,
      totalDemandForecast:
        (this.tableDataProps.data[SOURCE_NAME.TOTAL_DEMAND_FORECAST] &&
          this.tableDataProps.data[SOURCE_NAME.TOTAL_DEMAND_FORECAST]
            .values[0]) ||
        0,
      tableData: cloneDeep(this.tableDataProps.data),
      tableDataCopy: cloneDeep(this.tableDataProps.data),
      initialStock: undefined,
      tableId: null,
      isSimulationOnly: false,
      havingChanges: false,
      indexFixingRecoDate: null,
      indexHoverFixingRecoDate: null
    };
  },
  computed: {
    ...mapGetters("common", [
      "getMe",
      "getStorageSitesById",
      "getCompany",
      "getCurrentSite",
      "getSelectedProducts"
    ]),
    ...mapState("planning", {
      submittedOptions: state => state.submittedOptions
    }),
    ...mapState("alerts", {
      dataJobsIsRunning: state => state.dataJobsAlerts?.dataJobsIsRunning
    }),
    tableHasFixedReco() {
      return !!this.indexFixingRecoDate;
    },
    concatenatedWarnings() {
      const warnings = [];
      if (this.displayNoSupplierWarning)
        warnings.push(this.$t("planningTable.noSupplierWarning"));
      if (this.productData.demandType == "punctual")
        warnings.push(this.$t("planningTable.punctualMessage"));
      if (this.productData.isJustInTime)
        warnings.push(this.$t("planningTable.justInTime"));
      if (
        !this.productData.isJustInTime &&
        this.initialStock &&
        (this.initialStock.length === 0 ||
          this.initialStock[0].quantity == null)
      )
        warnings.push(this.$t("planningTable.noStock"));
      return warnings.join(" ");
    },
    formattedHeaders() {
      const periodType = this.tableDataProps.periodType;
      const headers = this.tableDataProps.periods.map(date => {
        const isCurrentPeriod = checkIfIsCurrentPeriod(
          date,
          this.tableDataProps.periodType
        );
        const isWeekendPeriod = checkIfIsWeekend(
          date,
          this.tableDataProps.periodType
        );
        return {
          content: helper.tableHeaderDateDisplay(date, periodType),
          isCurrentPeriod,
          isWeekendPeriod
        };
      });
      headers[0] = {
        content: this.$t("planningTable.currentDay"),
        isCurrentPeriod: false,
        isWeekendPeriod: false,
        isPast: true
      };
      if (periodType != "day")
        headers[1].content =
          this.$t("planningTable.restOf") + headers[1].content;
      return headers;
    },
    optionsData() {
      return {
        ...this.tableDataProps,
        tableData: this.tableData,
        access: this.getMe.canAccess(["supply:write"]),
        leadTimes: leadTimes(this.productData?.leadTime ?? {}),
        totalDemandForecast: this.totalDemandForecast,
        productData: this.productData
      };
    },
    formattedBody() {
      const sourceNames = Object.keys(this.tableData);
      const sourceNamesToSkip = [SOURCE_NAME.TOTAL_DEMAND_FORECAST];
      const data = [];
      Object.values(this.tableData).forEach((sourceObj, index) => {
        const name = getDisplayName(
          sourceNames[index],
          sourceObj,
          this.getStorageSitesById,
          this.getCurrentSite
        );
        const displayName = this.$te(`planningTable.${name}`)
          ? this.$t(`planningTable.${name}`)
          : name;
        if (!sourceNamesToSkip.includes(sourceNames[index])) {
          const currentItem = {
            collapsed: getCollapsedBySourceName(sourceNames[index]),
            ...sourceObj,
            asideColor: getAsideColorBySourceName(sourceNames[index]),
            sourceName: sourceNames[index],
            displayName,
            periodType: this.tableDataProps.periodType,
            type: getTypeBySourceName(sourceNames[index], sourceObj.isParent),
            values: formatPlanningValues(
              sourceNames[index],
              sourceObj,
              getOptionsBySourceName(sourceNames[index], this.optionsData)
            ),
            indent: getIndentBySourceName(sourceNames[index]),
            icon: getIconBySourceName(sourceNames[index]),
            isSimulationOnly:
              sourceNames[index] === SOURCE_NAME.STATUS_3_SUPPLIES,
            ...(sourceObj.dependencies && {
              dependencies: sourceObj.dependencies
            }),
            isMediumFont: getIsMediumFontBySourceName(sourceNames[index])
          };
          const sourceHasParent = !!sourceObj.parent;
          if (sourceHasParent) {
            const parentRow = data.find(
              element => element.sourceName === sourceObj.parent
            );
            if (parentRow) {
              parentRow.subItems = [...(parentRow.subItems || []), currentItem];
            }
          } else {
            data.push(currentItem);
          }
        }
      });
      return data;
    },
    productData() {
      return this.tableDataProps?.productInfo ?? null;
    },
    displayNoSupplierWarning() {
      return this.tableDataProps?.suppliersCount?.length >= 1;
    },
    shouldLoadExpiredStock() {
      return this.tableDataProps.isAggregated
        ? this.tableDataProps.hasPerishableProducts
        : this.tableDataProps.productInfo.isPerishableProduct;
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler: function (curVal) {
        const res = Object.entries(curVal).some(sourceData => {
          const havingChange =
            sourceData[1]?.changedIndexList &&
            sourceData[1]?.changedIndexList?.length > 0;
          if (sourceData[0] === SOURCE_NAME.STATUS_3_SUPPLIES) {
            this.isSimulationOnly = havingChange;
            return false;
          }
          return havingChange;
        });
        this.havingChanges = res;
        if (this.havingChanges) {
          this.isSimulationOnly = false;
        }
        this.$emit("handle-changes", res || this.isSimulationOnly);
      }
    }
  },
  mounted() {
    // we are using the uuidMixin to generate a unique ID for each table
    // to store which table has changes
    this.tableId = this.uuid;

    // initialize the fixingRecoDate
    const indexBasedOnFixingRecoDate = this.findIndexBasedOnFixingRecoDate(
      this.productData.fixingRecommendationsDate
    );
    this.indexFixingRecoDate = indexBasedOnFixingRecoDate;
  },
  async created() {
    const siteId = this.getCurrentSite.id;
    if (this.productData) {
      const { data } = await SupervisorService.get(
        `/api/v1/sites/${siteId}/products/${this.productData.id}/stock`
      );
      this.initialStock = data;
    }
    if (this.tableDataProps.isAggregated === false) {
      const productRef = (this.productData?.name ?? "").includes(
        this.productData?.externalId
      )
        ? ""
        : `${this.productData?.externalId} - `;
      this.itemName =
        productRef +
        `${this.productData?.name ?? ""} (${
          this.productData?.units?.isDefaultUnit
            ? this.productData?.units?.defaultUnitName
            : this.productData?.units?.secondaryUnitName
        })`;
    } else if (this.tableDataProps.tagIds?.length === 1) {
      const tagId = this.tableDataProps.tagIds[0];
      this.tagData = await TagsService.fetchTagById(tagId);
      this.itemName = "#" + this.tagData?.name;
    }
  },
  methods: {
    ...mapMutations("planning", [
      "updateChartDataFromTableData",
      "resetChartData",
      "setUpdatingCount",
      "addToTablesWithChanges",
      "removeFromTablesWithChanges",
      "resetTablesWithChanges"
    ]),
    hoverFixingRecoDate(indexOrNull) {
      this.indexHoverFixingRecoDate = indexOrNull;
    },
    async saveFixingRecoDate(indexOrNull) {
      this.indexFixingRecoDate = indexOrNull;
      this.indexHoverFixingRecoDate = null;
      // save the new date in backend
      try {
        let newFixingRecoDate = null;
        if (indexOrNull !== null)
          newFixingRecoDate = this.tableDataProps.periods[indexOrNull];
        await ProductsService.updateFixingRecoDate(
          this.tableDataProps.productInfo.id,
          {
            fixing_recommendations_date: newFixingRecoDate
          }
        );
        NotificationService.success(
          newFixingRecoDate === null
            ? this.$t("forecastsReview.successDeletingNewFixingRecoDate")
            : this.$t("forecastsReview.successSavingNewFixingRecoDate")
        );
      } catch (error) {
        NotificationService.error(
          this.$t("forecastsReview.errorSavingNewFixingRecoDate")
        );
        throw error;
      }
    },
    findIndexBasedOnFixingRecoDate(fixingRecoDate) {
      const periodType = this.tableDataProps.periodType;
      if (
        !fixingRecoDate ||
        dayjs(fixingRecoDate).isBefore(dayjs(), periodType)
      )
        return null;
      let index = 0;
      for (let [indexPeriod, period] of this.tableDataProps.periods.entries()) {
        // this.tableDataProps.periods[0] is yesterday date no matter the timebucket chosen
        // we don't want to take yesterday date into account so we skip it
        if (indexPeriod === 0) continue;
        index = indexPeriod;
        if (dayjs(fixingRecoDate).isSame(dayjs(period), periodType)) break;
      }
      return index;
    },
    async loadSubItems(sourceName) {
      let products = [];
      let tags = [];
      if (this.submittedOptions.submittedMultipleMethod === "name") {
        products = this.tableDataProps.isAggregated
          ? Object.keys(this.submittedOptions.submittedProducts || {})
          : [this.tableDataProps.productInfo.id];
      } else if (this.submittedOptions.submittedMultipleMethod === "tag") {
        tags = this.tableDataProps.isAggregated
          ? Object.keys(this.submittedOptions.submittedTags || {})
          : [];
        products = this.tableDataProps.isAggregated
          ? []
          : [this.tableDataProps.productInfo.id];
      }
      const payload = {
        productIds: products,
        tagIds: tags,
        periodType: this.submittedOptions.submittedPeriodType,
        startDate: this.submittedOptions.submittedStartDate,
        endDate: this.submittedOptions.submittedEndDate,
        shouldLoadExpiredStock: this.shouldLoadExpiredStock
      };
      const loader = createSubItemsLoader(sourceName);
      const subItems = await loader.fetch(payload);
      this.insertSubItems(subItems);
    },
    insertSubItems(subItems) {
      this.tableData = { ...this.tableData, ...subItems };
      this.tableDataCopy = cloneDeep({ ...this.tableDataCopy, ...subItems });
      // use that to force insert the item to parent
      this.tableDataProps.data = cloneDeep({ ...this.tableData, ...subItems });
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
    updateValue({ index, sourceName }) {
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
    async updatePreview({ newValue, index, sourceName }) {
      newValue = newValue === null ? newValue : +newValue;
      const values = this.tableData[sourceName].values;
      const parent = this.tableData[sourceName].parent;
      const transferDelta = (newValue ?? 0) - values[index];
      values[index] = newValue;
      this.tableData[sourceName] = {
        ...this.tableData[sourceName],
        values: values
      };
      switch (true) {
        case sourceName.startsWith(SOURCE_NAME.TRANSFER): {
          const { trFrom, trTo } = this.tableData[sourceName];
          const entryFrom = Object.entries(this.tableData).find(
            ([, source]) => {
              return source.parent === parent && +source.storageSite === trFrom;
            }
          );
          const entryTo = Object.entries(this.tableData).find(([, source]) => {
            return source.parent === parent && +source.storageSite === trTo;
          });
          this.tableData[entryFrom[0]].values = this.tableData[
            entryFrom[0]
          ].values.map((val, idx) => {
            if (idx >= index) {
              //As we know the entryTo is exactly to same length than entryFrom
              this.tableData[entryTo[0]].values[idx] =
                this.tableData[entryTo[0]].values[idx] + transferDelta;
              return val - transferDelta;
            }
            return val;
          });
          break;
        }
        case sourceName === SOURCE_NAME.ORDERS:
        case sourceName === SOURCE_NAME.STATUS_3_SUPPLIES:
        case sourceName.startsWith(SOURCE_NAME.ORDERS): {
          if (
            !this.tableData[SOURCE_NAME.STOCK_EXPIRED] &&
            this.shouldLoadExpiredStock
          )
            await this.loadSubItems(SOURCE_NAME.STOCK);
          if (parent && parent !== sourceName) {
            if (sourceName !== SOURCE_NAME.STATUS_3_SUPPLIES) {
              const hasChanged =
                this.tableDataCopy[sourceName].values[index] !==
                this.tableData[sourceName].values[index];
              const originalEditedBy =
                this.tableDataCopy[sourceName].editedBy[index];
              this.tableData[sourceName].editedBy[index] = hasChanged
                ? "user"
                : originalEditedBy;
            }
            const newParentValue = Object.keys(this.tableData).reduce(
              (res, curSourceName) => {
                if (
                  curSourceName === SOURCE_NAME.STATUS_3_SUPPLIES ||
                  curSourceName.startsWith(`${SOURCE_NAME.ORDERS}-`)
                ) {
                  res += +this.tableData[curSourceName].values[index];
                }
                return res;
              },
              0
            );
            this.tableData[parent].values[index] = newParentValue;
          }
          const defaultStorageSiteId =
            this.tableDataProps.productInfo.defaultSupplyStorageId;
          this.tableData = updateRelatedSourcesWithChildren(
            parent || sourceName,
            index,
            this.tableData,
            { defaultStorageSiteId },
            this.getCurrentSite.hasStockWithBacklog
          );
          // Planned orders are actually all orders,
          // so they include s3 supplies and should be updated in case of any input (s3 or normal)
          this.updateChartDataFromTableData({
            indexFrom: index,
            stockDelta: transferDelta,
            status3SuppliesDelta:
              sourceName === SOURCE_NAME.STATUS_3_SUPPLIES
                ? transferDelta
                : null,
            plannedSuppliesDelta: transferDelta
          });
          return;
        }
        default: {
          return undefined;
        }
      }
    },
    showDiscardConfirm() {
      Swal.fire({
        ...baseOptions,
        title: this.$t("planningTable.discardTitle"),
        text: this.$t("planningTable.discardText"),
        confirmButtonText: this.$t("planningTable.discardConfirmButton"),
        cancelButtonText: this.$t("planningTable.discardCancelButton")
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
          title: this.$t("planningTable.saveTitle"),
          confirmButtonText: this.$t("planningTable.saveConfirmButton"),
          cancelButtonText: this.$t("planningTable.saveCancelButton")
        }).then(async result => {
          if (result.isConfirmed) {
            await this.saveDraft();
          }
        });
    },
    resetDraft() {
      const curStockVals = cloneDeep(this.tableData.stock.values);
      const curOrdersVals = cloneDeep(this.tableData.orders.values);
      const curS3SVals = cloneDeep(this.tableData.status3Supplies.values);
      this.tableData = cloneDeep(this.tableDataCopy);
      const stockDeltas = curStockVals.map(
        (val, index) => this.tableDataCopy.stock.values[index] - val
      );
      const ordersDeltas = curOrdersVals.map(
        (val, index) => this.tableDataCopy.orders.values[index] - val
      );
      const status3SuppliesDeltas = curS3SVals.map(
        (val, index) => this.tableDataCopy.status3Supplies.values[index] - val
      );
      this.tableDataProps.data = cloneDeep(this.tableData);
      // Resetting the chart data is done by reverting the deltas previously applied
      this.resetChartData({
        stockDeltas,
        ordersDeltas,
        status3SuppliesDeltas
      });
      this.resetTablesWithChanges();
    },
    async saveDraft() {
      this.savingDraft = true;
      this.setUpdatingCount(1);
      let payload = {
        transfers: [],
        supply: []
      };
      const productId = parseInt(this.tableDataProps.productId);
      payload.productId = productId;
      Object.entries(this.tableData)
        .map(sourceData => ({
          sourceName: sourceData[0],
          changedIndexList: sourceData[1].changedIndexList
        }))
        .forEach(sourceData => {
          if (
            sourceData?.sourceName === SOURCE_NAME.STATUS_3_SUPPLIES ||
            !sourceData?.changedIndexList
          ) {
            return;
          }
          if (this.tableData[sourceData.sourceName].isTransfer) {
            payload.transfers.push(
              ...sourceData.changedIndexList
                .map(index =>
                  PlanningService.formatTransferPayload({
                    productId: parseInt(productId),
                    quantity:
                      this.tableData[sourceData.sourceName].values[index],
                    period: this.tableDataProps.periods[index],
                    periodType: this.tableDataProps.periodType,
                    fromId: this.tableData[sourceData.sourceName].trFrom,
                    toId: this.tableData[sourceData.sourceName].trTo
                  })
                )
                .flat()
            );
          } else {
            payload.supply.push(
              ...sourceData.changedIndexList
                .map(index =>
                  PlanningService.formatSupplyPayload({
                    productId: productId,
                    quantity:
                      this.tableData[sourceData.sourceName].values[index],
                    period: this.tableDataProps.periods[index],
                    periodType: this.tableDataProps.periodType,
                    supplierId: this.tableData[sourceData.sourceName].supplier
                  })
                )
                .flat()
            );
          }
        });
      try {
        await PlanningService.updatePlanning(payload);
        this.resetStatus3Supplies();
        Object.keys(this.tableDataCopy).forEach(key => {
          this.tableDataCopy[key].values = cloneDeep(
            this.tableData[key].values
          );
          if (this.tableData[key].editedBy) {
            this.tableDataCopy[key].editedBy =
              this.tableData[key].editedBy.slice();
          }
        });
        this.resetDraft();
        await AlertApiService.computingAlerts({
          productSiteIds: [parseInt(this.tableDataProps.productId)]
        });
      } finally {
        this.savingDraft = false;
        this.setUpdatingCount(-1);
      }
    },
    resetStatus3Supplies() {
      const changedIndexList =
        this.tableData[SOURCE_NAME.STATUS_3_SUPPLIES].changedIndexList;
      if (!changedIndexList || changedIndexList.length === 0) return;
      const deltas = this.tableData[
        SOURCE_NAME.STATUS_3_SUPPLIES
      ].changedIndexList.map(index => ({
        index,
        value:
          this.tableDataCopy[SOURCE_NAME.STATUS_3_SUPPLIES].values[index] -
          this.tableData[SOURCE_NAME.STATUS_3_SUPPLIES].values[index]
      }));
      const defaultStorageSiteId =
        this.tableDataProps.productInfo.defaultSupplyStorageId;
      deltas.forEach(delta => {
        // reset in part the parent row "orders"
        this.tableData[SOURCE_NAME.ORDERS].values[delta.index] =
          this.tableData[SOURCE_NAME.ORDERS].values[delta.index] + delta.value;
        // reset in part of the stock level + the related storage site
        this.tableData = updateRelatedSourcesWithChildren(
          SOURCE_NAME.ORDERS,
          delta.index,
          this.tableData,
          { defaultStorageSiteId },
          this.getCurrentSite.hasStockWithBacklog
        );
      });
      const status3SuppliesDeltas = this.tableData[
        SOURCE_NAME.STATUS_3_SUPPLIES
      ].values.map(() => 0);
      deltas.forEach(d => (status3SuppliesDeltas[d.index] = d.value));
      // reset chart with the update stock level
      this.resetChartData({
        ordersDeltas: status3SuppliesDeltas,
        status3SuppliesDeltas
      });

      // reset the status3Supplies back to original
      this.tableData[SOURCE_NAME.STATUS_3_SUPPLIES].values =
        this.tableDataCopy[SOURCE_NAME.STATUS_3_SUPPLIES].values;
    },
    async updateCollapse(label) {
      this.tableData[label].isLoading = true;
      const currentRow = this.tableData[label];
      if (!currentRow.isParent) return;
      const subItems = Object.values(this.tableData || []).filter(
        obj => obj.parent === label
      );
      this.tableData[label] = {
        ...this.tableData[label],
        collapsed: !(currentRow?.collapsed ?? true)
      };
      this.tableDataCopy[label] = {
        ...this.tableDataCopy[label],
        collapsed: !(this.tableDataCopy[label]?.collapsed ?? true)
      };
      if (!this.tableData[label].collapsed) {
        if (label === SOURCE_NAME.STOCK) {
          if (subItems.length === 0) {
            await this.loadSubItems(label);
            // if the storage sites are not yet fetched from the backend
            // we should apply the changes made in the plan after we fetch the storage site values
            this.applyDeltasToDefaultStorageSite();
          }
        }
      }
      this.tableData[label].isLoading = false;
      const { isLoading, collapsed } = this.tableData[label];
      this.tableDataProps.data[label] = {
        ...this.tableDataProps.data[label],
        isLoading,
        collapsed
      };
    },
    applyDeltasToDefaultStorageSite() {
      let deltasObj = {};
      Object.keys(this.tableData).forEach(sourceName => {
        if (sourceName.startsWith(SOURCE_NAME.ORDERS)) {
          const changedIndexList = this.tableData[sourceName].changedIndexList;
          if (changedIndexList) {
            const values = this.tableData[sourceName].values;
            const originalValues = this.tableData[sourceName].originalValues;
            changedIndexList.forEach(index => {
              if (!deltasObj[index]) deltasObj[index] = 0;
              deltasObj[index] += values[index] - originalValues[index];
            });
          }
        }
      });
      if (Object.keys(deltasObj).length === 0) return;
      const defaultStorageSiteId =
        this.tableDataProps?.productInfo?.defaultSupplyStorageId;
      if (defaultStorageSiteId === undefined) return;
      let totalDelta = 0;
      this.tableData[`stock-${defaultStorageSiteId}`].values.forEach(
        (value, index) => {
          totalDelta += deltasObj[index] ? deltasObj[index] : 0;
          this.tableData[`stock-${defaultStorageSiteId}`].values[index] +=
            totalDelta;
        }
      );
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
    showDrawer() {
      this.drawerVisible = true;
    },
    async preferUnitChange(selectedUnit) {
      this.$emit("update:preferUnitChange", {
        selectedUnit,
        productId: parseInt(this.tableDataProps.productId)
      });
    }
  }
};
</script>
