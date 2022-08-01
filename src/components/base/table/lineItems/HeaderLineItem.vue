<template>
  <div
    class="header-content grid text-original-500"
    :style="{
      gridTemplateColumns: `repeat(${filteredHeaders.length},104px)`
    }"
  >
    <div
      v-for="(element, idx) in filteredHeaders"
      :key="`header${idx}`"
      class="header-content__cell border-b border-original-200"
      :class="headerCellClasses(idx, element)"
    >
      <div
        :class="[
          { 'bg-original-100': element.isWeekendPeriod },
          'relative px-2 py-[10px] h-full flex items-center justify-end text-right'
        ]"
        @mouseenter="event => (idx >= 1 ? hoverFixingRecoDate(idx) : '')"
        @mouseleave="event => (idx >= 1 ? hoverFixingRecoDate(null) : '')"
      >
        <BaseButton
          v-if="idx === indexHoverFixingRecoDate && idx > indexFixingRecoDate"
          condensed
          class="header-content__fixed-btn z-40"
          @click="() => saveFixingRecoDate(idx)"
        >
          {{ $t("forecastsReview.fixRecoButton") }}
        </BaseButton>
        <BaseButton
          v-if="idx === indexHoverFixingRecoDate && idx <= indexFixingRecoDate"
          condensed
          class="header-content__fixed-btn z-40"
          type="secondary"
          @click="() => saveFixingRecoDate(null)"
        >
          {{ $t("forecastsReview.cancelFixRecoButton") }}
        </BaseButton>
        <slot>
          <span
            :class="`relative text-base ${
              idx >= 1 &&
              idx <= indexFixingRecoDate &&
              indexHoverFixingRecoDate &&
              indexHoverFixingRecoDate <= indexFixingRecoDate
                ? 'blur-sm'
                : ''
            }`"
          >
            {{ element.content }}
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "HeaderLineItem",
  components: {
    BaseButton
  },
  props: {
    headers: {
      type: Array,
      required: false,
      default: () => []
    },
    indexFixingRecoDate: {
      type: [Number, null],
      required: false,
      default: () => null
    },
    indexHoverFixingRecoDate: {
      type: [Number, null],
      required: false,
      default: () => null
    }
  },
  emits:["update:hoverFixingRecoDate", "update:saveFixingRecoDate"],
  computed: {
    filteredHeaders() {
      return this.headers.filter(header => !header?.hide);
    }
  },
  methods: {
    saveFixingRecoDate(indexOrNull) {
      this.$emit("update:saveFixingRecoDate", indexOrNull);
    },
    hoverFixingRecoDate(indexOrNull) {
      this.$emit("update:hoverFixingRecoDate", indexOrNull);
    },
    headerCellClasses(idx, element) {
      const classes = [];
      // Demand page
      if (element.isInDemandFrozenHorizon) classes.push("border-b-2 border-purple-500");

      // Planning page
      if (idx >= 1 && (idx <= this.indexHoverFixingRecoDate || idx <= this.indexFixingRecoDate)) {
        classes.push("border-b-2 border-blue-500 bg-blue-100");
      }
      // both pages
      if (element.isCurrentPeriod) {
        classes.push("text-blue-600");
      } else if (element.isPast) {
              classes.push("bg-original-100");
      }
      return classes;
    }
  }
};
</script>

<style lang="scss" scoped>
.header-content {
  grid-area: 1 / 1 / span 1 / span 1;
  display: grid;
  grid-template-rows: min-content;

  &__cell {
    grid-row: 1 / span 1;
    height: 40px;
    font-size: 12px;
  }

  ::v-deep &__fixed-btn {
    position: absolute;
  }
}
</style>
