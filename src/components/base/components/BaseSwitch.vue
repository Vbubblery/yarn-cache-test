<template>
  <div
    class="switch"
    :class="{ 'switch--enabled': value }"
    @click="$emit('input', !value)"
  />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "BaseSwitch",
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  emits: ["input"]
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.switch {
  position: relative;
  width: 30px;
  height: 18px;
  border-radius: 15px;
  background: $color-original-400;
  cursor: pointer;
  transition: background 150ms ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 8px;
    transition: left 250ms cubic-bezier(0.74, -0.84, 0.25, 1.71);
  }

  &--enabled {
    background: $color-blue-600;

    &::before {
      left: 17px;
    }
  }
}
</style>
