<template>
  <div class="tabs">
    <p v-if="label" class="tabs__label">
      {{ label }}
    </p>
    <div class="tabs__group">
      <div
        v-for="{ id, name, icon } in tabs"
        :key="id"
        class="tabs__tab"
        :class="{ 'tabs__tab--selected': id === value }"
        @click="$emit('input', id)"
      >
        <BaseSVG v-if="icon" :name="icon" size="16" :class="{ 'mr-1': name }" />
        <span v-if="name" class="tabs__name">
          {{ name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import BaseSVG from "@/components/base/components/BaseSVG.vue";

interface ITab {
  id: string;
  name?: string;
  icon?: string;
}

// eslint-disable-next-line
interface IBaseRadioTabsProps {
  value: ITab["id"];
  tabs: ITab[];
  label: string;
}

export default defineComponent({
  name: "BaseButtonsGroup",
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
    tabs: {
      type: Array,
      required: true,
      // eslint-disable-next-line
      validator(tabs: any[]) {
        // every tab should contain "id" and "name"/"icon" at least
        return tabs.every(t => "id" in t && ("name" in t || "icon" in t));
      }
    },
    label: {
      type: String,
      required: false,
      default: ""
    }
  },
  emits: ["input"]
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.tabs {
  max-width: 100%;
  display: inline-block;
  color: $color-original-500;
  line-height: 16px;

  &__label {
    margin-bottom: 4px;
    font-weight: 500;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__group {
    display: flex;
    border: 1px solid $color-original-400;
    border-radius: 4px;
  }

  &__tab {
    display: flex;
    font-size: 14px;
    padding: 7px 8px;
    background: $color-gray-000;
    white-space: nowrap;
    margin-right: 1px;
    border-radius: 3px;
    user-select: none;
    overflow: hidden;

    &:not(&--selected) {
      cursor: pointer;
    }

    &:hover {
      color: $color-blue-600;
    }

    &:last-child {
      margin-right: 0;
    }

    &--selected {
      background: $color-original-200;
      box-shadow: 0 0 0 1px $color-blue-400;
      color: $color-blue-600;
    }

    &--selected:hover {
      background: $color-original-300;
    }
  }

  &__name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
