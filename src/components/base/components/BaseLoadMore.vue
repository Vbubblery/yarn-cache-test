<template>
  <div class="flex justify-center">
    <BaseSpinner v-if="dataAreLoading" class="text-gray-400 mx-auto" />
    <BaseInfiniteScroller
      v-if="hasMoreData"
      :page="currentPage"
      @observed="event => $emit('iteratePage', event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import BaseSpinner from "@/components/base/components/BaseSpinner.vue";
import BaseInfiniteScroller from "@/components/contents/common/BaseInfiniteScroller.vue";
export default defineComponent({
  name: "BaseLoadMore",
  components: {
    BaseSpinner,
    BaseInfiniteScroller
  },
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    hasMoreData: {
      type: Boolean,
      required: true,
      default: false
    },
    dataAreLoading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ["iteratePage"]
});
</script>
