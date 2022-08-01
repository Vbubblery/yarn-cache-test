import { mapGetters } from "vuex";
import { Bar } from "vue-chartjs";
import helper from "@/helper/helper";
import "chartjs-plugin-annotation";

export default {
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      default: {}
    },
    chartOptions: {
      type: Object,
      default: () => {}
    },
    stacked: {
      type: Boolean,
      default: false
    },
    displayLegend: {
      type: Boolean,
      default: true
    },
    annotations: {
      type: Array,
      default: () => []
    },
    tooltipsFilter: {
      type: Function,
      default: () => {
        return true;
      }
    }
  },
  data() {
    return {
      options: {
        annotation: {
          events: ["click"],
          annotations: this.annotations
        },
        // remove the bouncing animation each time it rerenders
        animation: false,
        elements: {
          point: {
            radius: 0,
            hitRadius: 20
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: this.displayLegend
        },
        tooltips: {
          mode: "index",
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
          filter: this.tooltipsFilter,
          callbacks: {
            // replace NaN by 0 in the tooltip
            label: (tooltipItem, data) => {
              let label = data.datasets[tooltipItem.datasetIndex].label ?? "";
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
              stacked: this.stacked,
              type: "linear",
              display: true,
              position: "left",
              id: "y-axis-default",
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
    displayOptions() {
      return helper.isEmpty(this.chartOptions)
        ? this.options
        : this.chartOptions;
    }
  },
  updated() {
    this.renderChart(this.chartData, this.displayOptions);
  },
  methods: {
    yTicks(value) {
      let res = helper.formatNumber(value);
      return res;
    },
    xTicks(value) {
      return helper.dateToDisplay(value, this.getMe.locale);
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.displayOptions);
  },
  watch: {
    chartData() {
      this.$forceUpdate();
    },
    stacked() {
      this.options.scales.yAxes[0].stacked = this.stacked;
      this.$forceUpdate();
    }
  }
};
