<template>
  <div class="data-list-loader">
    <slot name="listItems" :data="{ loading, error, rawData }" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BaseDataListLoader",
  props: {
    apiService: {
      type: Object,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    filters: {
      type: Object,
      required: false,
      default: () => ({})
    },
    reload: {
      type: Boolean,
      default: false
    }
  },
  emits: ["dataLoaded"],
  data() {
    return {
      loading: false,
      error: null,
      rawData: null,
      promises: []
    };
  },
  computed: {
    ...mapGetters("common", ["getCurrentSite"])
  },
  watch: {
    filters: {
      immediate: true,
      handler: "load"
    },
    reload: {
      immediate: true,
      handler: async function (cur) {
        if (cur === true) {
          await this.load();
        }
      }
    },
    async getCurrentSite() {
      await this.load();
    },
    async endpoint() {
      await this.load();
    }
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        // TODO: check how to implement a more robust mechanism
        // we implemented this way of handling multiple calls and taking only the result of the last one
        // because if the user click fast between 2 UI elements and triggers 2 consecutive calls (call_1 then call_2)
        // if the first call_1 takes more time to resolve than call_2 it will overwrite the result of call_2
        // and the state of the UI will not match with the data displayed
        const newPromise = this.apiService.get(this.endpoint, this.filters);
        // so we put each new call to the begin of the promises array
        this.promises.unshift(newPromise);
        // we still launch all the calls
        const result = await Promise.all(this.promises);
        // but we take only the result of the last call
        const { data } = result[0];
        this.rawData = data;
        this.$emit("dataLoaded", data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = error;
      }
    }
  }
};
</script>
