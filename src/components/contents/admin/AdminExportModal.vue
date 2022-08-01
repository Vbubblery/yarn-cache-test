<i18n>
{
  "en": {
    "title": "Downloads",
    "desc": "Please select the file and format you want to download",
    "salesOrders": "Sales Orders",
    "purchaseOrders": "Purchase Orders",
    "transfers": "Transfers",
    "planning": "Planning",
    "demands": "Demand Forecasts",
    "file": "File(s)",
    "localDownload": "Local Download",
    "sftpSuccess": "Data successfully exported",
    "exportError": "Export has failed with the following error: ",
    "period": "Period",
    "site": "Site(s)",
    "timebucket": "Period type",
    "week": "Week",
    "month": "Month"
  },
  "fr": {
    "title":"Téléchargements",
    "desc": "Sélectionner le type et le format du fichier à télécharger",
    "salesOrders": "Commandes de ventes",
    "purchaseOrders": "Commandes d'achats",
    "transfers": "Transferts",
    "planning": "Plan",
    "demands": "Prévisions de Demandes",
    "file": "Fichier(s)",
    "localDownload": "Téléchargement local",
    "sftpSuccess": "Données exportées avec succès",
    "exportError": "L'export a échoué avec l'erreur suivante: ",
    "period": "Période",
    "site": "Site(s)",
    "timebucket": "Type de période",
    "week": "Semaine",
    "month": "Mois"
  }
}
</i18n>
<template>
  <a-modal
    :title="$t('title')"
    :visible="showModal"
    :confirm-loading="modalLoading"
    :mask-closable="false"
    width="600px"
    :ok-button-props="{ props: { disabled: disableOkButton } }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div>
      <p class="mb-4">
        {{ $t("desc") }}
      </p>
      <div class="m-0 font-bold text-gray-600">
        {{ $t("site") }}
      </div>
      <a-select
        v-model="selectedSites"
        label-in-value
        mode="multiple"
        allow-clear
        show-search
        class="w-full"
        :dropdown-match-select-width="false"
        :filter-option="dropdownFilterOption"
      >
        <a-select-option
          v-for="site in sites"
          :key="site.key"
          :value="site.value"
        >
          {{ site.label }}
        </a-select-option>
      </a-select>
      <div class="mt-4 m-0 font-bold text-gray-600">
        {{ $t("file") }}
      </div>
      <div class="flex">
        <div
          v-for="source in Object.keys(checkedSources)"
          :key="source"
          class="flex flex-col"
        >
          <a-checkbox
            v-if="showSource(source)"
            class="m-0"
            :checked="checkedSources[source]"
            @change="toggleSelectedSource(source)"
          >
            {{ $t(source) }}
          </a-checkbox>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <p class="m-0 font-bold text-gray-600">
        {{ $t("period") }}
      </p>
      <a-date-picker
        v-model="startValue"
        :disabled-date="disabledStartDate"
        :size="'large'"
        :allow-clear="false"
        :format="'DD/MM/YYYY'"
      />
      <a-date-picker
        v-model="endValue"
        class="ml-2"
        :disabled-date="disabledEndDate"
        :size="'large'"
        :allow-clear="false"
        :format="'DD/MM/YYYY'"
      />
    </div>
    <div v-if="!getCurrentSite.isSupplierView" class="mt-4">
      <p class="m-0 font-bold text-gray-600">
        {{ $t("timebucket") }}
      </p>
      <a-radio-group v-model="timebucket" class="ml-2" button-style="solid">
        <a-radio-button value="week">
          {{ $t("week") }}
        </a-radio-button>
        <a-radio-button value="month">
          {{ $t("month") }}
        </a-radio-button>
      </a-radio-group>
    </div>
    <div v-if="!getCurrentSite.isSupplierView" class="mt-4">
      <p class="m-0 font-bold text-gray-600">Destination</p>
      <a-radio-group
        v-model="exportDestination"
        class="ml-2"
        button-style="solid"
      >
        <a-radio-button value="download">
          {{ $t("localDownload") }}
        </a-radio-button>
        <a-radio-button v-if="getCompany.allowSftpExport" value="sftp">
          SFTP
        </a-radio-button>
      </a-radio-group>
    </div>
    <div v-if="exportDestination === 'download'" class="mt-4">
      <p class="m-0 font-bold text-gray-600">Format</p>
      <a-radio-group v-model="selectedFormat" class="ml-2" button-style="solid">
        <a-radio-button value="csv"> CSV </a-radio-button>
        <a-radio-button value="json"> JSON </a-radio-button>
      </a-radio-group>
    </div>
  </a-modal>
</template>

<script>
import dayjs from "@/dayjs";
import SupervisorService from "@/services/supervisor.service";
import { DatePicker } from "ant-design-vue";
import { Modal, Radio, Checkbox, Select } from "ant-design-vue";
import { mapGetters } from "vuex";
import NotificationService from "@/services/notification.service";

