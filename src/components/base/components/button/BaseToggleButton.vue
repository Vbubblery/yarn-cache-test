<template>
  <button
    :class="`
      rounded-[30px]
      font-montserrat
      font-medium
      normal
      h-full
      py-1
      justify-between
      ${activate ? 'bg-blue-200 text-blue-700' : ''}
     
      ${count ? 'px-1 flex' : 'px-6 inline-block align-middle'}
      
      text-gray-600
      group
      hover:bg-blue-100  hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 active:bg-blue-200 active:text-blue-700
      space-x-2
      items-center
      `"
    v-on="$listeners"
  >
    <div
      :class="`py-1  ${
        size === 'small' ? 'text-xs' : size === 'medium' ? 'text-lg' : 'text-xl'
      } ${count ? 'ml-2' : 'inline-block align-middle'}`"
    >
      <slot />
    </div>
    <div
      v-if="count"
      class="w-6 flex items-center justify-center h-6 bg-orange-300 text-orange-700 rounded-full py-[7px] text-[10px] group-active:bg-gray-0"
    >
      {{ count }}
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export interface BaseToggleButtonPropsInterface {
  count?: number;
}

export default defineComponent({
  name: "BaseToggleButton",
  props: {
    count: {
      type: Number,
      required: false,
      default: undefined
    },
    size: {
      type: String,
      required: false,
      default: "small"
    },
    activate: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: [],
  setup() {}
});
</script>
