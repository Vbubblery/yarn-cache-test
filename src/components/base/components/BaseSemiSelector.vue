<template>
  <div class="ss" @click="$emit('click')" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api/dist/vue-composition-api";

export default defineComponent({
  name: "BaseSemiSelector",
  emits: ["click"]
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.ss {
  position: relative;
  width: 20px;
  height: 20px;
  cursor: pointer;
  visibility: hidden;

  &::before {
    visibility: visible;
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: $color-blue-600;
    border-radius: 2px;
  }

  &::after {
    visibility: visible;
    content: "";
    position: absolute;
    top: 9px;
    left: 5px;
    width: 10px;
    height: 2px;
    background: white;
  }
}
</style>
