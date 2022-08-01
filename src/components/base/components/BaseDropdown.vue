<template>
  <section :class="`dropDownMenuWrapper h-full ${wrapperStyle}`">
    <a-dropdown
      :trigger="['click']"
      :visible="isOpen"
      :overlay-class-name="`${menuStyle} shadow-lg bg-white z-10`"
      data-testid="base_dropdown"
    >
      <div class="dropDownMenuButton px-4" @click.stop="() => toggleIsOpen()">
        <div class="w-[90%]">
          <p class="text-gray-500 text-xs select-none">{{ menuTitle }}</p>
          <p class="text-blue-600 truncate">
            {{ menuSubTitle }}
          </p>
        </div>

        <BaseSVG name="arrow-down-s-line" />
      </div>
      <template #overlay>
        <a-menu
          v-click-outside="() => toggleIsOpen(false)"
          selectable
          style="background: white; padding-inline-start: 0px"
        >
          <slot />
        </a-menu>
      </template>
    </a-dropdown>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import { Menu, Dropdown } from "ant-design-vue";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
interface IBaseDropdown {
  menuTitle: String;
  menuSubTitle: String;
  wrapperStyle: String;
  titleStyle: String;
  menuStyle: String;
  items: Array<Object>;
}

export default defineComponent({
  name: "BaseDropdown",
  components: {
    "a-menu": Menu,
    "a-dropdown": Dropdown,
    BaseSVG
  },
  props: {
    menuTitle: {
      type: String,
      required: false,
      default: ""
    },
    menuSubTitle: {
      type: String,
      required: false,
      default: ""
    },
    wrapperStyle: {
      type: String,
      required: false,
      default: ""
    },
    titleStyle: {
      type: String,
      required: false,
      default: ""
    },
    menuStyle: {
      type: String,
      required: false,
      default: ""
    }
  },
  emits: ["open"],
  setup(_props: IBaseDropdown, context: SetupContext) {
    const isOpen = ref(false);

    const toggleIsOpen = (selectedState: boolean | undefined = undefined) => {
      isOpen.value = selectedState ?? !isOpen.value;
      if (isOpen.value) context.emit("open");
    };
    return {
      isOpen,
      toggleIsOpen
    };
  }
});
</script>

<style lang="scss" scoped>
.dropDownMenuWrapper {
  min-width: 300px;
  width: 100%;
  position: relative;
  background: white;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-weight: normal;
  font-size: 15px;

  * {
    box-sizing: border-box;
    text-align: left;
  }

  .dropDownMenuButton {
    border: none;
    font-size: inherit;
    background: none;
    outline: none;
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    margin: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    cursor: pointer;
  }

  .dropdownMenu {
    position: absolute;
    left: -20px;
    top: 70%;
    width: 103%;
    min-width: 220px;
    min-height: 10px;
    border-radius: 8px;
    border: 1px solid #eee;
    background: white;
    padding: 10px 20px;
    animation: menu 0.3s ease forwards;
    z-index: 10;

    .option {
      width: 100%;
      border-bottom: 1px solid #eee;
      padding: 10px 0;
      cursor: pointer;
      position: relative;
      z-index: 2;
      button {
        padding: 0 10px;
      }
      &:last-child {
        border-bottom: 0;
      }

      * {
        color: inherit;
        text-decoration: none;
        background: none;
        border: 0;
        padding: 0;
        outline: none;
        cursor: pointer;
      }
    }

    .desc {
      opacity: 0.5;
      display: block;
      width: 100%;
      font-size: 14px;
      margin: 3px 0 0 0;
      cursor: default;
    }
  }

  @keyframes menu {
    from {
      transform: translate3d(0, 30px, 0);
    }
    to {
      transform: translate3d(0, 20px, 0);
    }
  }
  .ant-dropdown-menu {
    position: relative;
    margin: 0;
    padding: 4px 0;
    text-align: left;
    list-style-type: none;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    box-shadow: none;
    outline: none;
  }
}

.dropDownMenuWrapper--noTitle {
  padding: 0;
  width: 60px;
  height: 60px;
}
</style>
