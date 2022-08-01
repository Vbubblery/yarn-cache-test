<i18n>
{
  "fr": {
    "daysOfCoverage": "Couverture de stock",
    "days": "jours",
    "valueLegend": "Valeur de stock totale",
    "valueLabel":"Valeur",
    "quantityLabel":"Quantité",
    "allStock":"stock global",
    "trendsHistoryValue":"Évolution du stock (historique et prévision)",
    "noQuantityTips":"Il existe plusieurs unités de mesure par défaut pour cette selection. L'agrégation des quantités n'est pas possible.",
    "trendsHistoryTips": "Évolution de l'inventaire affiché en valeur totale (avec la devise par défaut), ratio de rotation des stocks (demande divisée par l'inventaire moyen) et jours de couverture (365 divisé par ratio de rotation des stocks)."
  },
  "en": {
    "daysOfCoverage": "Stock coverage",
    "days": "days",
    "valueLegend": "Total stock value",
    "valueLabel":"Value",
    "quantityLabel":"Quantity",
    "allStock":"all stock",
    "trendsHistoryValue":"Inventory Evolution (history and forecast)",
    "noQuantityTips":"There are multiple default units of measures for this scope. Aggregating quantities is not possible.",
    "trendsHistoryTips": "Evolution of inventory displayed in Total Value (with default currency), Inventory Turnover Ratio (demand divided by average inventory) and Days of Coverage (365 divided by Inventory Turnover Ratio)."
  }
}
</i18n>
<template>
  <home-widget-card-template>
    <template #title>
      <div class="sm:w-auto flex items-center">
        <span>{{ $t("trendsHistoryValue") }}</span>
        <div class="pl-2 inline-block">
          <BaseTooltip placement="bottom" :content="$t('trendsHistoryTips')">
            <BaseSVG name="information-fill" size="20" class="text-gray-400" />
          </BaseTooltip>
        </div>
      </div>
    </template>
    <template #subtitle>
      {{ $t("allStock") }}
    </template>
    <template #options>
      <div
        class="flex text-fl-ingenious-ivory justify-end pt-1 text-sm font-bold"
      >
        <div
          :class="`
            ${
              currentSource === 'price' ? 'text-black' : ''
            } mr-4 cursor-pointer`"
          @click="showPrice"
        >
          {{ $t("valueLabel") }}
        </div>
        <div
          :class="`
            ${currentSource === 'quantity' ? 'text-black' : ''} mr-4 ${
            getCurrentSite.hasSameDefaultUnit
              ? 'cursor-pointer'
              : 'cursor-not-allowed'
          }`"
          @click="showQuantity"
        >
          <BaseTooltip
            placement="bottom-end"
            :display="!getCurrentSite.hasSameDefaultUnit"
            :content="$t('noQuantityTips')"
          >
            {{ $t("quantityLabel") }}
          </BaseTooltip>
        </div>
      </div>
    </template>
    <template #body>
      <div class="chartContainer h-56">
        <base-line-chart :chart-data="chartData" :options="options" />
      </div>
    </template>
  </home-widget-card-template>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import dayjs from "dayjs";
import HomeWidgetCardTemplate from "./HomeWidgetCardTemplate.vue";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseLineChart from "@/components/contents/charts/BaseLineChart.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import { mapGetters } from "vuex";
import { themeColors, hexToRgba } from "@/helper/colors";
import helper from "@/helper/helper";

export default defineComponent({
  name: "HomeSummaryTrendsHistory",
  components: {
    BaseSVG,
    HomeWidgetCardTemplate,
    BaseLineChart,
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
      currentSource: "",
      chartData: {},
      daysOfCoverage: []
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite", "getMe"]),
    currentMonth() {
      return dayjs().format("MMM YYYY", this.getMe.locale).toLowerCase();
    },
    options() {
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            filter: function (item) {
              return !item.text.includes(" - prediction");
            }
          }
        },
        elements: {
          point: {
            radius: 0
          },
          line: {
            backgroundGradientColors: [
              hexToRgba(themeColors["fl-blue"]),
              hexToRgba(themeColors["fl-green-3"], 0)
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
          filter(tooltipItem) {
            if (
              helper.dateStrCurrentPeriod().includes(tooltipItem.label) &&
              (tooltipItem.datasetIndex === 1 ||
                tooltipItem.datasetIndex === 3 ||
                tooltipItem.datasetIndex === 5)
            )
              return false;
            return true;
          },
          callbacks: {
            labelColor: tooltipItem => {
              let backgroundColor = "";
              if (this.getCurrentSite.showFutureDashboard)
                switch (tooltipItem.datasetIndex) {
                  case 0:
                    backgroundColor = "#38BFF0";
                    break;
                  case 1:
                    backgroundColor = "#38BFF0";
                    break;
                  case 2:
                    backgroundColor = "#FF6460";
                    break;
                  case 3:
                    backgroundColor = "#FF6460";
                    break;
                  default:
                    break;
                }
              else
                switch (tooltipItem.datasetIndex) {
                  case 0:
                    backgroundColor = "#38BFF0";
                    break;
                  case 1:
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
            //translate the tooltip title
            title: titles => {
              return helper.defaultDateLabelDisplay(
                titles[0].label,
                this.getMe.locale
              );
            },
            label: (tooltipItem, data) => {
              if (tooltipItem.yLabel) {
                let labelName =
                  data.datasets[tooltipItem.datasetIndex].label ?? "";
                const isFuture = labelName.split("-").length > 1;
                const isCurrentMonth =
                  dayjs(tooltipItem.label)
                    .format("MMM YYYY", this.getMe.locale)
                    .toLowerCase() === this.currentMonth;
                const labelValue = tooltipItem.yLabel;

                const isDaysOfCoverage =
                  labelName === `${this.$t("daysOfCoverage")}` ||
                  labelName === `${this.$t("daysOfCoverage")} - prediction`;
                const isStockInQuantity =
                  labelName === "Stock" || labelName === "Stock - prediction";

                if (isCurrentMonth && !isFuture) return;
                if (isDaysOfCoverage)
                  return this.daysOfCoverageToolipFormatter({
                    labelName,
                    labelValue
                  });
                if (isStockInQuantity)
                  return this.stockInQuantityToolipFormatter({
                    labelName,
                    labelValue
                  });
                return this.stockInValueToolipFormatter({
                  labelName,
                  labelValue
                });
              }
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
                fontColor: themeColors["fl-ingenious-ivory"],
                callback: this.xAxesTicksCallback
              }
            }
          ],
          yAxes: [
            {
              id: "y-stock",
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
            },
            {
              id: "y-daysOfCoverage",
              type: "linear",
              display: false
            }
          ]
        }
      };
      if (this.getCurrentSite.showFutureDashboard) {
        Object.assign(chartOptions, {
          annotation: {
            annotations: [
              {
                type: "line",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: this.currentMonth,
                borderColor: "rgba(0,0,0,0.6)"
              }
            ]
          }
        });
      }
      return chartOptions;
    }
  },
  watch: {
    rawData() {
      this.initData();
    }
  },
  created() {
    this.initData();
  },
  methods: {
    daysOfCoverageToolipFormatter({ labelName, labelValue }) {
      return `${labelName}: ${labelValue} ${this.$t("days")}`;
    },
    stockInQuantityToolipFormatter({ labelName, labelValue }) {
      return `${labelName}: ${parseInt(labelValue)} ${
        this.getCurrentSite.hasSameDefaultUnit
      }`;
    },
    stockInValueToolipFormatter({ labelName, labelValue }) {
      return `${labelName}: ${Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: this.getCurrentSite.currency,
        maximumSignificantDigits: 6
      }).format(labelValue)}`;
    },
    yAxesTicksCallback(value) {
      if (this.currentSource === "price")
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      else if (this.currentSource === "quantity")
        return (
          new Intl.NumberFormat("fr-FR").format(value) +
          " " +
          this.getCurrentSite.hasSameDefaultUnit
        );
    },
    xAxesTicksCallback(value) {
      return helper.defaultDateLabelDisplay(value, this.getMe.locale);
    },
    injectAdditionalData() {
      this.chartData.datasets.push.apply(
        this.chartData.datasets,
        this.generatePastFutureDatasets(
          this.daysOfCoverage,
          this.$t("daysOfCoverage"),
          "y-daysOfCoverage",
          false,
          "#FF6460",
          2
        )
      );
    },
    generatePastFutureDatasets(
      data,
      datasetBasicLabel,
      yAxisID,
      fill,
      borderColor,
      borderWidth
    ) {
      const past = [...data.slice(0, 7), null, null, null, null, null];
      const future = [null, null, null, null, null, null, ...data.slice(6, 13)];
      const result = [];
      result.push({
        label: datasetBasicLabel,
        data: past,
        yAxisID,
        fill,
        borderColor,
        borderWidth
      });
      if (this.getCurrentSite.showFutureDashboard)
        result.push({
          label: `${datasetBasicLabel} - prediction`,
          data: future,
          yAxisID,
          fill,
          borderColor,
          borderWidth,
          borderDash: [5, 5]
        });
      return result;
    },

    showPrice() {
      this.chartData = {
        labels: this.getCurrentSite.showFutureDashboard
          ? Object.keys(this.rawData.price || {})
          : Object.keys(this.rawData.price || {}).slice(0, 7),
        datasets: this.generatePastFutureDatasets(
          Object.values(this.rawData.price || {}),
          this.$t("valueLegend"),
          "y-stock",
          true,
          "#38BFF0"
        )
      };
      this.injectAdditionalData();
      this.currentSource = "price";
    },
    showQuantity() {
      if (!this.getCurrentSite.hasSameDefaultUnit) return;
      this.chartData = {
        labels: this.getCurrentSite.showFutureDashboard
          ? Object.keys(this.rawData.quantity || {})
          : Object.keys(this.rawData.quantity || {}).slice(0, 7),
        datasets: this.generatePastFutureDatasets(
          Object.values(this.rawData.quantity || {}),
          "Stock",
          "y-stock",
          true,
          "#38BFF0"
        )
      };
      this.injectAdditionalData();
      this.currentSource = "quantity";
    },
    initData() {
      this.daysOfCoverage = Object.values(this.rawData.stockCoverages);
      this.showPrice();
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
