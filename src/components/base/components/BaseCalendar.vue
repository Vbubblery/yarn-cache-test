<template>
  <form class="flex items-center w-full" @submit.prevent>
    <div
      class="flex flex-col sm:flex-row justify-start items-center cursor-pointer w-24"
    >
      <date-picker
        :value="startDate"
        :type="timebucket"
        :lang="lang"
        :formatter="dateFormatter"
        value-type="DD M YYYY"
        :disabled="fixStartDate"
        :show-week-number="true"
        :clearable="false"
        :disabled-date="isCurStartDateAvailable"
        @change="date => handleInputChange(date, 'startDate')"
      >
        <icon-calendar />
      </date-picker>
    </div>
    <div class="mx-2 text-lg">-</div>
    <div
      class="flex flex-col sm:flex-row justify-start items-center cursor-pointer w-24"
    >
      <date-picker
        :value="endDate"
        :type="timebucket"
        :lang="lang"
        :formatter="dateFormatter"
        value-type="DD M YYYY"
        :show-week-number="true"
        :clearable="false"
        :disabled-date="isCurEndDateAvailable"
        @change="date => handleInputChange(date, 'endDate')"
      >
        <icon-calendar />
      </date-picker>
    </div>
  </form>
</template>

<script lang="ts">
import dayjs from "@/dayjs";
import {
  defineComponent,
  toRefs,
  SetupContext,
  computed
} from "@vue/composition-api";
//@ts-ignore
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/fr";
import en from "date-format-parse/lib/locale/en";
import { ICalendarDates } from "@/forecasts-review/typings";
import { FlowlityDateUnit } from "@/helper/date";
import { useCalendarDates } from "@/forecasts-review/composables/calendar";
interface IBaseCalendar {
  targetModule: keyof ICalendarDates;
  fixStartDate: Boolean;
  locale: string;
}
type DateType = "startDate" | "endDate";

export default defineComponent({
  name: "BaseCalendar",
  components: { DatePicker },
  props: {
    targetModule: {
      type: String,
      required: true
    },
    locale: {
      type: String,
      required: false,
      default: "en"
    },
    fixStartDate: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["calendar-date-change"],

  setup(props: IBaseCalendar, context: SetupContext) {
    const store = context.parent?.$store || null;
    const { targetModule, locale } = toRefs(props);
    const horizonInWeeks: number =
      store?.getters["common/getCurrentSite"]?.[
        `${targetModule.value}HorizonWeeks`
      ];
    const {
      startDateByModule,
      endDateByModule,
      periodType,
      updateStartDate,
      updateEndDate
    } = useCalendarDates(store!); // TODO: Remove the store parameter after removing all the dependencies to selectedOptions and SubmittedOptions

    const timebucket = computed<FlowlityDateUnit>(
      () => periodType.value[targetModule.value]
    );
    const lang = computed(() => {
      switch (locale.value) {
        case "fr":
          return "fr";
        default:
          return {
            formatLocale: {
              ...en,
              firstDayOfWeek: 1
            }
          };
      }
    });
    const dateFormatByTimeBucket = (selectedTimebucket: FlowlityDateUnit) => {
      switch (selectedTimebucket) {
        case "week":
          return "[W]W/YYYY";
        case "month":
          return "M/YYYY";
        default:
          return "DD. MM. YYYY";
      }
    };
    const computedStartDate = computed(
      () => startDateByModule.value[targetModule.value]
    );
    const computedEndDate = computed(
      () => endDateByModule.value[targetModule.value]
    );

    const handleInputChange = (newDate: string, dateType: DateType) => {
      let newValue = dayjs(newDate, dateFormatByTimeBucket(timebucket.value));
      // transform week number to date
      if (timebucket.value === "week") {
        const splittedDates = newDate.split(/(?:W|[/])+/).filter(Boolean);
        const startOfYear = `${splittedDates[1]}-01-01`;
        // firstDay of year is week 1 then we should add weekNumber - 1 weeks
        const isFirstWeek = dayjs(startOfYear).isoWeek() === 1;
        newValue =
          dateType === "startDate"
            ? dayjs(startOfYear).add(
                parseInt(splittedDates[0]) - (isFirstWeek ? 1 : 0),
                "week"
              )
            : dayjs(startOfYear).add(
                parseInt(splittedDates[0]) - (isFirstWeek ? 1 : 0),
                "week"
              );
      }
      switch (dateType) {
        case "startDate":
          updateStartDate(newValue.toISOString(), targetModule.value);
          break;
        case "endDate":
          updateEndDate(newValue.toISOString(), targetModule.value);
          break;
      }
      context.emit("calendar-date-change");
    };
    const dateFormatter = {
      //[optional] Date to String
      stringify: (date: Date) => {
        return dayjs(date).format(dateFormatByTimeBucket(timebucket.value));
      },
      // use custom week calculator
      getWeek: (date: string) => {
        const week = dayjs(date).isoWeek();
        return week;
      }
    };
    const isCurStartDateAvailable = (date: string) => {
      return dayjs(date).isAfter(
        dayjs(computedEndDate.value),
        timebucket.value
      );
    };
    const isCurEndDateAvailable = (date: string) => {
      return (
        dayjs(date).isBefore(
          dayjs(computedStartDate.value),
          timebucket.value
        ) || dayjs(date).isAfter(dayjs().add(horizonInWeeks, "weeks"))
      );
    };

    return {
      startDate: dayjs(computedStartDate.value).format("DD M YYYY"),
      endDate: dayjs(computedEndDate.value).format("DD M YYYY"),
      timebucket,
      lang,
      dateFormatter,
      dateFormatByTimeBucket,
      handleInputChange,
      isCurStartDateAvailable,
      isCurEndDateAvailable
    };
  }
});
</script>
<style lang="scss" src="@/assets/styles/calendar.scss" />
