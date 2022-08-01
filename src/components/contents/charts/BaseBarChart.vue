<script>
import { Bar } from "vue-chartjs";
import { createChartGradient } from "@/helper/chart";
import "chartjs-plugin-annotation";
// eslint-disable-next-line import/no-extraneous-dependencies
import Chart from "chart.js";

Chart.Tooltip.positioners.center = (chartElements, coordinates) => {
  if (!chartElements.length) {
    return false;
  }
  return {
    x: coordinates.x,
    y: 10
  };
};

export default {
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartOptions() {
      const START_COLOR_IDX = 0;
      const STOP_COLOR_IDX = 1;
      const chartOptions = {
        ...this.options
      };
      const gradientColors =
        chartOptions?.elements?.rectangle?.backgroundGradientColors;
      if (gradientColors) {
        const ctx = this.$refs.canvas.getContext("2d");
        chartOptions.elements.rectangle.backgroundColor = createChartGradient(
          ctx,
          gradientColors[START_COLOR_IDX],
          gradientColors[STOP_COLOR_IDX]
        );
      }
      return chartOptions;
    }
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, this.chartOptions);
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
};
</script>
