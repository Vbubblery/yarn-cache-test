import demandData from "./modules/demandData";
import selectedOptions from "./modules/selectedOptions";
import submittedOptions from "./modules/submittedOptions";

const namespaced = true;

const modules = {
  demandData,
  selectedOptions,
  submittedOptions
};

export default {
  namespaced,
  modules
};
