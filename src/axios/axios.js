import axios from "axios";
import { store } from "@/store/store";
import { auth } from "@/services/auth0.service";

axios.interceptors.request.use(
  config => {
    config.headers["Content-Type"] = "application/json";
    const token = auth.user.email;
    if (token) config.headers.email = token;
    const site = store.getters["common/getCurrentSite"];
    const company = store.getters["common/getCompany"];
    config.params = {};
    if (site) config.params.site = site.id;
    if (company) config.params.company = company.id;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
