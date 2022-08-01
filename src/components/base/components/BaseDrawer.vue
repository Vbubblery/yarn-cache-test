<template>
  <a-drawer
    destroy-on-close
    placement="right"
    :closable="true"
    :width="356"
    :visible="drawerVisible"
    @close="closeDrawer"
  >
    <slot />
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export interface IBaseDrawer {
  drawerVisible: Boolean;
  closeDrawer: Function;
}
export default defineComponent({
  name: "BaseDrawer",
  props: {
    drawerVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    closeDrawer: {
      type: Function,
      default: () => {},
      required: false
    }
  },

  setup() {}
});
</script>
