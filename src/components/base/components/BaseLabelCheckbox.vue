<template>
  <div class="flex items-center">
    <BaseCheckbox
      :value="value"
      :identifier="identifier"
      class="mr-1 flex-none"
      @input="$emit('input', $event)"
    />
    <label
      :for="identifier"
      class="text-base leading-4 cursor-pointer select-none whitespace-nowrap truncate"
    >
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import BaseCheckbox from "@/components/base/components/BaseCheckbox.vue";

export default defineComponent({
  name: "BaseLabelCheckbox",
  components: { BaseCheckbox },
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
    label: {
      type: String,
      required: true
    }
  },
  emits: ["input"],
  setup() {
    const identifier = `checkbox_${Math.round(Math.random() * 1e8)}`;
    return { identifier };
  }
});
</script>
