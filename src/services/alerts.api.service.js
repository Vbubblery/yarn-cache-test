import axios from "axios";
import NotificationService from "@/services/notification.service";
import SupervisorService from "./supervisor.service";
import { auth } from "@/services/auth0.service";
import { store } from "@/store/store";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : `https://${process.env.VUE_APP_GATEWAY}/admin-manager`;

const AlertApiService = {
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
    this.api.defaults.headers.common["Content-Type"] = "application/json";
    this.api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${auth.accessToken}`;
    if (process.env.NODE_ENV === "development") {
      this.api.defaults.headers.common["email"] = process.env.VUE_APP_DEV_EMAIL;
      this.api.defaults.headers.common["permissions"] =
        process.env.VUE_APP_DEV_PERMISSIONS;
    }
  },

  removeHeader() {
    this.api.defaults.headers.common = {};
  },

  get(resource, params = {}) {
    return this.api.get(resource, { params });
  },

  post(resource, data, params = {}) {
    return this.api.post(resource, data, { params });
  },

  put(resource, data, params = {}) {
    return this.api.put(resource, data, { params });
  },

  delete(resource) {
    return this.api.delete(resource);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return this.api(data);
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
  },
  computingAlerts({ productSiteIds = null }) {
    const siteId = store.getters["common/getCurrentSite"].id;
    return this.api?.post(`/api/v1/sites/${siteId}/alerts/compute_alerts`, {
      site_id: siteId,
      product_site_ids: productSiteIds
    });
  },
  getDataJobStatus(siteId) {
    return SupervisorService.get(`/api/v1/sites/${siteId}/data_job_status`);
  },
  fetchProductCountPerAlertCriticality() {
    const siteId = store.getters["common/getCurrentSite"].id;
    return this.api?.get(
      `/api/v1/sites/${siteId}/alerts/product_count_per_alert_criticality`
    );
  }
};

export default AlertApiService;
