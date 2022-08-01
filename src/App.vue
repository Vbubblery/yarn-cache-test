<template>
  <a-config-provider :locale="antLocale">
    <router-view />
  </a-config-provider>
</template>

<script>
import { mapState } from "vuex";
import { ConfigProvider } from "ant-design-vue";
export default {
  metaInfo: {
    title: "Flowlity"
  },
  components: {
    "a-config-provider": ConfigProvider
  },
  computed: {
    ...mapState("common", {
      antLocale: state => state.user.antLocale
    })
  }
};
</script>

<style lang="scss">
input:focus {
  outline: none;
}
</style>
