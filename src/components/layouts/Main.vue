<template>
  <div class="flex flex-col h-screen">
    <div class="z-30">
      <TheHeader />
      <TheDataJobsHeader />
    </div>
    <router-view />
  </div>
</template>

<script>
import TheHeader from "@/components/layouts/TheHeader/TheHeader.vue";
import TheDataJobsHeader from "@/components/layouts/TheDataJobsHeader/TheDataJobsHeader.vue";

export default {
  name: "Main",
  components: {
    TheHeader,
    TheDataJobsHeader
  }
};
</script>
