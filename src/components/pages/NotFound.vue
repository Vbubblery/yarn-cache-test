<i18n>
{
  "en": {
    "statement": "Oops, sorry, it seems that this page does not exist.",
    "suggestion": "Maybe you would like to go ",
    "home": "to the home"
  },
  "fr": {
    "statement": "Oups, il semblerait que cette page n'existe pas.",
    "suggestion": "Souhaitez-vous aller à ",
    "home": "la page d'accueil"
  }
}
</i18n>
<template>
  <div class="h-full flex items-center justify-center">
    <div style="width: 500px" class="space-y-12">
      <div class="flex justify-center">
        <img
          style="width: 200px"
          src="@/assets/img/logo.svg"
          alt="Flowlity logo"
        />
      </div>
      <div class="text-center">
        <h1 class="font-bold">
          {{ $t("statement") }}
        </h1>

        <h3 class="mt-3">
          {{ $t("suggestion") }}
          <router-link class="underline text-blue-600" :to="{ name: 'home' }">
            {{ $t("home") }}
          </router-link>
        </h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NotFound"
};
</script>
