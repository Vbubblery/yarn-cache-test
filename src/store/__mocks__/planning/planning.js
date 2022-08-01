import planningData from "./modules/planningData";
import selectedOptions from "./modules/selectedOptions";
import submittedOptions from "./modules/submittedOptions";

const namespaced = true;

const modules = {
  planningData,
  selectedOptions,
  submittedOptions
};

export default {
  namespaced,
  modules
};
