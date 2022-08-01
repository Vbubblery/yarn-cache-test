import SupervisorService from "@/services/supervisor.service";

const StorageSitesService = {
  async fetchCurrentStorageSites(currentSiteId, params = {}) {
    const { data } = await SupervisorService.get(
      `/api/v1/sites/${currentSiteId}/storage_sites`,
      params
    );
    const { results } = data;
    return results;
  }
};

export default StorageSitesService;
