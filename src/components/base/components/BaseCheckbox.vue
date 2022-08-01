<template>
  <input
    :id="identifier"
    :value="value"
    type="checkbox"
    class="checkbox"
    :class="{ 'checkbox--checked': value }"
    @click="$emit('click', $event)"
    @input="$emit('input', !value)"
  />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "BaseCheckbox",
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },
    identifier: {
      type: String,
      required: false,
      default: undefined
    }
  },
  emits: ["input", "click"]
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.checkbox {
  position: relative;
  width: 20px;
  height: 20px;
  visibility: hidden;
  background: white;
  cursor: pointer;

  &::before {
    visibility: visible;
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid $color-original-500;
    border-radius: 2px;
    transition: 150ms border ease-in-out, background 150ms ease-in-out;
  }

  &::after {
    visibility: visible;
    content: "";
    position: absolute;
    top: 4px;
    left: 7px;
    width: 6px;
    height: 10px;
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    transform: rotate(30deg);
    transition: transform 150ms ease-in-out;
  }

  &--checked::before {
    border-color: $color-blue-600;
    background: $color-blue-600;
  }

  &--checked::after {
    transform: rotate(45deg);
  }
}
</style>
