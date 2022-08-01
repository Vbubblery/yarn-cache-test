/* eslint-disable no-console */

import { register } from "register-service-worker";
import NotificationService from "@/services/notification.service";
if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log("Service worker is active.");
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound(registration) {
      registration.installing;
      console.log("New content is downloading.");
    },
    updated() {
      NotificationService.info(
        "New content is available; please refresh your page."
      );
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    }
  });
}
