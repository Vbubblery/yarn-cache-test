<template>
  <nav
    class="h-16 gap-5 px-6 flex items-center justify-between bg-white border-b border-original-300"
  >
    <TheHeaderLogo />
    <TheHeaderLinks />
    <div class="grow basis-0 flex items-center justify-end">
      <TheHeaderCompanyDropdown v-if="isSuperAdmin" />
      <TheHeaderSiteDropdown />
      <TheHeaderInfoUser @change-lang="showLangModal = true" />
      <TheHeaderLanguagesModal v-model="showLangModal" />
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import TheHeaderLogo from "@/components/layouts/TheHeader/TheHeaderLogo.vue";
import TheHeaderLinks from "@/components/layouts/TheHeader/TheHeaderLinks.vue";
import TheHeaderCompanyDropdown from "@/components/layouts/TheHeader/TheHeaderCompanyDropdown.vue";
import TheHeaderSiteDropdown from "@/components/layouts/TheHeader/TheHeaderSiteDropdown.vue";
import TheHeaderInfoUser from "@/components/layouts/TheHeader/TheHeaderInfoUser.vue";
import TheHeaderLanguagesModal from "@/components/layouts/TheHeader/TheHeaderLanguagesModal.vue";

export default {
  name: "TheHeader",
  components: {
    TheHeaderLogo,
    TheHeaderLinks,
    TheHeaderCompanyDropdown,
    TheHeaderSiteDropdown,
    TheHeaderInfoUser,
    TheHeaderLanguagesModal
  },
  data() {
    return {
      showLangModal: false
    };
  },
  computed: {
    ...mapGetters("common", ["getMe"]),
    isSuperAdmin() {
      return this.getMe && this.getMe.superAdmin;
    }
  }
};
</script>
