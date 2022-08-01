<i18n>
{
  "en": {
    "demand_forecast": "Demand Forecast",
    "planning_forecast": "Planning Forecast",
    "multipleItems": "Multiple Items",
    "aggregatedView": "Aggregated View",
    "viewBy": "view by",
    "day": "days",
    "week": "weeks",
    "month": "months",
    "of": "of",
    "demandToggle": "Demand"
  },
  "fr": {
    "demand_forecast": "Prévisions demande",
    "planning_forecast": "Prévisions planning",
    "multipleItems": "Produits Multiple",
    "aggregatedView": "Vue agrégée",
    "viewBy": "vue par",
    "day": "jours",
    "week": "semaines",
    "month": "mois",
    "of": "sur",
    "demandToggle": "Demande"
  }
}
</i18n>
<template>
  <BaseModal :visible="showModal" :fix-modal="true" v-on="$listeners">
    <div class="h-screen overflow-y-auto">
      <!-- define a tabindex while binding a not input element -->
      <div v-if="isReady" ref="content" tabindex="0" class="outline-none">
        <div
          v-mutation.immediate="
            el => ($refs.content.style.paddingTop = `${el.offsetHeight}px`)
          "
          class="fixed top-0 left-0 w-full z-[3] shadow-md bg-white grid grid-cols-[1fr_256px_1fr] gap-4"
        >
          <div class="flex flex-col">
            <div
              v-if="shouldDisplayProductSwitchComponent"
              class="flex items-center"
            >
              <div
                class="flex items-center justify-end bg-gray-200 mr-4"
                style="width: 200px; height: 40px"
              >
                <div class="text-gray-600" style="margin-right: 10px">
                  {{
                    `${selectedItemIndex} ${$t("of")} ${selectableItemCount}`
                  }}
                </div>
                <BaseButton
                  type="action"
                  icon="arrow-left-s-line"
                  @click="handleProductChange(-1)"
                />
                <BaseButton
                  type="action"
                  icon="arrow-right-s-line"
                  @click="handleProductChange(1)"
                />
              </div>
              <p class="text-sm text-gray-500">
                {{ $t("site") }}: {{ currentSite.name }}
              </p>
            </div>
            <div class="pl-8 flex-grow flex items-center">
              <BaseButton
                type="secondary"
                icon="arrow-left-s-line"
                class="flex-none"
                @click="showDiscardConfirm(havingChanges)"
              />
              <div v-if="currentConfig.selectedItems" class="my-1 mx-4 text-lg">
                <template v-if="currentConfig.selectedItems.length > 1">
                  <p class="text-sm text-gray-500">
                    {{ $t("site") }}: {{ currentSite.name }}
                  </p>
                  <p>
                    {{ $t("aggregatedView") }}
                  </p>
                </template>
                <template v-else>
                  <p
                    v-if="!shouldDisplayProductSwitchComponent"
                    class="text-sm text-gray-500"
                  >
                    {{ $t("site") }}: {{ currentSite.name }}
                  </p>
                  <p>
                    {{ currentConfig.selectedItems[0].name }}
                    <span
                      v-if="isMTOProduct"
                      class="underline underline-offset-4 decoration-gray-300"
                    >
                      MTO
                    </span>
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ currentConfig.selectedItems[0].external_id }}
                  </p>
                </template>
              </div>
            </div>
          </div>
          <div class="flex space-x-2 items-center justify-center">
            <BaseToggleButton
              :activate="modalSelectedView === PLANNING_DEMAND_VIEW.DEMAND"
              size="medium"
              class="h-min"
              @click="setDefaultView('demand')"
            >
              {{ $t("demandToggle") }}
            </BaseToggleButton>
            <BaseToggleButton
              v-if="!isSupplier"
              :activate="modalSelectedView === PLANNING_DEMAND_VIEW.PLANNING"
              size="medium"
              class="h-min"
              @click="setDefaultView('planning')"
            >
              Planning
            </BaseToggleButton>
          </div>
          <div class="flex justify-end items-center">
            <div
              class="flex items-center h-full px-8 py-4 mx-8 border-l border-r time-block"
              :class="{ 'mx-1': currentConfig.selectedItems.length <= 1 }"
            >
              <div>
                <div class="my-1 flex text-xs space-x-4">
                  <div>{{ $t("viewBy") }}</div>
                  <div class="mx-2">
                    <span
                      v-for="(timebucket, index) in timebuckets"
                      :key="`timbucket-${timebucket}`"
                      @click="
                        () => updatePeriodType(timebucket, modalSelectedView)
                      "
                    >
                      <span
                        class="cursor-pointer hover:text-blue-400"
                        :class="
                          selectedTimebucket === timebucket
                            ? 'timebucket-active'
                            : 'border-b'
                        "
                      >
                        {{ $t(timebucket) }}</span
                      >
                      <span v-if="index + 1 < timebuckets.length" class="px-1">
                        /
                      </span>
                    </span>
                  </div>
                </div>

                <BaseCalendar
                  :target-module="modalSelectedView"
                  :fix-start-date="modalSelectedView === 'planning'"
                  :locale="locale"
                  @calendar-date-change="loadData"
                />
              </div>
            </div>
            <div v-if="modalSelectedView !== 'demand'" class="mx-4">
              <BaseButton
                type="action"
                icon="settings-4-fill"
                @click="handleDrawer({ shouldShowDrawer: true })"
              />
            </div>
          </div>
        </div>
        <div class="my-2">
          <template ref="chart">
            <div
              class="p-6 border-b border-gray-100 rounded-lg mb-12 relative bg-white"
            >
              <BaseChart
                :locale="locale"
                :chart-data="finalChartData"
                :default-view="modalSelectedView"
              />
            </div>
            <div>
              <DemandTables
                v-if="modalSelectedView === PLANNING_DEMAND_VIEW.DEMAND"
                @handle-changes="handleChanges"
              />
              <PlanningTables v-else @handle-changes="handleChanges" />
            </div>
          </template>
        </div>
      </div>

      <div
        v-else
        class="w-full flex justify-center items-center"
        style="height: 500px"
      >
        <BaseDotLoader />
      </div>
      <template v-if="showDrawer">
        <SourcesDrawer
          :selected-view="modalSelectedView"
          :show-drawer="showDrawer"
          @close="
            shouldReload =>
              handleDrawer({ shouldShowDrawer: false, shouldReload })
          "
        />
      </template>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import BaseModal from "@/components/base/components/BaseModal.vue";
