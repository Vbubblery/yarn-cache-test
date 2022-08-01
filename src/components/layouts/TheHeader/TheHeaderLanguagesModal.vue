<template>
  <Modal
    :visible="visible"
    :title="$t('header.lang')"
    :footer="null"
    @cancel="$emit('input', false)"
  >
    <div class="flex justify-content-start flex-column">
      <BaseButton
        type="secondary"
        icon="flag-uk"
        class="mr-2"
        @click="updateUserLang('en')"
      >
        English
      </BaseButton>
      <BaseButton
        type="secondary"
        icon="flag-france"
        @click="updateUserLang('fr')"
      >
        Français
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import { Modal } from "ant-design-vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "TheHeaderLanguagesModal",
  components: { BaseButton, Modal },
  model: {
    prop: "visible",
    event: "input"
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ["input"],
  setup(_props, context) {
    const updateUserLang = async (lang: string) => {
      await context.root.$store.dispatch("common/updateUserLocale", lang);
      context.emit("input", false);
    };

    return { updateUserLang };
  }
});
</script>
