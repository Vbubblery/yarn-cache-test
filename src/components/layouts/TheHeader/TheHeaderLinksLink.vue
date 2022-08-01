<i18n>
{
  "fr": {
    "Dashboard": "Dashboard",
    "Demand": "Demande",
    "Planning": "Planning",
    "Orders": "Commandes",
    "Data": "Data"
  },
  "en": {
    "Dashboard": "Dashboard",
    "Demand": "Demand",
    "Planning": "Planning",
    "Orders": "Orders",
    "Data": "Data"
  }
}
</i18n>

<template>
  <router-link active-class="active-link" class="header-link" :to="to">
    {{ $t(linkName) }}
  </router-link>
</template>

<script>
export default {
  name: "TheHeaderLinksLink",
  props: {
    to: {
      type: [Object, String],
      required: true
    },
    linkName: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

@mixin active-link-border {
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: black;
    border-radius: 4px;
  }
}

.header-link {
  text-decoration: none;
  position: relative;
  padding: 22px 0;
  margin-right: 48px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: $color-original-500;

  &:hover {
    color: black;
    @include active-link-border;
  }

  &:last-child {
    margin-right: 0;
  }
}

.active-link {
  color: black;
  @include active-link-border;
}
</style>
