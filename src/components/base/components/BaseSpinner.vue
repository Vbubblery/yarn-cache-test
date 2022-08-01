<template>
  <BaseSVG :size="size" name="loader-4-fill" class="animate-spin" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api/dist/vue-composition-api";
import BaseSVG from "@/components/base/components/BaseSVG.vue";

export default defineComponent({
  name: "BaseSpinner",
  components: {
    BaseSVG
  },
  props: {
    size: {
      type: [String, Number],
      required: false,
      default: 24
    }
  }
});
</script>
