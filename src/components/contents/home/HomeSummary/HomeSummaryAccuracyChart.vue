<i18n>
{
  "fr": {
    "accuracy":"Précision de la prédiction",
    "in":"en",
    "month": "mois | mois",
    "aggregated": "Agrégée",
    "average": "Moyen",
    "weight": "Pondérée",
    "noData":"Pas de données",
    "mapeExplanation": "MAPE définit la différence absolue moyenne entre les prévisions et les chiffres réels. Plus le MAPE est proche de zéro, meilleures sont les prévisions.",
    "whatMAPE": "Qu'est-ce que la MAPE?",
    "accuracyTips": "précision des prévisions à 1 mois, 3 mois et 6 mois en tant qu'horizon de prévision agrégée (prévision cumulée par rapport à la demande cumulée) et pondérée (avec pondération spécifique au produit via la demande réelle) MAPE."
  },
  "en": {
    "accuracy":"Forecast accuracy",
    "in":"in",
    "month": "month | months",
    "aggregated": "Aggregated",
    "average": "Average",
    "weight": "Weighted",
    "noData": "No data",
    "mapeExplanation": "MAPE defines the average absolute difference in between the forecast and the actuals. The closer to zero the MAPE is, the better the forecast.",
    "whatMAPE": "What is the MAPE?",
    "accuracyTips": "forecast accuracy at 1 month, 3 months and 6 months forecast horizon as Aggregated (cumulated forecast compared to cumulated demand) and Weighted (with product specific weighting via Actual Demand) MAPE."
  }
}
</i18n>
<template>
  <home-widget-card-template>
    <template #title>
      <div class="sm:w-auto flex items-center">
        <span>{{ $t("accuracy") }}</span>
        <div class="pl-2 inline-block">
          <BaseTooltip placement="bottom" :content="$t('accuracyTips')">
            <BaseSVG name="information-fill" size="20" class="text-gray-400" />
          </BaseTooltip>
        </div>
      </div>
    </template>
    <template #subtitle>
      <BaseTooltip
        placement="bottom-start"
        :title="$t('whatMAPE')"
        :content="$t('mapeExplanation')"
      >
        <div class="cursor-pointer flex items-center space-x-2">
          <span> MAPE {{ $t("in") }} % </span>
          <BaseSVG
            name="information-fill"
            size="20"
            class="text-sm text-gray-400"
          />
        </div>
      </BaseTooltip>
    </template>
    <template #options>
      <div
        class="flex text-fl-ingenious-ivory justify-end pt-1 text-sm font-bold"
      >
        <div
          :class="`
            ${
              currentSource === 'aggregated' ? 'text-black' : ''
            } mr-4 cursor-pointer`"
          @click="showAggregated"
        >
          {{ $t("aggregated") }}
        </div>
        <!-- Remove temporarily the average accuracy -->
        <div
          v-if="false"
          :class="`
            ${
              currentSource === 'average' ? 'text-black' : ''
            } mr-4 cursor-pointer`"
          @click="showAverage"
        >
          {{ $t("average") }}
        </div>
        <div
          :class="`
            ${
              currentSource === 'weight' ? 'text-black' : ''
            } mr-4 cursor-pointer`"
          @click="showWeight"
        >
          {{ $t("weight") }}
        </div>
      </div>
    </template>
    <template #body>
      <div v-if="chartData.labels.length > 0" class="chartContainer h-56">
        <base-line-chart :chart-data="formattedChartData" :options="options" />
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
import BaseLineChart from "@/components/contents/charts/BaseLineChart.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import { mapGetters } from "vuex";
import { themeColors, hexToRgba } from "@/helper/colors";
import helper from "@/helper/helper";
import BaseSVG from "@/components/base/components/BaseSVG.vue";

export default defineComponent({
  name: "HomeSummaryAccuracyChart",
  components: {
    HomeWidgetCardTemplate,
    BaseLineChart,
    BaseTooltip,
    BaseSVG
  },
  props: {
    rawData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentSource: "",
      chartData: {}
    };
  },
  computed: {
    ...mapGetters("common", ["getMe"]),
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
          display: true
        },
        elements: {
          point: {
            radius: 0
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
            labelColor: tooltipItem => {
              let backgroundColor = "";
              switch (tooltipItem.datasetIndex) {
                case 0:
                  backgroundColor = "#38BFF0";
                  break;
                case 1:
                  backgroundColor = "#418CE4";
                  break;
                case 2:
                  backgroundColor = "#FF6460";
                  break;
                default:
                  break;
              }
              return {
                backgroundColor,
                borderColor: backgroundColor
              };
            },
            label: (tooltipItem, data) => {
              const label = data.datasets[tooltipItem.datasetIndex].label;
              return label ? `${label}: ${tooltipItem.yLabel} %` : "";
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
              id: "y-accuracy",
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
                maxTicksLimit: 5,
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
      this.showAggregated();
    }
  },
  created() {
    this.showAggregated();
  },
  methods: {
    yAxesTicksCallback(value) {
      return value;
    },
    generateDatasets(dataSource) {
      return [
        {
          label: `1 ${this.$tc("month", 1)}`,
          data: Object.values(dataSource?.["m-1"] ?? {}),

          yAxisID: "y-accuracy",
          fill: false,
          borderColor: "#38BFF0",
          borderWidth: 1
        },
        {
          label: `3 ${this.$tc("month", 3)}`,
          data: Object.values(dataSource?.["m-3"] ?? {}),
          yAxisID: "y-accuracy",
          fill: false,
          borderColor: "#418CE4",
          borderWidth: 1
        },
        {
          label: `6 ${this.$tc("month", 6)}`,
          data: Object.values(dataSource?.["m-6"] ?? {}),
          yAxisID: "y-accuracy",
          fill: false,
          borderColor: "#FF6460",
          borderWidth: 1
        }
      ];
    },
    showAggregated() {
      this.chartData = {
        labels: Object.keys(this.rawData.aggSiteAccuracy?.["m-1"] ?? {}),
        datasets: this.generateDatasets(this.rawData.aggSiteAccuracy)
      };
      this.currentSource = "aggregated";
    },
    showAverage() {
      this.chartData = {
        labels: Object.keys(this.rawData.avgSiteAccuracy?.["m-1"] ?? {}),
        datasets: this.generateDatasets(this.rawData.avgSiteAccuracy)
      };
      this.currentSource = "average";
    },
    showWeight() {
      this.chartData = {
        labels: Object.keys(this.rawData.wAvgSiteAccuracy?.["m-1"] ?? {}),

        datasets: this.generateDatasets(this.rawData.wAvgSiteAccuracy)
      };
      this.currentSource = "weight";
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
