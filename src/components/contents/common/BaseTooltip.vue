<template>
  <VTooltip
    :disabled="!display"
    :distance="distance"
    :placement="placement"
    strategy="fixed"
    :hide-triggers="events => [...events]"
    :delay="{ show: 0, hide: 0 }"
    :popper-class="[{ 'v-popper--light': light }]"
  >
    <slot />

    <template #popper>
      <div :style="constraintStyles">
        <slot name="content">
          <p v-if="title" class="text-base leading-6 font-medium">
            {{ title }}
          </p>
          <p v-if="content">
            {{ content }}
          </p>
        </slot>
      </div>
    </template>
  </VTooltip>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { toNumerableCSSValue } from "@/helper/reusables";

export default defineComponent({
  name: "BaseTooltip",
  props: {
    placement: {
      type: String,
      enum: [
        "auto",
        "auto-start",
        "auto-end",
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "right",
        "right-start",
        "right-end",
        "left",
        "left-start",
        "left-end"
      ],
      default: "bottom"
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      required: false,
      default: ""
    },
    light: {
      type: Boolean,
      default: false
    },
    display: {
      type: Boolean,
      default: true
    },
    distance: {
      type: Number,
      required: false,
      default: 10
    },
    minWidth: {
      type: [String, Number],
      required: false,
      default: 0
    },
    maxWidth: {
      type: [String, Number],
      required: false,
      default: "320px"
    }
  },
  setup(props) {
    const constraintStyles = computed<string>(() => {
      const styles = [];

      if (props.minWidth) {
        // converting 100 › 100px etc
        styles.push(`min-width: ${toNumerableCSSValue(props.minWidth)}`);
      }

      if (props.maxWidth) {
        styles.push(`max-width: ${toNumerableCSSValue(props.maxWidth)}`);
      }

      return styles.join(";");
    });

    return {
      constraintStyles
    };
  }
});
</script>
