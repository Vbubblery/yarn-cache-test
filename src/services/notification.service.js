import { notification } from "ant-design-vue";
import { i18n } from "@/i18n/i18n@next";

const NotificationService = {
  info(message) {
    notification["info"]({
      message: "Info",
      description: message
    });
  },
  success(message) {
    notification["success"]({
      message: i18n.t("notification.success"),
      description: message
    });
  },
  error(message) {
    notification["error"]({
      message: i18n.t("notification.error"),
      description: message
    });
  }
};

export default NotificationService;
