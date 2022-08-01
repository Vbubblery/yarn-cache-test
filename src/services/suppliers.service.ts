import SupervisorService from "./supervisor.service";
//@ts-ignore
import { store } from "@/store/store";
import { AxiosRequestConfig } from "axios";

const SuppliersService = {
  async fetchSiteProductsSuppliers(
    payload: { pattern: string; currentPage: number; perPage: number },
    requestConfig?: AxiosRequestConfig
  ) {
    const { pattern, currentPage, perPage } = payload;
    //@ts-ignore
    const siteId = store.getters["common/getCurrentSite"].id;
    //@ts-ignore
    const companyId = store.getters["common/getMe"].company.id;
    const encodedPattern = encodeURIComponent(pattern);
    const { data } = await SupervisorService.get(
      `/api/v1/companies/${companyId}/partners?site_id=${siteId}&page=${currentPage}&name=${encodedPattern}&per_page=${perPage}`,
      requestConfig
    );
    return {
      results: data.results,
      pages: data.pages,
      total: data.total
    };
  }
};
export default SuppliersService;
