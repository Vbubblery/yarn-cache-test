import { SetupContext, ref } from "@vue/composition-api";
import { fetchCustomers } from "@/forecasts-review/composables/data";
import { ICustomer } from "@/forecasts-review/typings";
import { useBaseResources } from "@/forecasts-review/store";

const customers = ref<ICustomer[] | null>(null);
const selectedCustomer = ref<ICustomer | null>(null);

export const useForecastsReviewCustomers = (context: SetupContext) => {
  const { updateSelectedCustomerSiteId } = useBaseResources(context);

  const getCustomers = async () => {
    customers.value = await fetchCustomers();
  };

  const initCustomers = async () => {
    await getCustomers();
    if (selectedCustomer.value === null) {
      updateSelectedCustomerSiteId(customers?.value?.[0]?.id ?? null);
      selectedCustomer.value = customers?.value?.[0] ?? null;
    }
  };

  return {
    customers,
    selectedCustomer,
    getCustomers,
    initCustomers
  };
};
