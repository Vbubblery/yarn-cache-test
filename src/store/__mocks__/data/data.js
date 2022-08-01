import data from "./modules/data";
import selectedOptions from "./modules/selectedOptions";
import submittedOptions from "./modules/submittedOptions";

const namespaced = true;

const modules = {
  data,
  selectedOptions,
  submittedOptions
};

export default {
  namespaced,
  modules
};
