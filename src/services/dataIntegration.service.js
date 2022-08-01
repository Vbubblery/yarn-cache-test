import axios from "axios";

const baseURL = process.env.VUE_APP_INTEGRATION_URL;
const filename = process.env.VUE_APP_INTEGRATION_FILENAME;

const DataIntegrationService = {
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
  initData(companyName) {
    return this.api.post("", {
      company: companyName,
      file_name: filename
    });
  }
};

export default DataIntegrationService;
