import alerts from "./modules/alerts";
import dataJobsAlerts from "./modules/dataJobsAlerts";
import products from "./modules/products";
import tags from "./modules/tags";

const namespaced = true;

const modules = {
  alerts,
  dataJobsAlerts,
  products,
  tags
};

export default {
  namespaced,
  modules
};
