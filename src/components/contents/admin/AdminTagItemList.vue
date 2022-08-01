<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="mb-3">
    <a-checkbox
      v-if="getMe.canAccess(['tag:write'])"
      :checked="source.checked"
      @change="handleChange"
    >
      <span class="m-0 text-gray-600" v-html="boldIt" />
    </a-checkbox>
    <span v-else class="m-0 text-gray-600" v-html="boldIt" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Checkbox } from "ant-design-vue";
import emitter from "@/services/emitter.service";
export default {
  name: "AdminTagItemList",
  components: {
    "a-checkbox": Checkbox
  },
  props: {
    source: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters("common", ["getMe"]),
    boldIt() {
      const toReplace = this.source.name.match(
        new RegExp(this.source.toBold, "gi")
      );
      return this.source.name.replace(toReplace, `<b>${toReplace}</b>`);
    }
  },
  methods: {
    handleChange(event) {
      emitter.emit("checkboxValueChange", {
        id: this.source.id,
        checked: event.target.checked
      });
    }
  }
};
</script>