import BaseCalendar from "@/components/base/components/BaseCalendar.vue";
import BaseChart from "@/components/base/components/BaseChart.vue";
import DemandTables from "@/forecasts-review/components/demand/DemandTables.vue";
import PlanningTables from "@/forecasts-review/components/planning/PlanningTables.vue";
import BaseDotLoader from "@/components/contents/common/BaseDotLoader.vue";
import SourcesDrawer from "@/forecasts-review/components/SourcesDrawer.vue";
import BaseToggleButton from "@/components/base/components/button/BaseToggleButton.vue";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import { baseOptions } from "@/sweetalert";
import {
  computed,
  defineComponent,
  ref,
  SetupContext,
  toRefs,
  watch
} from "@vue/composition-api";
import { useBaseResources } from "@/forecasts-review/store";
import {
  IForecastsReviewModalProps,
  CONFIG_NAME,
  PLANNING_DEMAND_VIEW
} from "@/forecasts-review/typings";
import { useCalendarDates } from "../composables/calendar";
import {
  addToDate,
  currentDate,
  FlowlityDateUnit,
  PERIOD_TYPES
} from "@/helper/date";
import { useI18n } from "vue-i18n-composable";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default defineComponent({
  name: "ForecastsReviewModal",
  components: {
    BaseButton,
    BaseModal,
    BaseChart,
    DemandTables,
    PlanningTables,
    BaseDotLoader,
    BaseToggleButton,
    BaseCalendar,
    SourcesDrawer
  },
  mixins: [],
  props: {
    currentConfig: {
      type: Object,
      required: true
    }
  },
  emits: ["change-product"],
  setup(props: IForecastsReviewModalProps, context: SetupContext) {
    const { t } = useI18n();
    const havingChanges = ref(false);
    const showModal = ref(true);
    const showDrawer = ref(false);
    const content = ref<HTMLDivElement | null>(null);
    const { currentConfig } = toRefs(props);
    const { selectableItemCount } = currentConfig.value;
    const { periodType, updatePeriodType, updateEndDate } = useCalendarDates(
      context!.parent!.$store!
    );
    const {
      getMe,
      currentSite,
      tablesData,
      demandGetChartData,
      demandGetIsLoadingChart,
      planningDemandView,
      planningGetIsLoadingChart,
      demandGetIsLoadingTables,
      planningGetChartData,
      planningGetIsLoadingTables,
      updateDataType,
      resetDemandState,
      updateDemandPage,
      updateDemandTableOnly,
      updateSelectedProducts,
      updateSelectedTags,
      fetchData
    } = useBaseResources(context);
    const modalSelectedView = ref(planningDemandView.value);
    const defaultTimeBucket = computed<FlowlityDateUnit>(() =>
      modalSelectedView.value === PLANNING_DEMAND_VIEW.PLANNING
        ? currentSite.value.defaultPlanningTimeBucket
        : currentSite.value.defaultDemandTimeBucket
    );
    const getHorizonInWeeks = (selectedView: PLANNING_DEMAND_VIEW) =>
      currentSite.value?.[`${selectedView}HorizonWeeks`];
    const timebuckets = computed(() =>
      modalSelectedView.value === PLANNING_DEMAND_VIEW.DEMAND
        ? ["week", "month"]
        : ["day", "week", "month"]
    );
    const selectedTimebucket = computed(
      () => periodType.value[modalSelectedView.value]
    );
    const isReady = computed(() => {
      return modalSelectedView.value === PLANNING_DEMAND_VIEW.DEMAND
        ? !demandGetIsLoadingChart.value && !demandGetIsLoadingTables.value
        : !planningGetIsLoadingChart.value && !planningGetIsLoadingTables.value;
    });
    const isSupplier = computed(() => {
      return currentSite.value.isSupplierView;
    });
    const selectedItems = computed(() => currentConfig.value.selectedItems);
    const currentItem = computed(() => currentConfig.value.selectedItems[0]);
    const itemsPerPage = computed(() => currentConfig.value.itemsPerPage);
    const currentPage = computed(() => currentConfig.value.currentPage);
    const products = computed(() => currentConfig.value.items);
    const isMTOProduct = computed<string>(
      () =>
        tablesData.value.length === 1 && tablesData.value[0].productData?.isMto
    );

    const calcCurrentIndex = () =>
      products.value.findIndex(item => item.id === currentItem.value.id) +
      1 +
      itemsPerPage.value * (currentPage.value - 1);
    const selectedItemIndex = ref(calcCurrentIndex());

    const shouldDisplayProductSwitchComponent = computed(() => {
      return selectableItemCount >= 2 && selectedItems.value.length === 1;
    });
    const finalChartData = computed(
      () =>
        (modalSelectedView.value === PLANNING_DEMAND_VIEW.DEMAND
          ? demandGetChartData.value
          : planningGetChartData.value) ?? {}
    );
    const loadData = () => {
      if (currentConfig.value.name === CONFIG_NAME.PRODUCT)
        updateSelectedProducts(currentConfig.value.selectedItems);
      else {
        updateSelectedTags(currentConfig.value.selectedItems);
      }
      updateDataType(currentConfig.value.name);
      resetDemandState();
      updateDemandPage(1);
      updateDemandTableOnly(false);
      fetchData(modalSelectedView.value);
      selectedItemIndex.value = calcCurrentIndex();
    };
    const closeModal = () => {
      showModal.value = false;
      if (modalSelectedView.value === PLANNING_DEMAND_VIEW.DEMAND)
        //@ts-ignore
        window.hj("event", "back_to_demand_list");
    };
    const showDiscardConfirm = async (
      changes: Boolean = false,
      close: Boolean = true
    ) => {
      let resolver: (value: boolean) => void;
      const promise = new Promise(resolve => {
        resolver = resolve;
      });
      if (changes) {
        Swal.fire({
          ...baseOptions,
          title: t("discardTitle").toString(),
          text: t("discardText").toString(),
          confirmButtonText: t("discardConfirmButton").toString(),
          cancelButtonText: t("discardCancelButton").toString()
        }).then(result => {
          if (result.isConfirmed) {
            if (close) closeModal();
            resolver(true);
          }
          resolver(false);
        });
      } else {
        if (close) closeModal();
        return Promise.resolve(true);
      }
      return promise;
    };
    const handleDrawer = ({
      shouldShowDrawer,
      shouldReload = false
    }: {
      shouldShowDrawer: boolean;
      shouldReload: boolean;
    }) => {
      showDrawer.value = shouldShowDrawer;
      if (shouldReload) loadData();
    };
    const handleProductChange = (position: number) => {
      if (currentConfig.value.selectedItems.length === 1) {
        context?.emit("change-product", position);
      }
    };
    const handleChanges = (changed: boolean) => {
      havingChanges.value = changed;
    };
    const setDefaultView = async (view: PLANNING_DEMAND_VIEW) => {
      if (await showDiscardConfirm(havingChanges.value, false)) {
        modalSelectedView.value = view;
        havingChanges.value = false;
      }
    };
    updateEndDate(
      addToDate(
        currentDate(),
        getHorizonInWeeks(PLANNING_DEMAND_VIEW.DEMAND),
        PERIOD_TYPES.WEEK
      ),
      PLANNING_DEMAND_VIEW.DEMAND
    );
    updateEndDate(
      addToDate(
        currentDate(),
        getHorizonInWeeks(PLANNING_DEMAND_VIEW.PLANNING),
        PERIOD_TYPES.WEEK
      ),
      PLANNING_DEMAND_VIEW.PLANNING
    );
    updatePeriodType(defaultTimeBucket.value, modalSelectedView.value);
    loadData();
    window.addEventListener("keyup", function (event) {
      switch (event.key) {
        case "ArrowLeft":
          handleProductChange(-1);
          break;
        case "ArrowRight":
          handleProductChange(1);
          break;
      }
    });

    watch(
      () => currentConfig.value.selectedItems,
      (cur, old) => {
        if (old && old.length > 0 && cur[0].id !== old[0].id) {
          if (cur.length !== 0) loadData();
        }
      },
      { deep: true, immediate: true }
    );
    watch(
      [selectedTimebucket, modalSelectedView],
      (
        [newSelectedTimebucket, newModalSelectedView],
        [oldSelectedTimebucket, oldModalSelectedView]
      ) => {
        if (newModalSelectedView !== oldModalSelectedView) {
          updatePeriodType(
            defaultTimeBucket.value,
            newModalSelectedView as PLANNING_DEMAND_VIEW
          );
          loadData();
        }
        if (newSelectedTimebucket !== oldSelectedTimebucket) loadData();
      }
    );

    return {
      currentSite,
      showModal,
      locale: getMe.value.locale,
      timebuckets,
      selectedTimebucket,
      havingChanges,
      showDrawer,
      modalSelectedView,
      isReady,
      isSupplier,
      finalChartData,
      isMTOProduct,
      content,
      handleProductChange,
      loadData,
      showDiscardConfirm,
      handleDrawer,
      handleChanges,
      setDefaultView,
      updatePeriodType,
      PLANNING_DEMAND_VIEW,
      selectableItemCount,
      selectedItemIndex,
      shouldDisplayProductSwitchComponent
    };
  }
});
</script>

<style lang="scss" scoped>
.time-block {
  background: #fafafa;
}

.timebucket-active {
  color: #0a6ee3;
}
</style>
