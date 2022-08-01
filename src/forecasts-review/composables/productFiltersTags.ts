import { i18n } from "@/i18n/i18n@next";
import { ITag } from "@/forecasts-review/typings";
import { ref, computed } from "@vue/composition-api";
import { fetchTags } from "@/forecasts-review/composables/data";
import { debounce } from "@/helper/debounceHelper";
import { CanceledError } from "axios";

const selectedProductsFiltersTags = ref<ITag[]>([]);
const searchTextTags = ref<string>("");

export const useProductsFiltersTags = () => {
  const tags = ref<Array<ITag>>([]);
  const currentPageTags = ref<number>(1);
  let pages: number = Infinity;
  const hasMoreTags = ref<boolean>(true);
  const tagsCount = ref<number>(0);
  const tagsAreLoading = ref<boolean>(false);
  let abortController: AbortController | null = null;

  const tagDropdownSubTitle = computed(() => {
    const selectedTagsCount = selectedProductsFiltersTags.value.length;
    if (selectedTagsCount === 0) return i18n.tc("forecastsReview.tags");
    if (selectedTagsCount === 1) {
      return (
        i18n.tc("forecastsReview.tag") +
        `: ${selectedProductsFiltersTags.value?.[0].name ?? ""}`
      );
    }
    return i18n.tc(
      "productSearch.selectedProductsFiltersTags",
      selectedTagsCount
    );
  });

  const getDropdownTags = async () => {
    if (!hasMoreTags.value) {
      return;
    }
    tagsAreLoading.value = true;
    abortController = new AbortController();

    try {
      const {
        res,
        pages: _pages,
        total: _total
      } = await fetchTags(
        {
          searchText: searchTextTags.value,
          currentPage: currentPageTags.value,
          itemsPerPage: 100
        },
        {
          signal: abortController.signal
        }
      );
      tags.value =
        currentPageTags.value === 1 ? [...res] : [...tags.value, ...res];
      pages = _pages;
      hasMoreTags.value = currentPageTags.value < pages;
      tagsCount.value = _total;
      tagsAreLoading.value = false;
    } catch (e) {
      // miss request cancellation error; others – rethrow
      if (!(e instanceof CanceledError)) {
        throw e;
      }
    }
  };

  const fetchTagsWithDebounce = debounce(async () => {
    await getDropdownTags();
  });

  const resetTagsState = () => {
    // abort previous fetch request to prevent race condition
    abortController?.abort();
    hasMoreTags.value = true;
    pages = Infinity;
    tags.value.splice(0, tags.value.length);
    currentPageTags.value = 1;
  };

  const iteratePageTags = () => {
    if (tagsAreLoading.value || !hasMoreTags.value) {
      return;
    }
    currentPageTags.value++;
  };

  const selectTagProducts = (selectedTags: Array<ITag>) => {
    selectedProductsFiltersTags.value = selectedTags;
  };

  const deselectAllProductsFiltersTags = () => {
    selectedProductsFiltersTags.value = [];
  };

  return {
    currentPageTags,
    tagsAreLoading,
    tagDropdownSubTitle,
    hasMoreTags,
    tags,
    searchTextTags,
    selectedProductsFiltersTags,
    tagsCount,
    deselectAllProductsFiltersTags,
    getDropdownTags,
    fetchTagsWithDebounce,
    iteratePageTags,
    resetTagsState,
    selectTagProducts
  };
};
