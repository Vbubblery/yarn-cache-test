<template>
  <div
    class="ilc relative h-10 w-[104px] border-b border-original-200"
    :class="{
      'bg-original-100': isPast,
      'bg-blue-200': !isPast && isFrozen
    }"
  >
    <div class="ilc__content" :class="{ 'ilc__content--editable': !isPast }">
      <BaseTooltip
        :display="shouldDisplayOrdersTooltip"
        placement="top"
        class="w-full h-full"
      >
        <!-- content of the tooltip -->
        <template #content>
          <div class="space-y-1 whitespace-nowrap">
            <!-- frozen -->
            <div v-if="isFrozen">
              {{ $t(`InputLineCell.${periodType}MarkedAs`) }}
              <span class="text-blue-400">{{
                $tc(
                  `InputLineCell.${isFrozen ? isFrozen : ""}`,
                  periodType === "week" ? 7 : 1
                )
              }}</span>
            </div>

            <!-- check of constraints -->
            <div v-if="!isPast" class="text-sm">
              <div v-if="moqValue" class="flex items-center space-x-6">
                <div class="space-x-1 flex items-center">
                  <BaseSVG
                    v-if="value > 0"
                    size="20"
                    :name="
                      value >= Math.round(moqValue)
                        ? 'check-line'
                        : 'close-line'
                    "
                    :class="
                      value >= Math.round(moqValue)
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  />
                  <span>{{ `${$t("InputLineCell.moq")}` }}</span>
                </div>
                <div>
                  {{
                    `${Math.round(moqValue)} ${
                      units.isDefaultUnit
                        ? units.defaultUnitName
                        : units.secondaryUnitName
                    }`
                  }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="h-full w-full">
          <input
            v-if="!isPast"
            type="number"
            class="w-full h-full text-right pr-2 bg-transparent"
            :class="{
              'cursor-not-allowed': isDisabled
            }"
            :max="Number.MAX_SAFE_INTEGER"
            :min="0"
            :value="value"
            :step="step"
            :disabled="isDisabled"
            @input="$emit('event:input', $event.target.value)"
            @change="$emit('event:change', $event.target.value)"
            @keyup.enter="$emit('event:enter')"
          />
          <div v-else class="w-full h-full flex items-center justify-end pr-2">
            <span>
              {{ formatPastValue(value) }}
            </span>
          </div>
        </div>
      </BaseTooltip>
    </div>

    <div
      v-if="shouldDisplayOriginalValue || shouldDisplayFlowlityLogo"
      class="ilc__previous"
    >
      <BaseTooltip v-if="shouldDisplayOriginalValue" placement="top">
        <template #content>
          <p class="text-base leading-6 font-medium whitespace-nowrap">
            {{ originalValueTooltipText }}
          </p>
        </template>
        <div
          class="hover:bg-original-200 hover:text-original-700 flex items-center justify-center rounded h-[20px] w-[20px]"
        >
          <BaseSVG
            size="20"
            name="edit-fill"
            class="text-original-500 hover:text-original-700"
          />
        </div>
      </BaseTooltip>

      <BaseTooltip v-else-if="shouldDisplayFlowlityLogo" placement="top">
        <template #content>
          <p class="text-base leading-6 font-medium whitespace-nowrap">
            {{ $t("InputLineCell.flowlitySupply") }}
          </p>
        </template>
        <div
          class="hover:bg-original-200 hover:text-original-700 flex items-center justify-center rounded h-[20px] w-[20px]"
        >
          <img
            src="@/assets/svg/icons/rectangle-flowlity-2.svg"
            alt="Recommendation by Flowlity"
          />
        </div>
      </BaseTooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { useI18n } from "vue-i18n-composable";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";

export default defineComponent({
  name: "BaseCellInput",
  components: {
    BaseSVG,
    BaseTooltip
  },
  props: {
    step: {
      type: Number,
      required: false,
      default: 1
    },
    value: {
      type: [Number, String],
      required: false,
      default: null
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isPast: {
      type: Boolean,
      required: false,
      default: false
    },
    isFrozen: {
      type: [Boolean, String],
      required: false,
      default: null
    },
    originalValue: {
      type: Number,
      required: false,
      default: null
    },
    shouldDisplayFlowlityLogo: {
      type: Boolean,
      required: false,
      default: false
    },
    shouldDisplayOriginalValue: {
      type: Boolean,
      required: false,
      default: false
    },
    shouldDisplayOrdersTooltip: {
      type: Boolean,
      required: false,
      default: false
    },
    moqValue: {
      type: Number,
      required: false,
      default: null
    },
    units: {
      type: Object,
      required: false,
      default: () => ({})
    },
    periodType: {
      type: String,
      required: false,
      default: null
    }
  },
  emits: ["event:input", "event:change", "event:enter"],
  setup(props) {
    const { t } = useI18n();

    const originalValueTooltipText = computed(() => {
      const value =
        props.originalValue === null
          ? t("InputLineCell.empty")
          : props.originalValue;
      return `${t("InputLineCell.originalValue")}: ${value}`;
    });

    const formatPastValue = (value: number | string | null) => {
      if (typeof value === "string") return value;
      if (typeof value === "number" && isNaN(value)) return "-";
      if (value === null) return "";
      return new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);
    };

    return {
      originalValueTooltipText,
      formatPastValue
    };
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.ilc {
  &__content {
    position: absolute;
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: 0;
    border: 1px solid transparent;

    &--editable {
      border-color: $color-original-400;

      &:hover {
        z-index: 1;
        border-color: $color-original-500;
      }

      &:focus-within {
        z-index: 1;
        border-color: $color-blue-600;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }
    }
  }

  &__previous {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 4px;
    bottom: 4px;
    z-index: 1;
  }
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
