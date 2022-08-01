import {
  defaultTableValueFormatting,
  isNotPast,
  isNotPastOrCurrent
} from "../base.js";

export const getPastDemandValues = (pastDemandObj, options) => {
  return pastDemandObj.values.map((value, index) => {
    return {
      value,
      isPast: !isNotPast(index, options.periods, options.periodType),
      isPastOrCurrent: !isNotPastOrCurrent(
        index,
        options.periods,
        options.periodType
      )
    };
  });
};

export const pastDemandCalc = (value, isPastOrCurrent) => {
  if (!isPastOrCurrent) return null;
  else if (!value) return 0;
  return defaultTableValueFormatting(value);
};
