<template>
  <button type="button" :class="btnClasses" v-on="$listeners">
    <BaseSVG
      v-if="showIcon"
      :name="targetIcon"
      size="20"
      :class="[
        {
          'mr-2': hasContent && icon && iconPosition === 'left',
          'ml-2 order-1': hasContent && icon && iconPosition === 'right'
        },
        ...iconClasses
      ]"
    />
    <span
      v-if="hasContent"
      :class="[
        'truncate whitespace-nowrap text-base leading-[22px]',
        { 'opacity-0': loading && !icon }
      ]"
    >
      <slot />
    </span>
  </button>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  SetupContext,
  PropType
} from "@vue/composition-api";
import BaseSVG from "@/components/base/components/BaseSVG.vue";

type BUTTON_ICON_POSITION = "left" | "right";

type BUTTON_TYPE =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "action"
  | "selection";

interface IBaseButtonProps {
  // appearance: color, fill, border
  type: BUTTON_TYPE;
  // paddings: 5x16px (default paddings) vs 5x8px (condensed paddings)
  condensed: boolean;
  // filename from /svg folder
  icon: string;
  // left or right
  iconPosition: BUTTON_ICON_POSITION;
  // permanent active state for button (e.g. for "action" buttons for dropdowns)
  active: boolean;
  // case 1: spinner will be placed instead of existing icon (if icon has been provided)
  // case 2: spinner will be placed over the text in the center (if icon hasn't been provided)
  loading: boolean;
}

export default defineComponent({
  name: "BaseButton",
  components: { BaseSVG },
  props: {
    type: {
      type: String as PropType<BUTTON_TYPE>,
      required: false,
      default: "primary",
      validator(type: BUTTON_TYPE) {
        return [
          "primary",
          "secondary",
          "success",
          "danger",
          "action",
          "selection"
        ].includes(type);
      }
    },
    condensed: {
      type: Boolean,
      required: false,
      default: false
    },
    icon: {
      type: String,
      required: false,
      default: ""
    },
    iconPosition: {
      type: String as PropType<BUTTON_ICON_POSITION>,
      required: false,
      default: "left",
      validator(position: BUTTON_ICON_POSITION) {
        return ["left", "right"].includes(position);
      }
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props: IBaseButtonProps, context: SetupContext) {
    const SPINNER_ICON_NAME = "loader-4-fill";

    // ⚠️ slots don't update reactively; only with  Mutation Observer
    const hasContent = !!context.slots.default;

    const showIcon = computed<boolean>(() => {
      return !!(props.icon || props.loading);
    });

    const targetIcon = computed<string>(() => {
      return props.loading ? SPINNER_ICON_NAME : props.icon;
    });

    const btnClasses = computed<string[]>(() => {
      const classes = [
        "btn",
        `btn--${props.type}`,
        "relative h-8 flex justify-center items-center rounded-md cursor-pointer"
      ];
      if (hasContent) {
        // set paddings if button has content
        classes.push(props.condensed ? "px-2" : "px-4");
      } else {
        // get square if there is no content (only icon)
        classes.push("w-8 h-8");
      }
      if (props.active) {
        classes.push("btn--active");
      }
      return classes;
    });

    const iconClasses = computed<string[]>(() => {
      const classes = ["btn__icon"];
      if (props.loading) {
        classes.push("animate-spin");
      }

      // float over the text if there is no icon presents on the sides
      if (hasContent && !props.icon) {
        classes.push("absolute");
      }
      return classes;
    });

    return {
      showIcon,
      targetIcon,
      btnClasses,
      iconClasses,
      hasContent
    };
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.btn {
  &--primary {
    color: $color-gray-000;
    background: $color-blue-600;

    &:hover {
      background: $color-blue-700;
    }

    &:active {
      background: $color-blue-800;
    }
  }

  &--secondary {
    color: $color-original-700;
    background: $color-gray-000;
    border: 1px solid $color-original-400;

    &:hover {
      background: $color-original-100;
    }

    &:active {
      background: $color-original-200;
    }
  }

  &--success {
    color: $color-green-600;
    background: $color-gray-000;
    border: 1px solid $color-green-600;

    &:hover {
      color: $color-green-700;
      background: $color-green-100;
    }

    &:active {
      color: $color-green-700;
      background: $color-green-200;
    }
  }

  &--danger {
    color: $color-red-700;
    background: $color-gray-000;
    border: 1px solid $color-red-700;

    &:hover {
      color: $color-red-800;
      background: $color-red-200;
    }

    &:active {
      color: $color-red-800;
      background: $color-red-300;
    }
  }

  &--action {
    color: $color-original-700;
    background: transparent;

    &:hover {
      background: $color-original-200;
    }

    &:active {
      background: $color-original-300;
    }
  }

  &--action.btn--active {
    background: $color-original-200;
  }

  &--selection {
    color: $color-blue-600;
    background: $color-original-200;

    &:hover {
      background: $color-original-300;
    }

    &:active {
      background: $color-blue-300;
    }
  }

  &--secondary &__icon,
  &--action &__icon {
    color: $color-original-600;
  }
}
</style>
