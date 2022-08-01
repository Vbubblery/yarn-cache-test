import { store } from "@/store/store";
import SupervisorService from "@/services/supervisor.service";
import { Product } from "@/objects/product";

const ProductsService = {
  async getSiteProductById(productId, params = {}) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.get(
      `/api/v1/sites/${siteId}/products/${productId}`,
      params
    );
    const { product_site } = data;
    return Product.create(product_site);
  },
  async createProduct(product) {
    const siteId = store.getters["common/getCurrentSite"].id;
    let supplierLinks = product.productSupplierLinks;

    // create product without links
    product.productSupplierLinks = undefined;
    await SupervisorService.post(
      `/api/v1/sites/${siteId}/products`,
      product.dump()
    );
    product.productSupplierLinks = supplierLinks;

    if (supplierLinks.length) {
      supplierLinks = (supplierLinks || []).map(link => {
        link.product = product.id;
        return Product.dumpSupplierLink(link);
      });
      await this.postProductSupplierLinks(supplierLinks);
    }
    return product;
  },
  async updateProduct(product) {
    const siteId = store.getters["common/getCurrentSite"].id;
    let supplierLinksToUpdate = product.productSupplierLinks.filter(l =>
      l.hasOwnProperty("id")
    );
    let supplierLinksToCreate = product.productSupplierLinks.filter(
      l => !l.hasOwnProperty("id")
    );
    // update product without links
    product.productSupplierLinks = supplierLinksToUpdate;
    await SupervisorService.put(
      `/api/v1/sites/${siteId}/products/${product.id}`,
      product.dump()
    );
    product.productSupplierLinks = supplierLinksToUpdate.concat(
      supplierLinksToCreate
    );

    if (supplierLinksToUpdate.length) {
      await (supplierLinksToUpdate || []).map(link => {
        link.product = product.id;
        this.updateProductSupplierLink(link.id, Product.dumpSupplierLink(link));
      });
    }
    if (supplierLinksToCreate.length) {
      supplierLinksToCreate = (supplierLinksToCreate || []).map(link => {
        link.product = product.id;
        return Product.dumpSupplierLink(link);
      });
      await this.postProductSupplierLinks(supplierLinksToCreate);
    }
    return product;
  },
  async updateProductIsDefaultUnit(productId, isDefaultUnit) {
    const siteId = store.getters["common/getCurrentSite"].id;
    await SupervisorService.put(
      `/api/v1/sites/${siteId}/products/${productId}`,
      {
        is_default_unit: isDefaultUnit
      }
    );
  },
  async deleteProduct(product) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const res = await SupervisorService.delete(
      `/api/v1/sites/${siteId}/products/${product.id}`
    );
    return res;
  },
  async postProductSupplierLinks(linksData) {
    const companyId = store.getters["common/getMe"].company.id;
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.post(
      `/api/v1/companies/${companyId}/sites/${siteId}/psl`,
      linksData
    );
    return data.productSupplierLink;
  },
  async updateProductSupplierLink(linkId, linkData) {
    const companyId = store.getters["common/getMe"].company.id;
    const siteId = store.getters["common/getCurrentSite"].id;
    await SupervisorService.put(
      `/api/v1/companies/${companyId}/sites/${siteId}/psl/${linkId}`,
      linkData
    );
  },
  async deleteProductSupplierLink(linkId) {
    const companyId = store.getters["common/getMe"].company.id;
    const siteId = store.getters["common/getCurrentSite"].id;
    await SupervisorService.delete(
      `/api/v1/companies/${companyId}/sites/${siteId}/psl/${linkId}`
    );
  },
  async fetchProducts(payload, params = {}) {
    let {
      pattern,
      customerId,
      promotionId,
      withSuppliers,
      currentPage,
      supplierId,
      perPage,
      tagIds,
      productTagsIds,
      productSuppliersIds,
      alertCriticalities
    } = payload;
    pattern = pattern || "";
    customerId = customerId || "";
    promotionId = promotionId || "";
    withSuppliers = withSuppliers || "";
    supplierId = supplierId || "";
    perPage = perPage || 50;
    currentPage = currentPage || 1;
    tagIds = tagIds
      ? tagIds.reduce((acc, curr) => {
          acc += `&tag_ids[]=${curr}`;
          return acc;
        }, "")
      : "";
    productSuppliersIds = productSuppliersIds
      ? productSuppliersIds.reduce((acc, curr) => {
          acc += `&product_suppliers_ids[]=${curr}`;
          return acc;
        }, "")
      : "";
    productTagsIds = productTagsIds
      ? productTagsIds.reduce((acc, curr) => {
          acc += `&product_tags_ids[]=${curr}`;
          return acc;
        }, "")
      : "";
    alertCriticalities = alertCriticalities
      ? alertCriticalities.reduce((acc, curr) => {
          acc += `&alert_criticalities[]=${curr}`;
          return acc;
        }, "")
      : "";
    const siteId = store.getters["common/getCurrentSite"].id;
    const encodedPattern = encodeURIComponent(pattern);
    const { data } = await SupervisorService.get(
      `/api/v1/sites/${siteId}/products?page=${currentPage}&search=${encodedPattern}&customer_id=${customerId}&with_suppliers=${withSuppliers}&supplier_id=${supplierId}&promotion_id=${promotionId}&per_page=${perPage}${tagIds}${productTagsIds}${productSuppliersIds}${alertCriticalities}`,
      params
    );
    const { results, pages, total } = data;
    return payload?.currentPage ? { results, pages, total } : results;
  },
  async updateFixingRecoDate(productId, params = {}) {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.put(
      `/api/v1/sites/${siteId}/products/${productId}/fixing_recommendations_date`,
      params
    );
    return data;
  }
};

export default ProductsService;
