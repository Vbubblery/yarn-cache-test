<template>
  <SingleSelectDropdown
    :items="dropdownItems"
    :popper-distance="8"
    placement="bottom-end"
    popper-class="w-[248px]"
    @select:item="onSelect"
  >
    <template #default="{ shown }">
      <BaseButton :active="shown" condensed type="action" icon="user-fill">
        <span v-if="user.name">
          {{ user.name }}
        </span>
      </BaseButton>
    </template>
  </SingleSelectDropdown>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { useI18n } from "vue-i18n-composable";
import SingleSelectDropdown from "@/components/base/components/dropdown/SingleSelectDropdown.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

interface IDropdownItem {
  id: string;
  name: string;
  icon: string;
  handler: () => void;
}

export default defineComponent({
  components: {
    SingleSelectDropdown,
    BaseButton
  },
  emits: ["change-lang"],
  setup(_props, context) {
    const { t } = useI18n();
    const user = computed(() => context.root.$store.getters["common/getMe"]);

    const dropdownItems = computed<IDropdownItem[]>(() => {
      const items = [
        {
          id: "profile",
          name: t("header.editProfile") as string,
          icon: "user-settings-fill",
          handler: () =>
            context.root.$router.push({
              name: "editUser",
              params: {
                userId: `${user.value.id}`
              }
            })
        },
        {
          id: "language",
          name: t("header.lang") as string,
          icon: "translate-2",
          handler: () => context.emit("change-lang")
        },
        {
          id: "logout",
          name: t("header.logout") as string,
          icon: "logout-box-r-line",
          // @ts-ignore
          handler: () => context.root.$auth.logout()
        }
      ];

      if (user.value.admin || user.value.superAdmin) {
        items.splice(2, 0, {
          id: "settings",
          name: t("header.settings") as string,
          icon: "settings-4-fill",
          handler: () => context.root.$router.push("/admin/company")
        });
      }

      return items;
    });

    const onSelect = (item: IDropdownItem) => item.handler();

    return { dropdownItems, user, onSelect };
  }
});
</script>
