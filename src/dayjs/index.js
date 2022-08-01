import dayjs from "dayjs";
import frLocale from "dayjs/locale/fr";

import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";
import calendar from "dayjs/plugin/calendar";
import { calendarEnFormats, calendarFrFormats } from "@/dayjs/formats";

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(updateLocale);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(calendar);
dayjs.locale(frLocale);
dayjs.updateLocale('en', { calendar: calendarEnFormats });
dayjs.updateLocale('fr', { calendar: calendarFrFormats });

export default dayjs;
