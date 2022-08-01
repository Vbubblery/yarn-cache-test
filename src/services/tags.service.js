import SupervisorService from "@/services/supervisor.service";
import { Tag } from "@/objects/tag";
import { store } from "@/store/store";

const TagsService = {
  fetchTagById: async (tagId, params = {}) => {
    const companyId = store.getters["common/getMe"].company.id;
    const { data } = await SupervisorService.get(
      `/api/v1/companies/${companyId}/tags/${tagId}`,
      params
    );
    return Tag.create(data.tag);
  },
  fetchTagsByProductSiteId: async productSiteId => {
    const companyId = store.getters["common/getMe"].company.id;
    const { data } = await SupervisorService.get(
      `/api/v1/companies/${companyId}/tags?product_site_id=${productSiteId}`
    );
    return data;
  },
  fetchTags: async (payload, requestConfig) => {
    let {
      pattern,
      isAllCompanyTags,
      isTagGrouper,
      currentPage,
      productSiteId,
      perPage
    } = payload;
    pattern = pattern || "";
    isAllCompanyTags = isAllCompanyTags || false;
    isTagGrouper = isTagGrouper || false;
    perPage = perPage || 50;
    currentPage = currentPage || 1;
    const companyId = store.getters["common/getMe"].company.id;
    const siteId = isAllCompanyTags
      ? ""
      : store.getters["common/getCurrentSite"].id;
    const tagsIds = payload.tagsIds ? `&tags_ids=${payload.tagsIds}` : "";
    const encodedPattern = encodeURIComponent(pattern);
    const { data } = await SupervisorService.get(
      `/api/v1/companies/${companyId}/tags?${tagsIds}`,
      {
        site_id: siteId,
        name: encodedPattern,
        tag_ids: payload.tagsIds ?? [],
        is_tag_grouper: isTagGrouper,
        page: currentPage,
        per_page: perPage,
        ...(productSiteId && { product_site_id: productSiteId })
      },
      requestConfig
    );
    const { results, pages, total } = data;
    if (isAllCompanyTags) {
      const tags = results.reduce((tags, currentTag) => {
        tags[currentTag.id] = Tag.create(currentTag);
        return tags;
      }, {});
      return tags;
    }
    return payload?.currentPage ? { results, pages, total } : results;
  },
  fetchProductsForTagBySite: async (
    tagId,
    alreadyRelated,
    pattern,
    perPage = 50,
    params = {}
  ) => {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.get(
      `/api/v1/sites/${siteId}/products?tag_assigned=${alreadyRelated}&tag_ids[]=${tagId}&search=${pattern}&per_page=${perPage}`,
      params
    );
    const { results } = data;
    return results;
  },
  createTag: async tagData => {
    const companyId = store.getters["common/getMe"].company.id;
    await SupervisorService.post(
      `/api/v1/companies/${companyId}/tags`,
      tagData
    );
  },
  updateTag: async (oldTag, updatedTagData) => {
    const companyId = store.getters["common/getMe"].company.id;
    await SupervisorService.put(
      `/api/v1/companies/${companyId}/tags/${oldTag.id}`,
      updatedTagData
    );
  },
  deleteTag: async tag => {
    const companyId = store.getters["common/getMe"].company.id;
    await SupervisorService.delete(
      `/api/v1/companies/${companyId}/tags/${tag.id}`
    );
  },
  fetchTagsReport: tag_id => {
    const siteId = store.getters["common/getCurrentSite"].id;
    // todo later: decide if we keep only one tag at a time or we push toward multi tags
    // with propper products intersection => update the backend accordingly
    return SupervisorService.get(`/api/v1/sites/${siteId}/dashboard/tags`, {
      tags: [tag_id]
    });
  }
};

export default TagsService;
