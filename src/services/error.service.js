import Vue from "vue";
import NotificationService from "@/services/notification.service";
const errorService = {
  init() {
    Vue.config.errorHandler = error => this.errorHandler(error);
    window.onerror = function (message, source, lineno, colno, error) {
      this.errorHandler(error);
    };
  },
  errorHandler(error) {
    if (error.popup ?? false) NotificationService.error(error.message);
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export default errorService;
