<i18n>
{
  "en": {
    "title" : "All users",
    "noUser": "No user found"
  },
  "fr": {
    "title" : "Tous les utilisateurs",
    "noUser": "Aucun utilisateur trouvé"
  }
}
</i18n>

<template>
  <div class="bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div
        style="width: 500px"
        class="bg-white px-12 py-8 rounded-lg shadow-2xl"
      >
        <p class="text-gray-800 font-bold text-xl">
          {{ $t("title") }}
        </p>
        <div v-if="isLoading" class="flex justify-center items-center">
          <base-dot-loader />
        </div>
        <div v-else-if="noUser" class="my-5 text-center">
          {{ $t("noUser") }}
        </div>
        <ul v-else>
          <li v-for="user in users" :key="user.id">
            <router-link
              :to="`/admin/user/${user.id}`"
              style="text-decoration: none"
            >
              <div>
                <hr class="my-4" />
                <div style="display: grid; grid-template-columns: 2fr 3fr">
                  <span class="text-gray-700">
                    {{ user.name }}
                  </span>
                  <span class="text-gray-500 text-sm">
                    {{ user.info }}
                  </span>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import BaseDotLoader from "@/components/contents/common/BaseDotLoader.vue";

export default {
  name: "AdminUsers",
  components: {
    BaseDotLoader
  },
  data() {
    return { users: [] };
  },
  computed: {
    ...mapState("common", { isLoading: state => state.user.usersLoading }),
    ...mapGetters("common", [
      "getMe",
      "getUsersBySite",
      "getUsersByCompany",
      "getCurrentSite"
    ]),
    noUser() {
      return !this.users.length;
    }
  },
  watch: {
    getCurrentSite() {
      this.fetchUsers().then(users => (this.users = users));
    }
  },
  created() {
    this.fetchUsers().then(users => (this.users = users));
  },
  methods: {
    ...mapActions("common", ["fetchUsers"])
  }
};
</script>
