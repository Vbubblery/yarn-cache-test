import axios from "axios";
import { auth } from "@/services/auth0.service";
import { store } from "@/store/store";
import Downloader from "js-file-downloader";
import NotificationService from "@/services/notification.service";
import dayjs from "dayjs";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : `https://${process.env.VUE_APP_GATEWAY}/admin-manager`;

const SupervisorService = {
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
    if (process.env.NODE_ENV === "development") {
      this.api.defaults.headers.common["email"] = process.env.VUE_APP_DEV_EMAIL;
      this.api.defaults.headers.common["permissions"] =
        process.env.VUE_APP_DEV_PERMISSIONS;
    }
  },

  removeHeader() {
    this.api.defaults.headers.common = {};
  },

  get(resource, params = {}, config) {
    return this.api.get(resource, { params, ...config });
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
  exportFile(
    sites,
    orders,
    format,
    source,
    successMessage = "",
    start,
    end,
    timebucket,
    token = ""
  ) {
    const siteIds = sites.map(s => s.key);
    const siteNames = sites.map(s => s.label);
    const siteName = siteNames.length > 1 ? "multiple-sites" : siteNames[0];
    const companyId = store.getters["common/getMe"].company.id;
    let fileName = `flowlity-${source}-${siteName}`;
    // prevent GET caching
    const seed = `&t=${new Date().getTime()}`;
    let exportURL = `/api/v1/companies/${companyId}/export?sites[]=${siteIds}&source=${source}&type=${format}${seed}&token=${token}`;
    if (start !== null) {
      exportURL += `&start=${start}`;
      fileName = `${dayjs(start).format("YYYY-MM-DD")}-` + fileName;
    } else {
      fileName = `${dayjs().format("YYYY-MM-DD")}-` + fileName;
    }
    if (end !== null) {
      exportURL += `&end=${end}`;
      fileName += `-${dayjs(end).format("YYYY-MM-DD")}`;
    }
    fileName += `.${format}`;
    if (orders !== null) exportURL += `&orders[]=${orders.map(o => o.id)}`;
    if (timebucket !== null) exportURL += `&timebucket=${timebucket}`;
    if (format === "sftp")
      return SupervisorService.get(exportURL).then(() =>
        NotificationService.success(successMessage)
      );
    let headers = [
      { name: "Authorization", value: `Bearer ${auth.accessToken}` }
    ];
    if (process.env.NODE_ENV === "development") {
      headers = [
        { name: "email", value: process.env.VUE_APP_DEV_EMAIL },
        { name: "permissions", value: process.env.VUE_APP_DEV_PERMISSIONS }
      ];
    }
    return new Downloader({
      url: `${baseURL}${exportURL}`,
      headers,
      filename: fileName,
      timeout: 120000
    }).then(() => {
      // Called when download ended
    });
  }
};

export default SupervisorService;
