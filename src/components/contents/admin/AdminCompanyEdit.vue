<i18n>
{
  "en": {
    "title": "Company",
    "name": "Name",
    "nameError": "Please add a company name",
    "cancel": "Cancel"
  },
  "fr": {
    "title": "Entreprise",
    "name": "Nom",
    "nameError": "Ajoutez un nom d'entreprise",
    "cancel": "Annuler"
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
        <p class="text-gray-800 font-bold text-xl mb-16">
          {{ $t("title") }}
        </p>
        <a-form :form="form">
          <p class="m-0 text-gray-600">
            {{ $t("name") }}
          </p>
          <a-form-item>
            <a-input
              v-decorator="[
                'name',
                {
                  initialValue: getCompany.name,
                  rules: [{ required: true, message: $t(`nameError`) }]
                }
              ]"
              :disabled="true"
            />
          </a-form-item>
          <p class="m-0 text-gray-600">Email</p>
          <a-form-item>
            <a-input
              v-decorator="[
                'email',
                {
                  initialValue: getCompany.email
                }
              ]"
              :disabled="true"
            />
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Form, Input } from "ant-design-vue";

export default {
  name: "AdminCompanyEdit",
  components: {
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input
  },
  data() {
    return {
      form: Form.createForm(this)
    };
  },
  computed: {
    ...mapGetters("common", ["getCompany"])
  }
};
</script>
