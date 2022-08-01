import dayjs from "dayjs";

export default {
  methods: {
    handleStartDateChange(startDate) {
      this.startDate = startDate;
    },
    handleEndDateChange(endDate) {
      this.endDate = endDate.endOf("day");
    },
    disabledStartDate(startDate) {
      const endDate = this.endDate;
      if (!startDate || !endDate) {
        return startDate < dayjs().startOf("day");
      }
      return (
        startDate.valueOf() > endDate.valueOf() ||
        startDate < dayjs().startOf("day")
      );
    },
    disabledEndDate(endDate) {
      const startDate = this.startDate;
      if (!startDate || !endDate) {
        return endDate < dayjs().startOf("day");
      }
      return (
        startDate.valueOf() >= endDate.valueOf() ||
        endDate < dayjs().startOf("day")
      );
    }
  }
};
