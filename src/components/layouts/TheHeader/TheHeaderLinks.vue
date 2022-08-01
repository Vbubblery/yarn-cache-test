<template>
  <div class="flex justify-center items-center grow basis-0">
    <TheHeaderLinksLink v-if="!isSupplier" to="/home" link-name="Dashboard" />
    <TheHeaderLinksLink
      v-if="getMe.canAccess(['demand:read'])"
      to="/demand"
      link-name="Demand"
    />
    <TheHeaderLinksLink
      v-if="!isSupplier && getMe.canAccess(['stock:read'])"
      to="/planning"
      link-name="Planning"
    />
    <TheHeaderLinksLink
      v-if="getMe.canAccess(['order:read'])"
      to="/orders"
      link-name="Orders"
    />
    <TheHeaderLinksLink
      v-if="!isSupplier && getMe.canAccess(['stock:read'])"
      to="/data"
      link-name="Data"
    />
  </div>
</template>

<script>
import TheHeaderLinksLink from "@/components/layouts/TheHeader/TheHeaderLinksLink.vue";
import { mapGetters } from "vuex";
export default {
  name: "TheHeaderLinks",
  components: {
    TheHeaderLinksLink
  },
  computed: {
    ...mapGetters("common", ["getMe", "getCurrentSite"]),
    isSupplier() {
      return this.getCurrentSite.isSupplierView;
    }
  }
};
</script>
