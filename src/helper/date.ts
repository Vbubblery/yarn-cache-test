import dayjs from "@/dayjs";

type DateUnitTypeShort = "d" | "M" | "y" | "h" | "m" | "s" | "ms";

type DateUnitTypeLong =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"
  | "year"
  | "date";

type DateUnitTypeLongPlural =
  | "milliseconds"
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "months"
  | "years"
  | "dates";

export type FlowlityDateUnit = Extract<DateUnitType, "month" | "week" | "day">;

type PeriodTypes = Record<Uppercase<FlowlityDateUnit>, FlowlityDateUnit>;

export type DateUnitType =
  | DateUnitTypeLong
  | DateUnitTypeLongPlural
  | DateUnitTypeShort
  | "w"
  | "week"
  | "weeks";

export const DATE_FORMAT_ERROR =
  "Invalid argument(s) format. Only ISO date strings allowed";

const ISODatePattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;

export const isValidDateString = (dateString: string): boolean =>
  ISODatePattern.test(dateString);

export const dateFunc = <Func extends (...args: string[]) => ReturnType<Func>>(
  fn: Func
): ((...args: Parameters<Func>) => ReturnType<Func>) => {
  return (...args) => {
    if (args.every(arg => isValidDateString(arg))) return fn(...args);
    else throw new Error(DATE_FORMAT_ERROR);
  };
};

export const addToDate = (aDate: string, value: number, unit: DateUnitType) =>
  dateFunc((anISODateString: string) =>
    dayjs(anISODateString).add(value, unit).toISOString()
  )(aDate);

export const subtractFromDate = (
  aDate: string,
  value: number,
  unit: DateUnitType
) =>
  dateFunc((anISODateString: string) =>
    dayjs(anISODateString).subtract(value, unit).toISOString()
  )(aDate);

export const currentDate = () => dayjs().toISOString();
export const extractFromDate = (aDate: string, unit: DateUnitTypeLong) =>
  dateFunc((anISODateString: string) => dayjs(anISODateString)[unit]())(aDate);

export const minDate = (date1: string, date2: string) =>
  dateFunc((isoDate1: string, isoDate2: string) => {
    return dayjs(isoDate1).isBefore(isoDate2) ? isoDate1 : isoDate2;
  })(date1, date2);

export const PERIOD_TYPES: PeriodTypes = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month"
};

export const DEFAULT_PLANNING_HORIZONS = {
  DAYS: 60,
  WEEKS: 22,
  MONTHS: 6
};

export const DEFAULT_DEMAND_HORIZONS = {
  PAST: {
    MONTHS: 12
  },
  FUTURE: {
    MONTHS: 6
  }
};
