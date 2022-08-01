<template>
  <SingleSelectDropdown
    :items="filteredSites"
    :selected-item="currentSite"
    :popper-distance="8"
    list-height="192px"
    placement="bottom-start"
    popper-class="w-[248px]"
    class="mr-4"
    @select:item="siteId = $event.id"
    @update:shown="onShownUpdate"
  >
    <template #default>
      <BaseButton condensed type="action" :active="shown" icon="map-pin-2-fill">
        <template v-if="currentSite">
          {{ currentSite.name }}
        </template>
      </BaseButton>
    </template>

    <template #header>
      <BaseInput
        v-model="searchQuery"
        autofocus
        type="search"
        :placeholder="$t('search')"
        icon="search-line"
        :class="{ 'mb-2': filteredSites.length > 0 }"
        @mounted="inputRef = $event"
      />
    </template>
  </SingleSelectDropdown>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import { baseOptions } from "@/sweetalert";
import SingleSelectDropdown from "@/components/base/components/dropdown/SingleSelectDropdown.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import BaseInput from "@/components/base/components/BaseInput.vue";
import { timeout } from "@/helper/timeout";

export default {
  name: "TheHeaderSiteDropdown",
  components: {
    SingleSelectDropdown,
    BaseButton,
    BaseInput
  },
  data() {
    return {
      searchQuery: "",
      shown: false,
      inputRef: null
    };
  },
  computed: {
    ...mapGetters("common", [
      "getMe",
      "getCurrentSite",
      "getSitesByCompany",
      "getCompany"
    ]),
    ...mapGetters("planning", {
      planningGetHasTablesWithChanges: "getHasTablesWithChanges"
    }),
    ...mapGetters("demand", {
      demandGetHasTablesWithChanges: "getHasTablesWithChanges"
    }),
    siteId: {
      get() {
        return this.getCurrentSite.id;
      },
      async set(siteId) {
        if (
          this.planningGetHasTablesWithChanges ||
          this.demandGetHasTablesWithChanges
        ) {
          const status = await Swal.fire({
            ...baseOptions,
            title: this.$t("siteDropdown.unsavedWarningTitle"),
            text: this.$t("siteDropdown.unsavedWarningText"),
            confirmButtonText: this.$t(
              "siteDropdown.unsavedWarningConfirmButton"
            ),
            cancelButtonText: this.$t("siteDropdown.unsavedWarningCancelButton")
          }).then(result => result.isConfirmed);
          if (!status) {
            return;
          }
          this.planningResetTablesWithChanges();
          this.demandResetTablesWithChanges();
        }
        if (siteId) {
          this.initCurrentSite(siteId).then(() => {
            this.$forceUpdate();
          });
        }
      }
    },
    sites() {
      const sites = this.getSitesByCompany(this.getCompany.id);
      const baseSites =
        this.getMe.superAdmin && sites
          ? Object.values(sites)
          : this.getMe.sites;
      return baseSites
        .map(site => ({
          id: site.id,
          name: site.name,
          value: site.id
        }))
        .sort((s1, s2) => {
          const name1 = s1.name.toLowerCase();
          const name2 = s2.name.toLowerCase();
          if (name1 < name2) return -1;
          if (name1 > name2) return 1;
          return 0;
        });
    },
    filteredSites() {
      return this.sites.filter(s => {
        return s.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    currentSite() {
      return this.sites.find(s => s.id === this.siteId);
    }
  },
  methods: {
    ...mapActions("common", ["initCurrentSite"]),
    ...mapMutations("planning", {
      planningResetTablesWithChanges: "resetTablesWithChanges"
    }),
    ...mapMutations("demand", {
      demandResetTablesWithChanges: "resetTablesWithChanges"
    }),
    dropdownFilterOption(input, option) {
      return option.data.key.toLocaleLowerCase().includes(input);
    },
    async onShownUpdate(shown) {
      this.shown = shown;

      if (shown) {
        // time for rendering before focus will be put
        await timeout(100);
        this.inputRef?.value.focus();
      }
    }
  }
};
</script>
