<template>
  <div class="i">
    <label v-if="label" :for="identifier" class="i__label">
      {{ label }}
    </label>
    <div
      class="i__field"
      :class="{
        'i__field--has-errors': hasVisibleError,
        'i__field--disabled': disabled
      }"
    >
      <BaseSVG v-if="icon" :name="icon" size="20" class="i__icon" />
      <input
        :id="identifier"
        ref="control"
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        :class="[
          'i__control',
          {
            'i__control--w-icon': icon,
            'i__control--clearable': clearToggleIsVisible
          }
        ]"
        @focus="focused = true"
        @blur="blur"
        @input="$emit('input', $event.target.value)"
        @keydown.enter="$emit('enter', $event.target.value)"
      />
      <BaseSVG
        v-if="clearToggleIsVisible"
        name="flowlity-circle-delete"
        size="20"
        class="i__clear-toggle"
        @mousedown.prevent="$emit('input', '')"
      />
    </div>
    <footer v-if="errorable || leadingError || hint" class="i__footer">
      <p v-if="hasVisibleError" class="i__footer-content">
        <BaseSVG name="error-warning-fill" size="16" class="i__error-icon" />
        <span class="truncate">{{ leadingError }}</span>
      </p>
      <p v-else-if="hint" class="i__footer-content">
        <span class="truncate">{{ hint }}</span>
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  SetupContext
} from "@vue/composition-api";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import { timeout } from "@/helper/timeout";

enum InputType {
  TEXT = "text",
  NUMBER = "number",
  SEARCH = "search",
  EMAIL = "email",
  PASSWORD = "password",
  TEL = "tel"
}

const inputTypes = Object.values(InputType);

interface IBaseInputProps {
  value: string;
  // text, tel, number...
  type: InputType;
  // above the field
  label: string;
  placeholder: string;
  disabled: boolean;
  // can have error? holds place for the potential error
  errorable: boolean;
  errors?: string | string[];
  // show error even without touching of input
  showErrorImmediately: boolean;
  // icon – on the left of the field
  icon: string;
  // set clickable "x" – on the right of the field
  clearable: boolean;
  hint: string;
  // automatically set focus after mounting
  autofocus: boolean;
  maxLength?: number;
}

export default defineComponent({
  name: "BaseInput",
  components: { BaseSVG },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: String,
      required: false,
      default: ""
    },
    type: {
      type: String,
      required: false,
      default: InputType.TEXT,
      validator(type: InputType) {
        return inputTypes.includes(type);
      }
    },
    label: {
      type: String,
      required: false,
      default: ""
    },
    placeholder: {
      type: String,
      required: false,
      default: ""
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    errorable: {
      type: Boolean,
      required: false,
      default: false
    },
    errors: {
      type: [Array, String],
      required: false,
      default: undefined
    },
    showErrorImmediately: {
      type: Boolean,
      required: false,
      default: false
    },
    icon: {
      type: String,
      required: false,
      default: ""
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false
    },
    hint: {
      type: String,
      required: false,
      default: ""
    },
    autofocus: {
      type: Boolean,
      required: false,
      default: false
    },
    maxLength: {
      type: Number,
      required: false,
      default: undefined
    }
  },
  emits: ["input", "enter", "mounted"],
  setup(props: IBaseInputProps, context: SetupContext) {
    const identifier = `input_${Math.round(Math.random() * 1e8)}`;
    const control = ref<HTMLInputElement | null>(null);
    const focused = ref<boolean>(false);
    const dirty = ref<boolean>(false);

    const leadingError = computed<string>(() => {
      if (!props.errors) {
        return "";
      } else if (typeof props.errors === "string") {
        return props.errors;
      }
      return props.errors[0];
    });

    const blur = () => {
      focused.value = false;
      dirty.value = true;
    };

    const hasVisibleError = computed<boolean>(() => {
      return !!(
        leadingError.value &&
        (dirty.value || props.showErrorImmediately)
      );
    });

    const clearToggleIsVisible = computed<boolean>(() => {
      return !!(props.clearable && props.value && !props.disabled);
    });

    onMounted(async () => {
      if (props.autofocus) {
        // put on the top of the stack
        // to give priority for rendering
        await timeout(0);
        control.value?.focus();
      }
      // to put focus outside of component
      // TODO: research for better solution after the migration to Vue 3
      context.emit("mounted", control);
    });

    return {
      clearToggleIsVisible,
      control,
      dirty,
      focused,
      hasVisibleError,
      identifier,
      leadingError,
      blur
    };
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.i {
  font-family: $font-roboto;

  &__label {
    display: inline-block;
    cursor: pointer;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 4px;
    color: $color-original-600;
    user-select: none;
  }

  &__field {
    position: relative;
    border: 1px solid $color-original-400;
    border-radius: 4px;
    overflow: hidden;

    &:not(&--has-errors):hover {
      border-color: $color-original-500;
    }

    &:not(&--has-errors):focus-within {
      border-color: $color-blue-600;
    }

    &--has-errors:not(&--disabled) {
      border-color: $color-red-600;
    }

    &--disabled {
      background: $color-original-100;
      cursor: not-allowed;
    }
  }

  &__control {
    width: 100%;
    padding: 6px 8px;
    border: none;
    font-size: 14px;
    line-height: 18px;
    color: $color-original-800;
    font-family: $font-roboto;

    &::placeholder {
      color: $color-original-500;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &--w-icon {
      padding-left: 30px;
    }

    &--clearable {
      padding-right: 30px;
    }
  }

  @mixin side-icon {
    position: absolute;
    top: 5px;
    padding: 2px;
    color: $color-original-500;
  }

  &__icon {
    @include side-icon;
    left: 6px;
  }

  &__clear-toggle {
    @include side-icon;
    right: 6px;
    cursor: pointer;

    &:hover {
      color: $color-original-700;
    }
  }

  &__footer {
    height: 16px;
    margin-top: 4px;
    display: flex;
    align-items: center;
  }

  &__footer-content {
    max-width: 100%;
    display: flex;
    align-items: center;
    color: $color-original-800;
    font-size: 12px;
    line-height: 14px;
  }

  &__error-icon {
    color: $color-red-700;
    margin-right: 4px;
  }
}
</style>
