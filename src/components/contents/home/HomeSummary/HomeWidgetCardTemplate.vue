<template>
  <div
    class="flex flex-col border rounded-lg border-fl-light-grey px-4 py-3 text-fl-dark-blue"
    style="height: 350px"
  >
    <div class="h-1/4">
      <slot name="header">
        <div class="flex">
          <div>
            <div class="mb-0 text-xl font-bold">
              <slot name="title"> Widget title </slot>
            </div>
            <p class="text-sm text-fl-ingenious-ivory pb-8">
              <slot name="subtitle"> widget subtitle </slot>
            </p>
          </div>
          <div class="flex-grow">
            <slot name="options" />
          </div>
        </div>
      </slot>
    </div>
    <div class="flex-grow">
      <slot name="body" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  name: "HomeWidgetCardTemplate"
});
</script>
