import company from "./modules/company";
import site from "./modules/site";
import products from "./modules/products";
import user from "./modules/user";
import tags from "./modules/tags";
import storageSites from "./modules/storageSites";

const namespaced = true;

const modules = {
  company,
  site,
  products,
  user,
  tags,
  storageSites
};

export default {
  namespaced,
  modules
};
