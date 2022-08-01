<i18n>
{
  "fr": {
    "stockouts":"Jours de stock à zéro",
    "avgDays":"En %",
    "noData":"Pas de données",
    "stockoutsTips":"Pourcentage moyen de jours sans stock."
  },
  "en": {
    "stockouts":"Zero stock days",
    "avgDays":"In %",
    "noData": "No data",
    "stockoutsTips":"Average percentage of days without stock."
  }
}
</i18n>
<template>
  <home-widget-card-template>
    <template #title>
      <div class="sm:w-auto flex items-center">
        <span>{{ $t("stockouts") }}</span>
        <div class="pl-2 inline-block">
          <BaseTooltip placement="bottom" :content="$t('stockoutsTips')">
            <BaseSVG name="information-fill" size="20" class="text-gray-400" />
          </BaseTooltip>
        </div>
      </div>
    </template>
    <template #subtitle>
      {{ $t("avgDays") }}
    </template>
    <template #body>
      <div v-if="chartData.labels.length > 0" class="chartContainer h-56">
        <base-bar-chart :chart-data="formattedChartData" :options="options" />
      </div>
      <div v-else class="flex justify-center items-center h-full">
        <div>{{ $t("noData") }}</div>
      </div>
    </template>
  </home-widget-card-template>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import HomeWidgetCardTemplate from "./HomeWidgetCardTemplate.vue";
import BaseBarChart from "@/components/contents/charts/BaseBarChart.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import { mapGetters } from "vuex";
import { themeColors, hexToRgba } from "@/helper/colors";
import helper from "@/helper/helper";

export default defineComponent({
  name: "HomeSummaryOutOfStock",
  components: {
    BaseSVG,
    HomeWidgetCardTemplate,
    BaseBarChart,
    BaseTooltip
  },
  props: {
    rawData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartData: {}
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite", "getMe"]),
    formattedChartData() {
      return {
        ...this.chartData,
        labels: this.chartData.labels.map(label =>
          helper.defaultDateLabelDisplay(label, this.getMe.locale)
        )
      };
    },
    options() {
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        elements: {
          rectangle: {
            backgroundGradientColors: [
              hexToRgba(themeColors["fl-blue"]),
              hexToRgba(themeColors["fl-green-3"], 0.2)
            ]
          }
        },
        tooltips: {
          mode: "index",
          position: "center",
          intersect: false,
          backgroundColor: "white",
          titleFontColor: "#172945",
          titleAlign: "center",
          titleFontSize: 15,
          titleMarginBottom: 18,
          bodyFontColor: "#172945",
          bodySpacing: 12,
          bodyFontSize: 15,
          xPadding: 15,
          yPadding: 15,
          borderWidth: 1,
          borderColor: "lightGrey",
          caretSize: 0,
          callbacks: {
            labelColor: () => {
              let backgroundColor = "#38BFF0";
              return {
                backgroundColor,
                borderColor: backgroundColor
              };
            },
            label: tooltipItem => {
              return `  ${tooltipItem.yLabel}%`;
            }
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false
              },
              ticks: {
                padding: 5,
                fontColor: themeColors["fl-ingenious-ivory"]
              }
            }
          ],
          yAxes: [
            {
              id: "y-stockouts",
              gridLines: {
                zeroLineColor: hexToRgba(
                  themeColors["fl-ingenious-ivory"],
                  0.1
                ),
                color: hexToRgba(themeColors["fl-ingenious-ivory"], 0.25),
                drawBorder: false,
                borderDash: [5, 5],
                drawTicks: false
              },
              ticks: {
                padding: 10,
                beginAtZero: true,
                maxTicksLimit: 10,
                min: 0,
                fontColor: themeColors["fl-ingenious-ivory"],
                callback: this.yAxesTicksCallback
              }
            }
          ]
        }
      };
      return chartOptions;
    }
  },
  watch: {
    rawData() {
      this.showAvgStockouts();
    }
  },
  created() {
    this.showAvgStockouts();
  },
  methods: {
    yAxesTicksCallback(value) {
      return value;
    },
    generateDatasets(dataSource) {
      return [
        {
          label: `${this.$t("stockouts")}`,
          data: Object.values(dataSource ?? {}),
          yAxisID: "y-stockouts",
          fill: false,
          borderColor: "#38BFF0",
          borderWidth: 1
        }
      ];
    },
    showAvgStockouts() {
      this.chartData = {
        labels: Object.keys(this.rawData.avgSiteStockouts ?? {}),
        datasets: this.generateDatasets(this.rawData.avgSiteStockouts)
      };
    }
  }
});
</script>
<style lang="scss" scoped>
.chartContainer > div {
  position: relative;
  height: 100%;
}
</style>
