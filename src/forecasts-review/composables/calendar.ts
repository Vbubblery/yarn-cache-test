import {
  addToDate,
  currentDate,
  dateFunc,
  DEFAULT_DEMAND_HORIZONS,
  DEFAULT_PLANNING_HORIZONS,
  FlowlityDateUnit,
  PERIOD_TYPES,
  subtractFromDate
} from "@/helper/date";
import { ref } from "@vue/composition-api";
import { Store } from "vuex";
import { ICalendarDates } from "../typings";

const startDateByModule = ref<ICalendarDates>({
  demand: subtractFromDate(
    currentDate(),
    DEFAULT_DEMAND_HORIZONS.PAST.MONTHS,
    PERIOD_TYPES.MONTH
  ),
  planning: currentDate()
});

const endDateByModule = ref<ICalendarDates>({
  demand: addToDate(
    currentDate(),
    DEFAULT_DEMAND_HORIZONS.FUTURE.MONTHS,
    PERIOD_TYPES.MONTH
  ),
  planning: addToDate(
    currentDate(),
    DEFAULT_PLANNING_HORIZONS.WEEKS,
    PERIOD_TYPES.WEEK
  )
});

const periodType = ref<Record<keyof ICalendarDates, FlowlityDateUnit>>({
  demand: PERIOD_TYPES.MONTH,
  planning: PERIOD_TYPES.WEEK
});

export const useCalendarDates = ({ commit }: Store<unknown>) => {
  const updateStartDate = (aDate: string, module: keyof ICalendarDates) => {
    dateFunc(anISODateString => {
      startDateByModule.value[module] = anISODateString;
    })(aDate);
    commit(`${module}/updateSelectedStartDate`, aDate);
  };
  const updateEndDate = (aDate: string, module: keyof ICalendarDates) => {
    dateFunc(anISODateString => {
      endDateByModule.value[module] = anISODateString;
    })(aDate);
    commit(`${module}/updateSelectedEndDate`, aDate);
  };

  const updatePeriodType = (
    unit: FlowlityDateUnit,
    module: keyof ICalendarDates
  ) => {
    periodType.value[module] = unit;
    commit(`${module}/updateSelectedPeriodType`, unit);
  };

  return {
    startDateByModule,
    endDateByModule,
    periodType,
    updateStartDate,
    updateEndDate,
    updatePeriodType
  };
};
