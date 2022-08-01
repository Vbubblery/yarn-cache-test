<i18n>
{
  "en": {
    "from": "From",
    "to": "To"
  },
  "fr": {
    "from": "A partir du",
    "to": "jusqu'au"
  }
}
</i18n>

<template>
  <div class="mb-5">
    <section class="flex -mx-2">
      <div class="w-1/2 px-2">
        <p class="text-gray-600 text-sm font-bold my-0">
          {{ $t("from") }}
        </p>
        <a-month-picker
          v-if="selectedPeriodType === 'month'"
          v-model="startValue"
          :disabled-date="disabledStartDate"
          :disabled="disableStart"
          :size="'large'"
          :allow-clear="false"
          :format="'MMM YYYY'"
          placeholder="Select month"
        />
        <a-date-picker
          v-else
          v-model="startValue"
          :disabled-date="disabledStartDate"
          :disabled="disableStart"
          :size="'large'"
          :allow-clear="false"
          :format="'DD/MM/YYYY'"
        />
      </div>
      <div class="w-1/2 px-2">
        <p class="text-gray-600 text-sm font-bold my-0">
          {{ $t("to") }}
        </p>
        <a-month-picker
          v-if="selectedPeriodType === 'month'"
          v-model="endValue"
          :disabled-date="disabledEndDate"
          :size="'large'"
          :allow-clear="false"
          :format="'MMM YYYY'"
          placeholder="Select month"
        />
        <a-date-picker
          v-else
          v-model="endValue"
          :disabled-date="disabledEndDate"
          :size="'large'"
          :allow-clear="false"
          :format="'DD/MM/YYYY'"
        />
      </div>
    </section>
  </div>
</template>

<script>
import dayjs from "@/dayjs";
import { DatePicker } from "ant-design-vue";

export default {
  name: "BaseSidebarDatepicker",
  components: {
    "a-date-picker": DatePicker,
    "a-month-picker": DatePicker.MonthPicker
  },
  props: {
    targetModule: {
      type: String,
      required: true
    },
    disableStart: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      todayPlusOneYear: dayjs().add(1, "year")
    };
  },
  computed: {
    selectedPeriodType: {
      get() {
        return this.$store.getters[
          this.targetModule + "/getSelectedPeriodType"
        ];
      }
    },
    startValue: {
      get() {
        return dayjs(
          this.$store.getters[this.targetModule + "/getSelectedStartDate"]
        );
      },
      set(date) {
        this.$store.dispatch(
          this.targetModule + "/updateSelectedStartDate",
          date
        );
      }
    },
    endValue: {
      get() {
        return dayjs(
          this.$store.getters[this.targetModule + "/getSelectedEndDate"]
        );
      },
      set(date) {
        this.$store.dispatch(
          this.targetModule + "/updateSelectedEndDate",
          date
        );
      }
    }
  },
  methods: {
    disabledStartDate(startValue) {
      if (this.targetModule === "data" && startValue.isAfter()) return true;
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return (
        startValue.valueOf() > endValue.valueOf() ||
        dayjs(startValue).add(1, this.selectedPeriodType).valueOf() <
          dayjs(endValue).subtract(3, "year").valueOf()
      );
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      switch (true) {
        case this.targetModule === "data" && endValue.isAfter():
          return true;
        case this.targetModule === "planning" &&
          endValue > this.todayPlusOneYear:
          return true;
        default:
          if (!endValue || !startValue) {
            return false;
          }
          return startValue.valueOf() >= endValue.valueOf();
      }
    }
  }
};
</script>
