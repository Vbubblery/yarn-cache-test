import { AxiosRequestConfig } from "axios";
import TagsService from "@/services/tags.service";
import {
  IAlertCriticality,
  IConfig,
  IFetchParams,
  IProduct,
  IProductSupplier,
  ITag
} from "@/forecasts-review/typings";
import AlertApiService from "@/services/alerts.api.service";
import ProductsService from "@/services/products.service";
import PartnersService from "@/services/partners.service";
import SuppliersService from "@/services/suppliers.service";

export const fetchProducts = async (
  productSetting: IConfig,
  selectedCriticalities: Array<IAlertCriticality> | null,
  selectedProductsFiltersTags: ITag[],
  selectedSuppliers: IProductSupplier[],
  selectedCustomerId: number | null
) => {
  try {
    const pattern = productSetting.searchText;
    const tagIds = selectedProductsFiltersTags?.map(tag => tag.id);
    const suppliersIds = selectedSuppliers?.map(supplier => supplier.id);
    const alertCriticalities = selectedCriticalities?.map(status => status.id);
    const customerId = selectedCustomerId;
    const {
      results,
      pages,
      total
    }: {
      results: Array<IProduct>;
      pages: number;
      total: number;
    } = await ProductsService.fetchProducts({
      pattern,
      currentPage: productSetting.currentPage,
      perPage: productSetting.itemsPerPage,
      productTagsIds: tagIds,
      productSuppliersIds: suppliersIds,
      alertCriticalities,
      customerId
    });
    return {
      res: Object.values(results),
      pages,
      total
    };
  } catch {
    throw new Error("Error during the fetch of the products");
  }
};

export const fetchTags = async (
  config: Partial<IConfig>,
  requestConfig?: AxiosRequestConfig
) => {
  const pattern = config.searchText;
  const {
    results: res,
    pages,
    total
  } = await TagsService.fetchTags(
    {
      pattern,
      currentPage: pattern ? 1 : config.currentPage,
      perPage: config.itemsPerPage
    },
    requestConfig
  );
  return { res, pages, total };
};

export const fetchProductsSuppliers = async (
  productSetting: IFetchParams,
  requestConfig?: AxiosRequestConfig
) => {
  try {
    const pattern = productSetting.searchText;
    const {
      results,
      pages,
      total
    }: {
      results: Array<{ id: string; name: string }>;
      pages: number;
      total: number;
    } = await SuppliersService.fetchSiteProductsSuppliers(
      {
        pattern,
        currentPage: productSetting.currentPage,
        perPage: productSetting.itemsPerPage
      },
      requestConfig
    );
    return {
      res: Object.values(results),
      pages,
      total
    };
  } catch {
    throw new Error("Error during the fetch of the products");
  }
};
export const fetchProductCountPerAlertCriticality = async () => {
  const { data } = await AlertApiService.fetchProductCountPerAlertCriticality();

  const { productCountPerAlertCriticality } = data;
  return productCountPerAlertCriticality;
};

export const fetchCustomers = async () => {
  return PartnersService.search({
    isCustomer: true
  });
};
