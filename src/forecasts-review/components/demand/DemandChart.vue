<i18n>
{
  "en": {
    "title": "Forecasts",
    "myforecast": "My forecast",
    "demandFinalForecast": "Final forecast",
    "allOrders": "Forecasted shipments",
    "firmOrders": "Confirmed shipments",
    "historicalDemand": "Past demand",
    "supplierDemand": "Actual customer consumption",
    "maxFlowPred": "Confidence interval",
    "minFlowPred": "Confidence interval",
    "demandForecastFlowlity": "Flowlity forecast"
  },
  "fr": {
    "title": "Prédictions",
    "myforecast": "Ma prédiction",
    "demandFinalForecast": "Prédiction finale",
    "allOrders": "Expéditions prévisionnelles",
    "firmOrders": "Expéditions confirmées",
    "historicalDemand": "Demande passée",
    "supplierDemand": "Consommation réelle du client",
    "maxFlowPred": "Intervalle de confiance",
    "minFlowPred": "Intervalle de confiance",
    "demandForecastFlowlity": "Prédiction Flowlity"
  }
}
</i18n>

<template>
  <div>
    <div>
      <ul ref="legend" class="flex items-center justify-end space-x-5" />
    </div>
    <ChartContainer
      class="w-full flex-shrink"
      :chart-data="formattedChartData"
      :options="formattedOptions"
    />
  </div>
</template>

<script>
import ChartContainer from "@/components/base/chart/ChartContainer.vue";
import { mapGetters } from "vuex";
import helper from "@/helper/helper";
import dayjs from "@/dayjs";

export default {
  name: "DemandChart",
  components: { ChartContainer },
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options: {
        // remove the bouncing animation each time it rerenders
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          mode: "index",
          intersect: false,
          backgroundColor: "white",
          titleFontColor: "#505050",
          titleAlign: "left",
          titleFontSize: 18,
          titleMarginBottom: 18,
          bodyFontColor: "#505050",
          bodySpacing: 12,
          bodyFontSize: 15,
          xPadding: 15,
          yPadding: 15,
          borderWidth: 1,
          borderColor: "lightGrey",
          callbacks: {
            // replace NaN by 0 in the tooltip
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              let label = dataset.label ?? "";
              if (dataset.source === "minFlowPred") label += " - min";
              if (dataset.source === "maxFlowPred") label += " - max";
              if (label) {
                label += ": ";
              }
              label += isNaN(tooltipItem.yLabel)
                ? "0"
                : Math.round(tooltipItem.yLabel * 100) / 100 || 0;
              return label;
            }
          }
        },
        hover: {
          mode: "nearest",
          intersect: true
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                color: "rgba(0, 0, 0, 0)"
              },
              id: "x-axis-0",
              ticks: {
                callback: this.xTicks
              }
            }
          ],
          yAxes: [
            {
              stacked: false,
              type: "linear",
              display: true,
              position: "left",
              id: "y-axis-0",
              ticks: {
                callback: this.yTicks,
                beginAtZero: true,
                precision: 0
              },
              gridLines: {
                borderDash: [4, 4]
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    ...mapGetters("common", ["getMe"]),
    formattedChartData() {
      return {
        ...this.chartData,
        labels:
          this.chartData.labels?.map(label =>
            helper.tableHeaderDateDisplay(label, this.chartData.timebucket)
          ) || []
      };
    },
    formattedOptions() {
      return {
        ...this.options,
        lineAtIndex: [
          {
            label: "",
            strokeStyle: "black",
            fillStyle: "black",
            lineDash: [5, 4],
            position: this.formattedChartData.labels.indexOf(
              helper.tableHeaderDateDisplay(dayjs(), this.chartData.timebucket)
            )
          }
        ]
      };
    }
  },
  mounted() {
    this.legendCallback(this.chartData);
  },
  methods: {
    yTicks(value) {
      let res = helper.formatNumber(value);
      return res;
    },
    xTicks(value) {
      return helper.dateToDisplay(value, this.getMe.locale);
    },
    legendCallback(chartData) {
      if (chartData.datasets) {
        chartData.datasets.forEach(dataset => {
          dataset.label = this.$t(dataset.source);
          if (dataset.source !== "minFlowPred") {
            let li = document.createElement("li");
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.marginBottom = "10px";
            let colorDot = document.createElement("div");
            colorDot.style.backgroundColor = dataset.borderColor;
            colorDot.style.width = "10px";
            colorDot.style.height = "10px";
            colorDot.style.borderRadius = "100%";
            colorDot.style.marginRight = "8px";
            colorDot.style.marginLeft = "8px";
            li.appendChild(colorDot);
            let p = document.createElement("p");
            p.textContent = dataset.label;
            p.style.marginBottom = "0px";
            p.style.fontSize = "13px";
            li.appendChild(p);
            this.$refs.legend.appendChild(li);
          }
        });
      }
    }
  }
};
</script>
