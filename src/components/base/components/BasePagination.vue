<template>
  <div class="flex justify-center items-end w-full">
    <a-pagination
      :current="currentPage"
      :total="itemsTotal"
      :show-size-changer="showSizeChanger"
      :page-size-options="itemsPerPageOptions"
      :page-size="currentItemsPerPage"
      :show-less-items="showLessItems"
      hide-on-single-page
      @change="changePage"
      @showSizeChange="updateItemsPerPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from "@vue/composition-api";
import { Pagination } from "ant-design-vue";

interface IPaginationFooter {
  currentPage: Number;
  pages: Number;
  itemsTotal: Number;
  currentItemsPerPage: Number;
  itemsPerPageOptions: Array<String>;
  showSizeChanger: Boolean;
  showLessItems: Boolean;
  showPaginationBar: Boolean;
}

export default defineComponent({
  name: "PaginatedFooter",
  components: {
    "a-pagination": Pagination
  },
  props: {
    currentPage: {
      type: Number,
      default: 1,
      required: false
    },
    pages: {
      type: Number,
      default: 1,
      required: false
    },
    itemsTotal: {
      type: Number,
      default: 1,
      required: false
    },
    currentItemsPerPage: {
      type: Number,
      default: 20,
      required: false
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => ["20", "50", "100"],
      required: false
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
  emits: ["items-per-page", "change-page"],
  setup(_props: IPaginationFooter, context: SetupContext) {
    const updateItemsPerPage = (_current: number, itemsCount: number) => {
      context.emit("items-per-page", itemsCount);
    };
    const changePage = (pageNumber: number) => {
      context.emit("change-page", pageNumber >= 1 ? pageNumber : 1);
    };
    return {
      updateItemsPerPage,
      changePage
    };
  }
});
</script>

<style scoped lang="scss">
::v-deep(.ant-pagination) {
  @apply flex justify-center flex-wrap;
}
::v-deep(.ant-pagination) li {
  @apply mb-3;
}
</style>
