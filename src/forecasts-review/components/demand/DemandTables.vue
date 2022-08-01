<template>
  <div>
    <div v-for="(tableData, index) in tablesData" :key="index">
      <DemandTablesTable :table-data-props="tableData" v-on="$listeners" />
    </div>
    <div class="flex justify-center mb-8">
      <a-pagination
        :current="getPage"
        :total="total"
        :show-size-changer="false"
        :show-less-items="true"
        hide-on-single-page
        @change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { Pagination } from "ant-design-vue";
import DemandTablesTable from "@/forecasts-review/components/demand/DemandTablesTable.vue";
export default {
  name: "DemandTables",
  components: {
    DemandTablesTable,
    "a-pagination": Pagination
  },
  computed: {
    ...mapGetters("demand", ["getPage"]),
    ...mapState("demand", {
      tablesData: state => state.demandData.tablesData
    }),
    total() {
      if (this.tablesData.length && !this.tablesData[0].isAggregated)
        return this.tablesData[0].total;
      return 0;
    }
  },
  methods: {
    ...mapActions("demand", ["fetchDemandData"]),
    ...mapMutations("demand", [
      "updatePage",
      "updateOnlyTable",
      "resetHasTablesWithChanges"
    ]),
    changePage(page) {
      this.updatePage(page);
      this.updateOnlyTable(true);
      this.fetchDemandData();
      this.resetHasTablesWithChanges();
    }
  }
};
</script>
