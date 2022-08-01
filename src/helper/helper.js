import dayjs from "@/dayjs";
import cloneDeep from "lodash/cloneDeep";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";
import isEqual from "lodash/isEqual";
import intersectBy from "lodash/intersectionBy";
import { i18n } from "@/i18n/i18n@next";

const funcs = {
  /**
   * Check if date is between two dates
   * @param {string} dateStr - A string in the "YYYY-MM-DD" format.
   * @param {string} startDateStr - A string in the "YYYY-MM-DD" format.
   * @param {string} endDateStr - A string in the "YYYY-MM-DD" format.
   * @param {string} inclusivenessString - A string combination of two of (, ), [, ] to specify
   * if the start and end date should be included or not.
   * See https://day.js.org/docs/en/plugin/is-between
   */
  dateIsBetween(dateStr, startDateStr, endDateStr, inclusivenessString) {
    return dayjs(dateStr).isBetween(
      dayjs(startDateStr),
      dayjs(endDateStr),
      null,
      inclusivenessString
    );
  },
  dateDiff(date, dateToCompare, format) {
    return dayjs(date).diff(dayjs(dateToCompare), format);
  },
  dateIsPast(date) {
    return dayjs().isAfter(dayjs(date), "day");
  },
  dateToDisplay(dateStr, locale) {
    if (dayjs(dateStr, "YYYY-MM-DD").format("YYYY-MM-DD") == dateStr)
      return dayjs(dateStr, "YYYY-MM-DD").locale(locale).format("ddd DD/MM");
    if (dayjs(dateStr, "MMM YYYY", "en").format("MMM YYYY") == dateStr)
      return dayjs(dateStr, "MMM YYYY", "en").locale(locale).format("MMM YYYY");
    return dateStr;
  },
  defaultDateLabelDisplay(value, displayLocale) {
    return dayjs(value).locale(displayLocale).format("MMM YYYY");
  },
  uniqBy(arr, key) {
    return uniqBy(arr, key);
  },
  tableHeaderDateDisplay(dateStr, periodType) {
    if (dateStr === "currentDay") {
      return i18n.t(`planning.chart.${dateStr}`);
    }
    if (!["day", "week", "month"].includes(periodType))
      throw new Error(
        "periodType parameter must be either 'day', 'week', or 'month'"
      );
    if (periodType === "week") return dayjs(dateStr).format("YYYY [W]W");
    if (periodType === "month") return dayjs(dateStr).format("MMM YYYY");
    return dayjs(dateStr).format("ddd DD/MM");
  },
  currentPeriodStartDate(periodType) {
    if (periodType === "day") return dayjs().startOf("day");
    if (periodType === "week") return dayjs().startOf("week");
    if (periodType === "month") return dayjs().startOf("month");
  },
  todayStr() {
    return dayjs().format("YYYY-MM-DD");
  },
  timestampToday() {
    return dayjs().utc().startOf("day").unix();
  },
  dateStrToLastDate(dateStr, periodType) {
    if (periodType === "week") {
      return dayjs(dateStr).endOf("week");
    } else if (periodType === "month") {
      return dayjs(dateStr).endOf("month");
    } else return dayjs(dateStr, "YYYY-MM-DD").startOf("day");
  },
  periodStartOrEnd(dateStr, periodType, startOrEnd) {
    if (!["start", "end"].includes(startOrEnd))
      throw new Error("startOrEnd parameter must be either 'start' or 'end'");
    if (!["day", "week", "month"].includes(periodType))
      throw new Error(
        "periodType parameter must be either 'day', 'week', or 'month'"
      );
    if (startOrEnd === "start")
      return dayjs(dateStr, "YYYY-MM-DD").startOf(periodType);
    return dayjs(dateStr, "YYYY-MM-DD").endOf(periodType);
  },
  periodStartSinceToday(dateStr, periodType) {
    const date = this.periodStartOrEnd(dateStr, periodType, "start");
    return date.isBefore() ? dayjs().startOf("day") : date;
  },
  isFutureDate(dateStr, periodType) {
    return this.periodStartOrEnd(dateStr, periodType, "start").isAfter();
  },
  isDateStrCurrentPeriod(dateStr, periodType) {
    if (periodType === "day") return dateStr === dayjs().format("YYYY-MM-DD");
    if (periodType === "week") {
      return (
        dayjs(dateStr).startOf("year").year() === dayjs().year() &&
        dayjs(dateStr).startOf("week").isoWeek() === dayjs().isoWeek()
      );
    }
    if (periodType === "month") {
      return (
        dayjs(dateStr).startOf("year").year() === dayjs().year() &&
        dayjs(dateStr).startOf("month").month() === dayjs().month()
      );
    }
  },
  dateStrCurrentPeriod() {
    return [
      dayjs().locale("en").format("YYYY-MM-DD"),
      dayjs().locale("en").format("GGGG[W]WW"),
      dayjs().locale("en").format("MMM YYYY")
    ];
  },
  isWeekend(dateStr, periodType) {
    const weekday = dayjs(dateStr, "YYYY-MM-DD").weekday();
    return periodType == "day" && [5, 6].includes(weekday);
  },
  isDateStrBetweenDates(periodType, dateStr, startDate, endDate) {
    if (periodType === "week" || periodType === "month") {
      return (
        dayjs(dateStr, "YYYY-MM-DD")
          .startOf(periodType)
          .isSameOrAfter(startDate) &&
        dayjs(dateStr, "YYYY-MM-DD").startOf(periodType).isBefore(endDate)
      );
    } else {
      return (
        dayjs(dateStr, "YYYY-MM-DD").isSameOrAfter(startDate) &&
        dayjs(dateStr, "YYYY-MM-DD").isBefore(endDate)
      );
    }
  },
  addDaysToToday(days) {
    return dayjs().add(days, "day").endOf("day");
  },
  strDateFromNow(strDate, strToday) {
    if (dayjs(strDate).isSame(dayjs(), "day")) return strToday;
    return dayjs(strDate).fromNow();
  },
  timestampToString(timestamp, format) {
    return dayjs.unix(timestamp).format(format);
  },
  isEmpty(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  },
  keysOf(obj) {
    let res = [];
    for (var key in obj) {
      res.push(key);
    }
    return res;
  },
  valuesOf(obj) {
    let res = [];
    for (var key in obj) {
      res.push(obj[key]);
    }
    return res;
  },
  sumOf(arr) {
    return arr.reduce((a, b) => {
      return a + b;
    }, 0);
  },
  formatNumber(num) {
    return parseInt(num)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  },
  switchDateFormat(date, format_1, format_2) {
    return dayjs(date, format_1).format(format_2);
  },
  toCalendarDate(datetimeUTC) {
    return dayjs
      .utc(datetimeUTC)
      .local()
      .calendar();
  },
  clone(obj) {
    return cloneDeep(obj);
  },
  groupBy(arr, iteratee) {
    return groupBy(arr, iteratee);
  },
  isEqual(value, other) {
    return isEqual(value, other);
  },
  intersectionBy(key, ...arr) {
    return intersectBy(...arr, key);
  },
  createPeriodsArrayBetweenTwoDates(startDate, endDate, periodType) {
    let dateCounter = startDate;
    const periodOptions = {
      day: {
        plural: "days",
        format: "YYYY-MM-DD"
      },
      week: {
        plural: "weeks",
        format: "gggg[W]w"
      },
      month: {
        plural: "months",
        format: "MMM YYYY"
      }
    };

    const allPeriods = [];
    while (
      !dateCounter.isSame(
        dayjs(endDate).add(1, periodOptions[periodType].plural),
        periodType
      )
    ) {
      // we specify the locale 'en' because we get months in 'en' format
      allPeriods.push(
        dateCounter.locale("en").format(periodOptions[periodType].format)
      );
      dateCounter = dayjs(dateCounter).add(1, periodOptions[periodType].plural);
    }
    return allPeriods;
  },
  objHasOnlyFalsyValue(obj) {
    return !Object.keys(obj).some(key => obj[key]);
  },
  diffInMinutesFromATime(time) {
    const todayDate = dayjs().format("YYYY-MM-DD");
    const toDateTime = dayjs(`${todayDate} ${time}`);
    const fromDateTime = dayjs();
    return this.dateDiff(toDateTime, fromDateTime, "minutes");
  },
  roundToNextMultiple(valueToRound, multiple) {
    return Math.ceil(valueToRound / multiple) * multiple;
  }
};

export default funcs;
