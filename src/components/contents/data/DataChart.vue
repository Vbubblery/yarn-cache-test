<template>
  <div>
    <base-chart :chart-data="chartData" />
  </div>
</template>

<script>
import BaseChart from "@/components/contents/charts/BaseChart";
import { mapState } from "vuex";

export default {
  components: {
    BaseChart
  },
  computed: {
    ...mapState("data", {
      chartData: state => state.data.chartData
    })
  }
};
</script>
