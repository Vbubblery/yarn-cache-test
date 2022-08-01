<template>
  <div>
    <div v-if="formattedChartData">
      <div>
        <ul ref="legend" class="flex items-center justify-end space-x-5" />
      </div>
      <ChartContainer
        class="w-full flex-shrink"
        :chart-data="formattedChartData"
        :options="finalOptions"
      />
    </div>
    <div v-else class="w-full text-center text-lg">{{ $t("emptyData") }}</div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  toRefs
} from "@vue/composition-api";
import helper from "@/helper/helper";
import ChartContainer from "@/components/base/chart/ChartContainer.vue";
import dayjs from "@/dayjs";
import { useI18n } from "vue-i18n-composable";
import { i18n } from "@/i18n/i18n@next";

interface IDataset {
  label?: string;
  source: string;
  borderColor: string;
}
interface IChart {
  locale: string;
  defaultView: string;
  options: object;
  chartData: {
    labels: Array<string>;
    datasets: Array<IDataset>;
    timebucket: string;
  };
}
const baseOptions = (locale: string) => ({
  // remove the bouncing animation each time it rerenders
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  tooltips: {
    mode: "index",
    yAlign: "center",
    xAlign: "center",
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
      label: (
        tooltipItem: {
          datasetIndex: number;
          yLabel: number;
          index: number;
        },
        data: {
          datasets: Array<{ label?: string; source: string; data: number[] }>;
        }
      ) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        let label = dataset.label ?? "";
        if (dataset.source === "minFlowPred") label += " - min";
        if (dataset.source === "maxFlowPred") label += " - max";
        if (dataset.source === "allOrders") {
          label = i18n.t("planning.chart.plannedOrders").toString();
          tooltipItem.yLabel -= data.datasets.find(
            d => d.source === "firmOrders"
          )!.data[tooltipItem.index];
        }
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
          callback: (value: string) => helper.dateToDisplay(value, locale)
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
          callback: (value: string) => helper.formatNumber(value),
          beginAtZero: true,
          precision: 0
        },
        gridLines: {
          borderDash: [4, 4]
        }
      }
    ]
  }
});

export default defineComponent({
  name: "BaseChart",
  components: { ChartContainer },
  props: {
    locale: {
      type: String,
      required: false,
      default: "en"
    },
    chartData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    defaultView: {
      type: String,
      required: true
    }
  },
  setup(props: IChart) {
    const { t } = useI18n();
    const verticalLineViews = ["demand"];
    const legend = ref<HTMLElement | null>(null);

    const { chartData, locale, defaultView, options } = toRefs(props);
    const formattedChartData = computed(() => {
      return Object.keys(chartData.value).length
        ? {
            ...chartData.value,
            labels:
              chartData.value?.labels?.map(label =>
                helper.tableHeaderDateDisplay(
                  label,
                  chartData.value?.timebucket
                )
              ) || []
          }
        : null;
    });
    const finalOptions = computed(() => ({
      ...baseOptions(locale.value),
      ...(verticalLineViews.includes(defaultView.value) && {
        lineAtIndex: [
          {
            label: "",
            strokeStyle: "black",
            fillStyle: "black",
            lineDash: [5, 4],
            position: formattedChartData.value?.labels?.indexOf(
              helper.tableHeaderDateDisplay(
                dayjs(),
                chartData.value?.timebucket
              )
            )
          }
        ]
      }),
      ...options.value
    }));
    const legendCallback = (data: { datasets: Array<IDataset> }) => {
      if (data.datasets) {
        data.datasets.forEach(dataset => {
          dataset.label = t(
            `${defaultView.value}.chart.${dataset.source}`
          ).toString();
          if (
            (defaultView.value === "demand" &&
              dataset.source !== "minFlowPred") ||
            (defaultView.value === "planning" &&
              !["intervalMin", "firmOrders"].includes(dataset.source))
          ) {
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
            p.textContent = dataset.label || "";
            p.style.marginBottom = "0px";
            p.style.fontSize = "13px";
            li.appendChild(p);
            legend.value?.appendChild(li);
          }
        });
      }
    };
    onMounted(() => {
      legendCallback(chartData.value);
    });
    return {
      t,
      legend,
      finalOptions,
      formattedChartData,
      legendCallback
    };
  }
});
</script>
