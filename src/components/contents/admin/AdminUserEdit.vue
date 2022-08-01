<i18n>
{
  "en": {
    "back" : "all users",
    "title": "Edit the user",
    "name": "Name",
    "cancel": "Cancel",
    "save": "Save",
    "userInfo": "User info",
    "phone": "Office Phone (optional)",
    "job": "Job Title (optional)",
    "active": "This user is active",
    "errorName": "Please add a user name",
    "errorEmail": "Please add a user email",
    "errorEmailPattern": "Please enter a proper email",
    "sameSiteError": "You cannot remove yourself from the Site currently used in the application",
    "notFound": "User not found"
  },
  "fr": {
    "back" : "retour",
    "title": "Editer un utilisateur",
    "name": "Nom",
    "cancel": "Annuler",
    "save": "Valider",
    "userInfo": "Info utilisateur",
    "phone": "Téléphone (optionnel)",
    "job": "Poste occupé (optionnel)",
    "active": "Cet utilisateur est activé",
    "updatePassword": "Modifier",
    "errorName": "Ajoutez un nom",
    "errorEmail": "Ajoutez un email",
    "errorEmailPattern": "Entrez une adresse mail correcte",
    "sameSiteError": "Vous ne pouvez vous dissocier du Site actuellement utilisé dans l'application",
    "notFound": "Utilisateur introuvable"
  }
}
</i18n>

<template>
  <div class="bg-gray-700 py-20">
    <div class="flex justify-center items-center">
      <div
        style="width: 500px"
        class="relative bg-white px-12 py-10 rounded-lg shadow-2xl"
      >
        <router-link
          :to="{ name: 'users' }"
          style="
            text-decoration: none;
            position: absolute;
            top: 25px;
            right: 25px;
          "
          class="flex items-center"
        >
          <BaseSVG name="arrow-left-s-line" class="text-gray-400 mx-auto" />
          <p class="mb-0 ml-2 text-gray-500">
            {{ $t("back") }}
          </p>
        </router-link>
        <p class="text-gray-800 font-bold text-xl mb-12">
          {{ $t("title") }}
        </p>
        <p class="font-bold text-gray-600 mb-8">
          {{ $t("userInfo") }}
        </p>
        <a-form :form="formInfo" @submit="handleSubmitInfo">
          <p class="m-0 text-gray-600">
            {{ $t("name") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'name',
                {
                  initialValue: user.name,
                  rules: [{ required: true, message: $t(`errorName`) }]
                }
              ]"
              :disabled="!editAllowed"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">Email</p>
          <a-form-item>
            <a-input
              v-decorator="[
                'email',
                {
                  initialValue: user.email,
                  rules: [
                    { required: true, message: $t(`errorEmail`) },
                    { type: 'email', message: $t(`errorEmailPattern`) }
                  ]
                }
              ]"
              :disabled="true"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">
            {{ $t("phone") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'telOffice',
                {
                  initialValue: user.telOffice
                }
              ]"
              :disabled="!editAllowed"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">
            {{ $t("job") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'title',
                {
                  initialValue: user.title
                }
              ]"
              :disabled="!editAllowed"
            />
          </a-form-item>
          <a-form-item>
            <a-checkbox
              v-decorator="[
                'isActive',
                {
                  initialValue: user.isActive
                }
              ]"
              :disabled="!editAllowed || user.id == getMe.id"
              :default-checked="user.isActive"
            >
              <span class="text-gray-600">{{ $t("active") }}</span>
            </a-checkbox>
          </a-form-item>
          <p class="m-0 text-gray-600">Sites</p>
          <a-form-item>
            <a-select
              mode="multiple"
              :disabled="!isAdmin"
              :options="sites"
              :value="userSites"
              @select="handleSelect"
              @deselect="handleDeselect"
            />
          </a-form-item>
          <a-form-item v-if="editAllowed">
            <div class="flex space-x-2">
              <BaseButton :loading="savingInfo" @click="handleSubmitInfo">
                {{ $t("save") }}
              </BaseButton>
              <BaseButton
                type="secondary"
                @click="$router.push({ name: 'users' })"
              >
                {{ $t("cancel") }}
              </BaseButton>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import helper from "@/helper/helper";
import NotificationService from "@/services/notification.service";
import { Form, Input, Checkbox, Select } from "ant-design-vue";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default {
  name: "AdminUserEdit",
  components: {
    BaseButton,
    BaseSVG,
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-checkbox": Checkbox,
    "a-select": Select
  },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formInfo: Form.createForm(this),
      savingInfo: false,
      userSites: [],
      sites: [],
      meSitesIds: []
    };
  },
  computed: {
    ...mapGetters("common", ["getMe", "getUser", "getCurrentSite"]),
    user() {
      return parseInt(this.userId) === this.getMe.id
        ? this.getMe
        : this.getUser(parseInt(this.userId));
    },
    editAllowed() {
      return (
        this.getMe.canAccess(["user:write"]) ||
        this.getMe.id === parseInt(this.userId)
      );
    },
    isAdmin() {
      return this.getMe.admin;
    },
    isProfileOwner() {
      return parseInt(this.userId) === this.getMe.id;
    }
  },
  async created() {
    try {
      this.meSitesIds = this.getMe.sites.map(site => site.id);
      this.userSites = this.user.sites
        .map(site => (typeof site === "object" ? site.id : site))
        .filter(site => this.meSitesIds.includes(site));
      this.sites = this.getMe.sites.map(site => ({
        label: site.name,
        value: site.id,
        key: site.name
      }));
    } catch (e) {
      this.$router.push({ name: "users" });
      NotificationService.error(this.$t("notFound"));
    }
  },
  methods: {
    ...mapActions("common", ["updateUser", "initMe"]),
    handleSelect(value) {
      this.userSites.push(value);
    },
    handleDeselect(value) {
      if (this.isProfileOwner && value === this.getCurrentSite.id) {
        NotificationService.error(this.$t("sameSiteError"));
      } else {
        this.userSites = this.userSites.filter(item => item != value);
      }
    },
    handleSubmitInfo(e) {
      e.preventDefault();
      this.formInfo.validateFields(async (err, values) => {
        if (!err) {
          if (this.editAllowed) {
            const user = helper.clone(this.user);
            user.name = values.name;
            user.email = values.email;
            user.telOffice = values.telOffice;
            user.title = values.title;
            user.isActive = values.isActive;
            // keep all user sites not related to my sites + additions/deletions
            let sitesToKeep = this.user.sites
              .map(site => (typeof site === "object" ? site.id : site))
              .filter(site => !this.meSitesIds.includes(site));
            sitesToKeep = [...sitesToKeep, ...this.userSites];
            user.sites = sitesToKeep;
            this.savingInfo = true;
            await this.updateUser({ user });
            if (this.isAdmin && this.isProfileOwner) {
              await this.initMe();
            }
            this.savingInfo = false;
            this.$router.push({ name: "users" });
          }
        }
      });
    }
  }
};
</script>
