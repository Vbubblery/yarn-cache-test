<template>
  <div class="label" :class="{ 'label--active': active }" v-on="$listeners">
    <BaseSVG
      v-if="icon"
      :name="icon"
      :class="[
        'label__icon',
        { 'label__icon--right': iconPosition === 'right' }
      ]"
      size="20"
    />
    <p class="label__content">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import BaseSVG from "@/components/base/components/BaseSVG.vue";

export default defineComponent({
  name: "BaseLabel",
  components: {
    BaseSVG
  },
  props: {
    icon: {
      type: String,
      required: false,
      default: ""
    },
    iconPosition: {
      type: String as PropType<"left" | "right">,
      required: false,
      default: "left"
    },
    active: {
      type: Boolean,
      default: false,
      required: false
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: $font-roboto;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  color: $color-original-800;
  border-radius: 6px;
  padding: 8px;
  user-select: none;
  white-space: nowrap;

  &:hover {
    background: $color-original-200;
  }

  &--active {
    color: $color-blue-600;
    background: $color-original-200;
  }

  &__icon {
    color: $color-original-500;
    flex: none;
    margin-right: 4px;

    &--right {
      margin-right: unset;
      margin-left: 4px;
      order: 1;
    }
  }

  &__content {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
