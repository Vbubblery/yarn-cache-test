<template>
  <div class="overflow-y-auto bg-white py-5 px-12 2xl:px-24 h-full">
    <div class="w-1/3 mx-auto">
      <home-tag-dropdown target-module="dashboard" />
    </div>
    <div class="px-6 grid grid-cols-10 gap-x-12 2xl:gap-x-24 gap-y-12">
      <div class="col-span-10 xl:col-span-5">
        <home-summary-trends-history :raw-data="trendsHistoryData" />
      </div>
      <div class="col-span-10 xl:col-span-5">
        <home-summary-out-of-stock :raw-data="outOfStockData" />
      </div>
      <div class="col-span-10 xl:col-span-5">
        <home-summary-accuracy-chart :raw-data="accuracyChartData" />
      </div>
      <div class="col-span-10 xl:col-span-5">
        <home-summary-orders />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import TagsService from "@/services/tags.service";
import { mapGetters } from "vuex";

import HomeSummaryTrendsHistory from "./HomeSummaryTrendsHistory.vue";
import HomeSummaryOrders from "./HomeSummaryOrders.vue";
import HomeSummaryAccuracyChart from "./HomeSummaryAccuracyChart.vue";
import HomeSummaryOutOfStock from "./HomeSummaryOutOfStock.vue";
import HomeTagDropdown from "./HomeTagDropdown.vue";

export default defineComponent({
  name: "HomeSummary",
  components: {
    HomeSummaryOrders,
    HomeSummaryTrendsHistory,
    HomeSummaryAccuracyChart,
    HomeSummaryOutOfStock,
    HomeTagDropdown
  },
  data() {
    return {
      trendsHistoryData: {},
      accuracyChartData: {},
      outOfStockData: {}
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite"]),
    ...mapGetters("dashboard", ["getSelectedTagId"])
  },
  watch: {
    getCurrentSite() {
      this.initData();
    },
    getSelectedTagId() {
      this.initData();
    }
  },
  created() {
    this.initData();
  },
  methods: {
    sumObjectsByKey(...objs) {
      return objs.reduce((a, b) => {
        for (let k in b) {
          if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
        }
        return a;
      }, {});
    },
    avgObjectsByKey(length = 1, ...objs) {
      const result = objs.reduce((a, b) => {
        for (let k in b) {
          if (b.hasOwnProperty(k))
            a[k] = this.round((a[k] || 0) + b[k] / length, 2);
        }
        return a;
      }, {});
      return result;
    },
    round(value, decimals) {
      if (!value) return value;
      return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
    },
    initSiteData() {
      this.trendsHistoryData = {
        price: this.getCurrentSite.currentYearTotalValues,
        quantity: this.getCurrentSite.currentYearMonthlyStock,
        demandValues: Object.values(this.getCurrentSite.currentYearDemand),
        stockCoverages: Object.values(
          this.getCurrentSite.currentYearMonthlyStockCoverage || {}
        )
      };
      this.outOfStockData = {
        avgSiteStockouts: this.getCurrentSite.avgSiteStockouts
      };
      this.accuracyChartData = {
        aggSiteAccuracy: this.reAlignBasedOnM1(
          this.getCurrentSite.aggSiteAccuracy
        ),
        wAvgSiteAccuracy: this.reAlignBasedOnM1(
          this.getCurrentSite.wAvgSiteAccuracy
        ),
        avgSiteAccuracy: this.reAlignBasedOnM1(
          this.getCurrentSite.avgSiteAccuracy
        )
      };
    },
    // this is a quick and dirty hack
    // because we don't know how important the feature is to spend more time on it
    reAlignBasedOnM1(accuracyData) {
      if (!accuracyData["m-1"] || Object.keys(accuracyData["m-1"]).length === 0)
        return accuracyData;
      const labelsM1 = Object.keys(accuracyData["m-1"]);
      const newAccM3 = labelsM1.reduce((acc, item) => {
        acc[item] = accuracyData?.["m-3"]?.[item] ?? null;
        return acc;
      }, {});
      accuracyData["m-3"] = newAccM3;
      const newAccM6 = labelsM1.reduce((acc, item) => {
        acc[item] = accuracyData?.["m-6"]?.[item] ?? null;
        return acc;
      }, {});
      accuracyData["m-6"] = newAccM6;
      return accuracyData;
    },
    async initTagsData() {
      const { data } = await TagsService.fetchTagsReport(this.getSelectedTagId);
      this.trendsHistoryData = data.results.reduce((dict, ele) => {
        dict.price = this.sumObjectsByKey(
          dict.price,
          ele.current_year_total_values
        );
        dict.quantity = this.sumObjectsByKey(
          dict.quantity,
          ele.current_year_monthly_stock
        );
        dict.demandValues = Object.values(
          this.sumObjectsByKey(dict.demandValues, ele.current_year_demand)
        );
        dict.stockCoverages = Object.values(
          this.sumObjectsByKey(
            dict.stockCoverages,
            ele.current_year_monthly_stock_coverage
          )
        );
        return dict;
      }, {});
      this.outOfStockData = data.results.reduce((dict, ele) => {
        dict.avgSiteStockouts = this.sumObjectsByKey(
          dict.price,
          ele.avg_site_stockout
        );
        return dict;
      }, {});

      // Need to optimize here later:
      const length = data.results.length;
      const aggSiteAccuracy = (accuracies => ({
        "m-1": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.agg_site_accuracy?.["m-1"])
        ),
        "m-3": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.agg_site_accuracy?.["m-3"])
        ),
        "m-6": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.agg_site_accuracy?.["m-6"])
        )
      }))(data.results);
      const wAvgSiteAccuracy = (accuracies => ({
        "m-1": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.w_avg_site_accuracy?.["m-1"])
        ),
        "m-3": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.w_avg_site_accuracy?.["m-3"])
        ),
        "m-6": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.w_avg_site_accuracy?.["m-6"])
        )
      }))(data.results);
      const avgSiteAccuracy = (accuracies => ({
        "m-1": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.avg_site_accuracy?.["m-1"])
        ),
        "m-3": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.avg_site_accuracy?.["m-3"])
        ),
        "m-6": this.avgObjectsByKey(
          length,
          ...accuracies.map(i => i.avg_site_accuracy?.["m-6"])
        )
      }))(data.results);
      this.accuracyChartData = {
        aggSiteAccuracy: this.reAlignBasedOnM1(aggSiteAccuracy),
        wAvgSiteAccuracy: this.reAlignBasedOnM1(wAvgSiteAccuracy),
        avgSiteAccuracy: this.reAlignBasedOnM1(avgSiteAccuracy)
      };
    },
    initData() {
      if (this.getSelectedTagId) this.initTagsData();
      else this.initSiteData();
    }
  }
});
</script>
