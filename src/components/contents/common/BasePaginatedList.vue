<template>
  <div>
    <ul>
      <slot v-for="item in displayItems" name="item" :item="item" />
    </ul>
    <div v-if="showPaginationBar" class="flex justify-center mt-5">
      <a-pagination
        :page-size="pageSize"
        :current="page"
        :total="itemsTotal"
        :show-size-changer="showSizeChanger"
        :show-less-items="showLessItems"
        @change="changePage"
        @showSizeChange="onShowSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { Pagination } from "ant-design-vue";

export default {
  name: "BasePaginatedList",
  components: {
    "a-pagination": Pagination
  },
  props: {
    items: {
      validator: items => {
        return items.every(item => typeof item === "object");
      },
      type: Array,
      required: true
    },
    searchFilter: {
      type: String,
      required: false,
      default: ""
    },
    total: {
      type: Number,
      default: () => null
    },
    defaultPage: {
      type: Number,
      default: () => null
    },
    defaultPageSize: {
      type: Number,
      default: () => null
    },
    partial: {
      type: Boolean,
      default: () => false
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
  emits: ["pageSizeChange", "pageChange"],
  data() {
    return {
      page: this.defaultPage || 1,
      pageSize: this.defaultPageSize || 10
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchFilter) return this.items;
      return this.items.filter(
        item =>
          item.name.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1
      );
    },
    displayItems() {
      const page = this.partial ? 0 : this.page - 1;
      const startDisplay = page * this.pageSize;
      const endDisplay = startDisplay + this.pageSize;
      return this.filteredItems.slice(startDisplay, endDisplay);
    },
    itemsTotal() {
      const tot = this.total || this.filteredItems.length;
      return tot;
    }
  },
  watch: {
    items() {
      if (this.page !== 1) this.page = this.defaultPage || 1;
    },
    searchFilter() {
      if (this.page !== 1) this.page = 1;
    }
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.$emit("pageSizeChange", pageSize);
    },
    changePage(pageNum) {
      this.page = pageNum;
      this.$emit("pageChange", pageNum);
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .ant-pagination {
  @apply flex justify-center flex-wrap;
}
::v-deep .ant-pagination li {
  @apply mb-3;
}
</style>
