<template>
  <a-modal
    :visible="modalOpen"
    width="100%"
    centered
    :closable="false"
    :body-style="{
      padding: 0,
      height: '100vh',
      overflow: 'hidden'
    }"
    dialog-class="pb-0 h-full"
    :footer="null"
    @cancel="$emit('close')"
  >
    <slot />
  </a-modal>
</template>

<script lang="ts">
import {
  onUnmounted,
  defineComponent,
  SetupContext,
  toRefs,
  watch
} from "@vue/composition-api";
import { Modal } from "ant-design-vue";

interface IBaseModal {
  visible: Boolean;
  fixModal: Boolean;
}
export default defineComponent({
  name: "BaseModal",
  components: {
    "a-modal": Modal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fixModal: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(props: IBaseModal, context: SetupContext) {
    const { visible, fixModal } = toRefs(props);
    if ((visible.value, fixModal.value))
      context.root.$el.ownerDocument.body.className = "modal-open";
    const handleVisibleChange = watch(visible, () => {
      context.emit("close");
    });

    onUnmounted(() => {
      context.root.$el.ownerDocument.body.classList.remove("modal-open");
    });
    return {
      modalOpen: true,
      handleVisibleChange
    };
  }
});
</script>

<style lang="scss">
.modal-open {
  overflow-y: hidden;
}
</style>
