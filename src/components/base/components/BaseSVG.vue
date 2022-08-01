<template>
  <svg
    v-svg
    :symbol="`svg-${name}`"
    :size="size"
    @click="$emit('click', $event)"
    @mousedown="$emit('mousedown', $event)"
  />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "BaseSVG",
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      required: false,
      default: 24
    }
  },
  emits: ["click", "mousedown"]
});
</script>
