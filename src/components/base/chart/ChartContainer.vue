<script>
import CustomLine from "./CustomLine.vue";
import backgroundZonePlugin from "./plugins/backgroundZonePlugin";
import verticalLinePlugin from "./plugins/verticalLinePlugin";

export default {
  extends: CustomLine,
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, this.options);
    }
  },
  mounted() {
    this.addPlugin(verticalLinePlugin);
    this.addPlugin(backgroundZonePlugin);
    this.renderChart(this.chartData, this.options);
  }
};
</script>

<style></style>
