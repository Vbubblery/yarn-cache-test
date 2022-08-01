<i18n>
{
  "en": {
    "dataWarningMain": "The data is being updated... It will take ",
    "dataWarningMinutes": "{count} more minute. | {count} more minute. | {count} more minutes.",
    "dataWarningHour": "more than one hour.",
    "dataWarningThirtyMinutes": "more than 30 minutes.",
    "dataWarningAlmostDone": "The data is being updated... It's taking a little longer today, but it will be done in a few minutes.",
    "dataWarningSubItem": "You can continue working, however the data can be obsolete."
  },
  "fr": {
    "dataWarningMain": "Les données sont en train d'être mises à jour... Cela devrait prendre ",
    "dataWarningMinutes": "encore {count} minute. | encore {count} minute. | encore {count} minutes.",
    "dataWarningHour": "plus d'une heure.",
    "dataWarningThirtyMinutes": "plus de 30 minutes.",
    "dataWarningAlmostDone": "Les données sont en train d'être mises à jour... Cela prend un peu plus de temps aujourd'hui, veuillez patienter encore quelques minutes.",
    "dataWarningSubItem": "Vous pouvez continuer de travailler, mais les données sont potentiellement obsolètes."
  }
}
</i18n>

<template>
  <div
    v-if="dataJobsIsRunning && dataJobsLastCompletionTime"
    style="height: 60px"
    class="bg-orange-200 flex items-center px-16 space-x-6"
  >
    <div class="relative">
      <BaseSVG name="tools-fill" class="text-orange-400" />
      <BaseSpinner
        class="rounded-full text-orange-500"
        style="position: absolute; bottom: -3px; right: -3px"
      />
    </div>
    <div>
      <div>
        <p class="text-orange-700 text-base">
          <span v-if="remainingMinutesToCompleteDataJobs >= 60">
            {{ `${$t("dataWarningMain")} ${$t("dataWarningHour")}` }}
          </span>
          <span v-else-if="remainingMinutesToCompleteDataJobs >= 30">
            {{ `${$t("dataWarningMain")} ${$t("dataWarningThirtyMinutes")}` }}
          </span>
          <span v-else-if="remainingMinutesToCompleteDataJobs > 0">
            {{
              `${$t("dataWarningMain")} ${$tc(
                "dataWarningMinutes",
                remainingMinutesToCompleteDataJobs
              )}`
            }}
          </span>
          <span v-else-if="remainingMinutesToCompleteDataJobs <= 0">
            {{ $t("dataWarningAlmostDone") }}
          </span>
        </p>
      </div>
      <div>
        <p>{{ $t("dataWarningSubItem") }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { mapState, mapGetters, mapActions } from "vuex";
import helper from "@/helper/helper";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseSpinner from "@/components/base/components/BaseSpinner.vue";

export default defineComponent({
  name: "TheDataJobsHeader",
  components: {
    BaseSVG,
    BaseSpinner
  },
  computed: {
    ...mapState("alerts", {
      dataJobsIsRunning: state =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state as any).dataJobsAlerts?.dataJobsIsRunning,
      dataJobsLastCompletionTime: state =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state as any).dataJobsAlerts?.dataJobsLastCompletionTime
    }),
    ...mapGetters("common", ["getCurrentSite"]),
    remainingMinutesToCompleteDataJobs() {
      let minutes = helper.diffInMinutesFromATime(
        this.dataJobsLastCompletionTime
      );
      // We add 5 minutes of margin so we don't display too often the worst warning message
      minutes += 5;
      // So that: 0 -> 0 ; 1 -> 10 ; 59 -> 60
      const minutesRounded = helper.roundToNextMultiple(minutes, 10);
      return minutesRounded;
    }
  },
  watch: {
    getCurrentSite: {
      handler: function (newValue) {
        // eslint-disable-next-line no-underscore-dangle
        this.getDataJobStatus(newValue._id);
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions("alerts", ["getDataJobStatus"])
  }
});
</script>