export default {
  name: "AdminExportModal",
  components: {
    "a-date-picker": DatePicker,
    "a-modal": Modal,
    "a-radio-group": Radio.Group,
    "a-radio-button": Radio.Button,
    "a-checkbox": Checkbox,
    "a-select": Select,
    "a-select-option": Select.Option
  },
  props: {
    modalVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["show-modal"],
  data() {
    return {
      modalLoading: false,
      selectedFormat: "csv",
      exportDestination: "download",
      startValue: dayjs(),
      endValue: null,
      checkedSources: {
        purchaseOrders: true,
        planning: false,
        demands: false,
        transfers: false,
        salesOrders: false
      },
      selectedSites: [],
      timebucket: "month"
    };
  },
  computed: {
    ...mapGetters("common", ["getMe", "getCompany", "getCurrentSite"]),
    fileFormat() {
      return this.exportDestination === "sftp" ? "sftp" : this.selectedFormat;
    },
    disableOkButton() {
      const sources = Object.keys(this.checkedSources).filter(
        s => this.checkedSources[s]
      );
      return sources.length == 0;
    },
    showModal: {
      get() {
        return this.modalVisible;
      },
      set() {
        this.$emit("show-modal");
      }
    },
    sites() {
      const sites = this.getMe.sites;
      return sites
        .filter(
          site => site.is_supplier_view == this.getCurrentSite.isSupplierView
        )
        .map(site => ({
          label: site.name,
          value: site.id,
          key: site.name
        }));
    }
  },
  watch: {
    getCurrentSite() {
      this.selectedSites = [
        {
          key: this.getCurrentSite.id,
          label: this.getCurrentSite.name
        }
      ];
    }
  },
  created() {
    this.selectedSites = [
      {
        key: this.getCurrentSite.id,
        label: this.getCurrentSite.name
      }
    ];
    if (this.getCurrentSite.isSupplierView) {
      this.checkedSources.purchaseOrders = false;
      this.checkedSources.salesOrders = true;
    }
    this.endValue = dayjs()
      .add(this.getCurrentSite.planningHorizonWeeks, "weeks")
      .subtract(1, "day");
  },
  methods: {
    toggleSelectedSource(source) {
      this.checkedSources[source] = !this.checkedSources[source];
    },
    showSource(source) {
      if (source == "planning") {
        return (
          !this.getCurrentSite.isSupplierView &&
          this.getMe.canAccess(["supply:read"])
        );
      } else if (source == "demands") {
        return (
          !this.getCurrentSite.isSupplierView &&
          this.getMe.canAccess(["demand:read"])
        );
      } else if (source == "purchaseOrders") {
        return (
          this.getMe.canAccess(["order:read"]) &&
          !this.getCurrentSite.isSupplierView
        );
      } else if (source == "salesOrders") {
        return (
          this.getMe.canAccess(["order:read"]) &&
          this.getCurrentSite.isSupplierView
        );
      } else if (source == "transfers") {
        return (
          this.getCurrentSite.storages.length &&
          this.getMe.canAccess(["supply:read"])
        );
      } else {
        return false;
      }
    },
    async handleOk() {
      this.modalLoading = true;
      try {
        const sources = Object.keys(this.checkedSources).filter(
          s => this.checkedSources[s]
        );
        for (const source of sources) {
          await SupervisorService.exportFile(
            this.selectedSites,
            null,
            this.fileFormat,
            source,
            this.$t("sftpSuccess"),
            this.startValue.utc().startOf("day").format(),
            this.endValue.utc().endOf("day").format(),
            this.timebucket
          );
        }
        this.showModal = false;
        this.modalLoading = false;
      } catch (error) {
        NotificationService.error(this.$t("exportError") + error.message);
        this.showModal = false;
        this.modalLoading = false;
      }
    },
    handleCancel() {
      this.showModal = false;
    },
    disabledStartDate(startValue) {
      if (!startValue || !this.endValue) return false;
      if (startValue.valueOf() > this.endValue.valueOf()) return true;
      return (
        this.endValue.diff(startValue, "week") >=
        this.getCurrentSite.planningHorizonWeeks
      );
    },
    disabledEndDate(endValue) {
      if (!endValue || !this.startValue) return false;
      if (this.startValue.valueOf() > endValue.valueOf()) return true;
      if (this.getCurrentSite.isSupplierView)
        return endValue.diff(this.startValue, "year") >= 1;
      return (
        endValue.diff(this.startValue, "week") >=
        this.getCurrentSite.planningHorizonWeeks
      );
    },
    dropdownFilterOption(input, option) {
      return option.data.key.toLocaleLowerCase().includes(input);
    }
  }
};
</script>
