<i18n>
{
  "en": {
    "mySupply": "My Supply"
  },
  "fr": {
    "mySupply": "Mon Plan"
  }
}
</i18n>

<template>
  <div>
    <div v-for="(tableData, index) in tablesData" :key="index">
      <planning-tables-table
        :table-data-props="tableData"
        v-on="$listeners"
        @update:preferUnitChange="preferUnitChange"
      />
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
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { Pagination } from "ant-design-vue";
import PlanningTablesTable from "@/forecasts-review/components/planning/PlanningTablesTable.vue";
import ProductsService from "@/services/products.service";
import { createSubItemsLoader } from "@/components/base/table/utils/base";

export default {
  name: "PlanningTables",
  components: {
    PlanningTablesTable,
    "a-pagination": Pagination
  },
  computed: {
    ...mapGetters("planning", ["getPage"]),
    ...mapState("planning", {
      tablesData: state => state.planningData.tablesData,
      submittedOptions: state => state.submittedOptions
    }),
    total() {
      const ids = Object.keys(this.tablesData);
      if (ids.length > 0 && !this.tablesData[ids[0]].isAggregated)
        return this.tablesData[ids[0]].total;
      return 0;
    }
  },
  methods: {
    ...mapActions("common", ["updateHasSelectedAggregated"]),
    ...mapActions("planning", ["updatePlanningData"]),
    ...mapMutations("planning", ["resetHasTablesWithChanges"]),
    loadSubItems(tableData, sourceName) {
      let products = [];
      let tags = [];
      if (this.submittedOptions.submittedMultipleMethod === "name") {
        products = tableData.isAggregated
          ? Object.keys(this.submittedOptions.submittedProducts || {})
          : [tableData.productInfo.id];
      } else if (this.submittedOptions.submittedMultipleMethod === "tag") {
        tags = tableData.isAggregated
          ? Object.keys(this.submittedOptions.submittedTags || {})
          : [];
        products = tableData.isAggregated ? [] : [tableData.productInfo.id];
      }
      const payload = {
        productIds: products,
        tagIds: tags,
        periodType: this.submittedOptions.submittedPeriodType,
        startDate: this.submittedOptions.submittedStartDate,
        endDate: this.submittedOptions.submittedEndDate
      };
      const loader = createSubItemsLoader(sourceName);
      return loader.fetch(payload);
    },
    changePage(page) {
      this.updateHasSelectedAggregated(false);
      this.updatePlanningData(page);
      this.resetHasTablesWithChanges();
    },
    async preferUnitChange({ selectedUnit, productId }) {
      await ProductsService.updateProductIsDefaultUnit(
        productId,
        selectedUnit === "default"
      );
      this.updatePlanningData();
    }
  }
};
</script>
