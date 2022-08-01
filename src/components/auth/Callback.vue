<template>
  <div
    class="flex bg-fl-dark-blue h-screen flex-col items-center justify-center"
  >
    <img class="h-32" src="@/assets/img/logo_white.svg" alt="Flowlity logo" />
    <p class="text-gray-300">
      <small>Processing your request...</small>
    </p>
    <BaseSpinner class="text-white" />
  </div>
</template>

<script>
import SupervisorService from "@/services/supervisor.service";
import BaseSpinner from "@/components/base/components/BaseSpinner.vue";

export default {
  name: "Callback",
  components: {
    BaseSpinner
  },
  async mounted() {
    if (this.$route.name === "oauthCallback") {
      const { code } = this.$route.query;
      const { companyName } = this.$route.params;
      const {
        data: { access_token: token }
      } = await SupervisorService.get(
        `/api/v1/companies/cartier/token?code=${code}`
      );
      localStorage.setItem(`${companyName}OrdersApiToken`, token);
      this.$router.push({ name: "orders" });
    } else {
      this.$auth.handleAuthentication().then(async () => {
        this.$router.push(
          this.$router.history.current.query.redirect || {
            name: "home"
          }
        );
      });
    }
  }
};
</script>

<style scoped>
.fa-spin {
  animation-duration: 1s;
}
</style>
