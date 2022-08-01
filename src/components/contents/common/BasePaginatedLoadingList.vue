<template>
  <div class="paginated-loading-list">
    <base-data-list-loader
      :api-service="apiService"
      :endpoint="endpoint"
      :filters="filters"
      :reload="reload"
      :before-paginate="beforePaginate"
      @dataLoaded="sendProcessedItems"
    >
      <template #listItems="{ data }">
        <slot v-if="data.loading" name="loading" :loading="data.loading">
          <div>Loading...</div>
        </slot>
        <slot v-else-if="data.error" name="error" :error="data.error">
          <div>There was an error somewhere</div>
        </slot>
        <slot v-else-if="!(data.rawData.results || []).length" name="nodata">
          <div>No data</div>
        </slot>
        <div v-else>
          <base-paginated-list
            :items="makeListItems(data.rawData.results)"
            :default-page-size="pageSize"
            :default-page="currentPage"
            :total="data.rawData.total"
            :show-size-changer="showSizeChanger"
            :show-less-items="showLessItems"
            :show-pagination-bar="showPaginationBar"
            partial
            @pageChange="handlePageChange"
            @pageSizeChange="handlePageSizeChange"
          >
            <template #item="{ item: listItem }">
              <slot name="listItem" :listItem="listItem" />
            </template>
          </base-paginated-list>
        </div>
      </template>
    </base-data-list-loader>
  </div>
</template>

<script>
export default {
  name: "BasePaginatedLoadingList",
  components: {
    "base-data-list-loader": () =>
      import("@/components/contents/common/BaseDataListLoader.vue"),
    "base-paginated-list": () =>
      import("@/components/contents/common/BasePaginatedList.vue")
  },
  props: {
    apiService: {
      type: Object,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    reload: {
      type: Boolean,
      default: false
    },
    baseFilters: {
      type: Object,
      default: () => null
    },
    defaultPageSize: {
      type: Number,
      default: () => 10
    },
    beforePaginate: {
      type: Function,
      default: rawItems => rawItems
    },
    customItems: {
      type: Array,
      default: () => []
    },
    showSizeChanger: {
      type: Boolean,
      default: () => true
    },
    showLessItems: {
      type: Boolean,
      default: () => false
    },
    showPaginationBar: {
      type: Boolean,
      default: () => true
    }
  },
  emits: ["itemsProcessed"],
  data() {
    return {
      pageSize: this.defaultPageSize || 10,
      filters: { per_page: this.defaultPageSize || 10, ...this.baseFilters },
      currentPage: 1
    };
  },
  watch: {
    baseFilters() {
      this.filters = {
        per_page: this.pageSize,
        ...this.baseFilters
      };
      if (this.baseFilters.page) this.currentPage = this.baseFilters.page;
    }
  },
  methods: {
    makeListItems(rawDataItems) {
      if (this.customItems.length) return this.customItems;
      return this.beforePaginate(rawDataItems);
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum;
      this.filters = { ...this.filters, page: pageNum };
    },
    handlePageSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.filters = { ...this.filters, page: 1, per_page: size };
    },
    sendProcessedItems(rawData) {
      this.$emit("itemsProcessed", this.beforePaginate(rawData.results));
    }
  }
};
</script>
