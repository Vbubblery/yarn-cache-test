<script>
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import Chart from "chart.js";
import { generateChart } from "vue-chartjs";
import { fillCaptions } from "./plugins/common";
// http://www.chartjs.org/docs/latest/developers/charts.html
Chart.defaults.LineAlt = Chart.defaults.line;
Chart.controllers.LineAlt = Chart.controllers.line.extend({
  initialize: function (chart, datasetIndex) {
    const data = chart.config.data;
    const currentData = data.datasets[datasetIndex];
    Chart.controllers.line.prototype.initialize.apply(this, arguments);
    if (currentData.dottedFromLabel) {
      data.datasets[datasetIndex].dottedFromIndex =
        data.labels.indexOf(currentData.dottedFromLabel) + 1;
    }
  },
  draw: function (ease) {
    const captions = this.chart.options.captions;
    if (captions) {
      fillCaptions(captions, this.chart.chart.ctx);
    }
    const meta = this.getMeta();
    const dottedFromIndex = this.getDataset().dottedFromIndex;
    const originalDatasets = meta.dataset._children;
    if (!dottedFromIndex) {
      Chart.controllers.line.prototype.draw.call(this, ease);
      return;
    }
    meta.dataset._children = originalDatasets.slice(0, dottedFromIndex);
    meta.dataset.draw();
    meta.dataset._view.borderDash = [3, 4];
    meta.dataset._view.borderWidth = 1;
    meta.dataset._children = originalDatasets.slice(
      dottedFromIndex - 1,
      originalDatasets.length
    );
    meta.dataset.draw();
    meta.dataset._children = originalDatasets;
  }
});

// 4. Generate the vue-chartjs component
// First argument is the chart-id, second the chart type.
const CustomLine = generateChart("custom-line", "LineAlt");

export default CustomLine;
</script>
