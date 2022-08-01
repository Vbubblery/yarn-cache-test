import { i18n } from "@/i18n/i18n@next";
import { IFetchParams, IProductSupplier } from "@/forecasts-review/typings";
import { ref, computed } from "@vue/composition-api";
import { fetchProductsSuppliers } from "@/forecasts-review/composables/data";
import { debounce } from "@/helper/debounceHelper";
import { AxiosRequestConfig, CanceledError } from "axios";
const selectedSuppliers = ref<IProductSupplier[]>([]);
const searchTextSuppliers = ref<string>("");

const fetchSuppliers = async (
  config: IFetchParams,
  requestConfig?: AxiosRequestConfig
) => {
  const { res, pages, total } = await fetchProductsSuppliers(
    {
      searchText: config.searchText,
      currentPage: config.searchText ? 1 : config.currentPage || 1,
      itemsPerPage: config.itemsPerPage
    },
    requestConfig
  );
  return { res, pages, total };
};
export const useProductsSuppliers = () => {
  const suppliersList = ref<Array<IProductSupplier>>([]);
  const currentPageSuppliers = ref<number>(1);
  let pages: number = Infinity;
  const hasMoreSuppliers = ref<boolean>(true);
  const suppliersCount = ref<number>(0);
  const suppliersAreLoading = ref<boolean>(false);
  let abortController: AbortController | null = null;

  const getDropdownProductsSuppliers = async () => {
    if (!hasMoreSuppliers.value) {
      return;
    }
    suppliersAreLoading.value = true;
    abortController = new AbortController();
    try {
      const {
        res,
        pages: _pages,
        total: _total
      } = await fetchSuppliers(
        {
          searchText: searchTextSuppliers.value,
          currentPage: currentPageSuppliers.value,
          itemsPerPage: 50
        },
        {
          signal: abortController.signal
        }
      );
      suppliersList.value =
        currentPageSuppliers.value === 1
          ? [...res]
          : [...suppliersList.value, ...res];
      pages = _pages;
      hasMoreSuppliers.value = currentPageSuppliers.value < pages;
      suppliersCount.value = _total;
      suppliersAreLoading.value = false;
    } catch (e) {
      // miss request cancellation error; others – rethrow
      if (!(e instanceof CanceledError)) {
        throw e;
      }
    }
  };

  const supplierTitle = computed(() => {
    const selectedSuppliersCount = selectedSuppliers.value.length;
    const supplierName =
      selectedSuppliersCount === 1
        ? i18n.tc("forecastsReview.suppliers", 1) +
          `: ${selectedSuppliers.value[0].name}`
        : i18n.tc("selectedSuppliers", selectedSuppliersCount);
    return selectedSuppliersCount > 0
      ? supplierName
      : i18n.tc("forecastsReview.suppliers", 0);
  });

  const fetchSuppliersWithDebounce = debounce(async () => {
    await getDropdownProductsSuppliers();
  });

  const resetProductsSuppliersState = () => {
    // abort previous fetch request to prevent race condition
    abortController?.abort();
    hasMoreSuppliers.value = true;
    pages = Infinity;
    suppliersList.value.splice(0, suppliersList.value.length);
    currentPageSuppliers.value = 1;
  };

  const iteratePageSuppliers = () => {
    if (suppliersAreLoading.value || !hasMoreSuppliers.value) {
      return;
    }
    currentPageSuppliers.value++;
  };

  const deselectAllSuppliers = () => {
    selectedSuppliers.value = [];
  };

  return {
    suppliersList,
    selectedSuppliers,
    searchTextSuppliers,
    hasMoreSuppliers,
    suppliersAreLoading,
    currentPageSuppliers,
    suppliersCount,
    supplierTitle,
    fetchSuppliers,
    getDropdownProductsSuppliers,
    deselectAllSuppliers,
    resetProductsSuppliersState,
    fetchSuppliersWithDebounce,
    iteratePageSuppliers
  };
};
