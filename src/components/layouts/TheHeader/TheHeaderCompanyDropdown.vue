<template>
  <SingleSelectDropdown
    :items="filteredCompanies"
    :selected-item="activeCompany"
    :popper-distance="8"
    list-height="192px"
    placement="bottom-start"
    popper-class="w-[248px]"
    class="mr-4"
    @select:item="select"
  >
    <template #default="{ shown }">
      <BaseButton condensed type="action" :active="shown" icon="building-fill">
        {{ activeCompany.name }}
      </BaseButton>
    </template>

    <template #header>
      <BaseInput
        v-model="searchQuery"
        type="search"
        :placeholder="$t('search')"
        icon="search-line"
        :class="{ 'mb-2': filteredCompanies.length > 0 }"
      />
    </template>
  </SingleSelectDropdown>
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-explicit-any: 0 */
import {
  defineComponent,
  computed,
  ref,
  SetupContext
} from "@vue/composition-api";
import SingleSelectDropdown from "@/components/base/components/dropdown/SingleSelectDropdown.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import BaseInput from "@/components/base/components/BaseInput.vue";

export default defineComponent({
  name: "TheHeaderCompanyDropdown",
  components: {
    BaseInput,
    SingleSelectDropdown,
    BaseButton
  },
  setup(_props, context: SetupContext) {
    const searchQuery = ref<string>("");

    const companies = computed(() => {
      return Object.values(
        context.root.$store.getters["common/getCompanies"]
      ).map((c: any) => ({
        id: c.id,
        name: c.name
      }));
    });

    context.root.$store.dispatch("common/fetchCompanies");

    const activeCompanyId = computed<string>(() => {
      return context.root.$store.getters["common/getCompany"].id;
    });

    const activeCompany = computed(() => {
      return companies.value.find(c => c.id === activeCompanyId.value);
    });

    const filteredCompanies = computed(() => {
      if (!searchQuery.value) {
        return companies.value;
      }
      return companies.value.filter(c => {
        return c.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    });

    const select = (company: any) => {
      context.root.$store.dispatch("common/initCompany", company);
    };

    return { activeCompany, companies, filteredCompanies, searchQuery, select };
  }
});
</script>
