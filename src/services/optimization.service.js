import axios from "axios";
import { auth } from "@/services/auth0.service";
import { store } from "@/store/store";
import NotificationService from "@/services/notification.service";

export const baseURL =
  "https://" + process.env.VUE_APP_GATEWAY + "/or-webservice";

const OptimizationService = {
  api: null,
  _401interceptor: null,
  _loggedOutInterceptor: null,

  init() {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        common: {}
      }
    });
  },

  setHeader() {
    this.api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${auth.accessToken}`;
  },

  post(resource, data) {
    return this.api.post(resource, data);
  },

  // TODO: customize this part depending on the new authentication mechanism
  mount401Interceptor() {
    this._401interceptor = this.api.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        if (error.request.status == 401) {
          error.message =
            "Your session has expired. Please log in again to continue.";
          store.dispatch("common/logout");
          NotificationService.error(error.message);
        }
        return Promise.reject(error);
      }
    );
  },

  mountLoggedOutInterceptor() {
    this._loggedOutInterceptor = this.api.interceptors.request.use(
      request => {
        const loggedIn = auth.accessToken;
        if (loggedIn) {
          return request;
        }
      },
      error => {
        return Promise.reject(error);
      }
    );
  },

  unmount401Interceptor() {
    this.api.interceptors.response.eject(this._401interceptor);
  },
  unmountLoggedOutInterceptor() {
    this.api.interceptors.request.eject(this._loggedOutInterceptor);
  }
};

export default OptimizationService;
