<i18n>
{
    "en": {
        "backToOrder": "BACK TO ORDERS",
        "orderPlanningTitle": "Product Stock Planning",
        "lotSize": "Lot Size",
        "moq": "MOQ",
        "expectedDelivery": "Expected delivery"
    },
    "fr": {
        "backToOrder": "RETOUR",
        "orderPlanningTitle": "Planning",
        "lotSize": "Taille de lot",
        "moq": "Minimum de commande",
        "expectedDelivery": "Livraison attendue"
    }
}
</i18n>
<template>
  <a-modal
    :visible="visible"
    width="100%"
    height="100%"
    centered
    :closable="false"
    :body-style="{ padding: 0, height: '100%' }"
    dialog-class="pb-0"
    :footer="null"
    @cancel="$emit('close')"
  >
    <div data-testid="order_modal_planning" class="grid grid-cols-10 h-full">
      <div class="col-span-3 bg-fl-light-grey h-full px-16">
        <div class="mt-16">
          <a
            :disabled="getUpdatingCount > 0"
            class="flex items-center"
            @click="$emit('close')"
          >
            <BaseSVG name="arrow-left-s-line" />
            <span class="text-2xl ml-6">{{ $t("backToOrder") }}</span>
          </a>
        </div>
        <div class="mt-12">
          <p class="text-lg">
            {{ $t("expectedDelivery") }}:
            <span class="font-semibold">{{ deliveryDate }}</span>
          </p>
        </div>
      </div>
      <div class="col-span-7 h-full py-2 px-16 w-full bg-white">
        <div v-if="hasDataToShow || getIsLoadingChart || getIsLoadingTables">
          <div
            class="p-16 pb-8 border border-gray-100 rounded-lg mb-12 relative bg-white"
          >
            <div
              v-if="getIsLoadingChart"
              class="w-full flex justify-center items-center"
              style="height: 400px"
            >
              <base-dot-loader />
            </div>
            <div v-else>
              <div
                v-if="chartHasManyProducts"
                class="absolute right-0 top-0 p-4"
              >
                <a-switch
                  size="small"
                  :default-checked="stackedChart"
                  @change="checked => (userStackChoice = checked)"
                />
                <span>
                  <small>
                    {{ $t("stackChoice") }}
                  </small>
                </span>
              </div>
              <div>
                <BaseChart
                  default-view="planning"
                  :chart-data="getChartData"
                  :local="getMe.locale"
                />
              </div>
            </div>
          </div>
          <div
            v-if="getIsLoadingTables"
            class="w-full flex justify-center items-center"
          >
            <base-dot-loader />
          </div>
          <div v-else>
            <planning-tables />
          </div>
        </div>
        <div v-else class="h-full flex items-center">
          <base-empty-state
            :title="$t('emptyTitle')"
            :subtitle1="$t('emptySubtitle1')"
            :subtitle2="$t('emptySubtitle2')"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseEmptyState from "@/components/contents/common/BaseEmptyState.vue";
import BaseChart from "@/components/base/components/BaseChart.vue";
import PlanningTables from "@/forecasts-review/components/planning/PlanningTables.vue";
import BaseDotLoader from "@/components/contents/common/BaseDotLoader.vue";
import { Switch } from "ant-design-vue";
import NotificationService from "@/services/notification.service";
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  name: "OrderPlanning",
  components: {
    BaseSVG,
    "a-switch": Switch,
    BaseEmptyState,
    BaseChart,
    PlanningTables,
    BaseDotLoader
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    deliveryDate: {
      type: String,
      required: true
    }
  },
  emits: ["close", "handle:planningSaved"],
  data() {
    return {
      showSidebar: true,
      userStackChoice: true
    };
  },
  computed: {
    ...mapGetters("planning", [
      "getChartData",
      "getIsLoadingChart",
      "getIsLoadingTables",
      "getNoData",
      "getUpdatingCount"
    ]),
    ...mapGetters("common", ["getMe"]),
    hasDataToShow(): boolean {
      return this.getChartData?.labels?.length > 0 ?? false;
    },
    chartHasManyProducts(): boolean {
      return (
        this.getChartData.datasets.filter(
          (dataset: { fill: boolean }) => dataset.fill
        ).length > 1
      );
    },
    stackedChart(): boolean {
      return this.chartHasManyProducts && this.userStackChoice;
    }
  },
  watch: {
    getNoData(newValue: string) {
      if (newValue) NotificationService.info(this.$t("noDataInfo"));
    },
    getUpdatingCount: function (newCount: number): void {
      // avoid fetching before updating
      // should fetch only AFTER updating
      if (newCount === 0) this.$emit("handle:planningSaved");
    }
  }
});
</script>

<style>
.ant-modal-content {
  height: 100%;
}
</style>
