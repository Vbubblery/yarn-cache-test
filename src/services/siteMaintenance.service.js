import { store } from "@/store/store";
import SupervisorService from "@/services/supervisor.service";
import { SiteMaintenance } from "@/objects/siteMaintenance";

const SiteMaintenancesService = {
  fetchSiteMaintenanceById: async maintenanceId => {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.get(
      `/api/v1/sites/${siteId}/maintenances/${maintenanceId}`
    );
    return SiteMaintenance.create(data.maintenance);
  },
  getSiteMaintenances: async () => {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.get(
      `/api/v1/sites/${siteId}/maintenances`
    );
    const { results } = data;
    const maintenances = results.reduce(
      (maintenances, currentSiteMaintenance) => {
        maintenances[currentSiteMaintenance.id] = SiteMaintenance.create(
          currentSiteMaintenance
        );
        return maintenances;
      },
      {}
    );
    return maintenances;
  },
  createSiteMaintenance: async maintenanceData => {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.post(
      `/api/v1/sites/${siteId}/maintenances`,
      maintenanceData
    );
    const { maintenance } = data;
    return SiteMaintenance.create(maintenance);
  },
  updateSiteMaintenance: async (oldSiteMaintenance, updatedMaintenanceData) => {
    const siteId = store.getters["common/getCurrentSite"].id;
    const { data } = await SupervisorService.put(
      `/api/v1/sites/${siteId}/maintenances/${oldSiteMaintenance.id}`,
      updatedMaintenanceData
    );
    const { maintenance } = data;
    return SiteMaintenance.create(maintenance);
  },
  deleteSiteMaintenance: async maintenance => {
    const siteId = store.getters["common/getCurrentSite"].id;
    await SupervisorService.delete(
      `/api/v1/sites/${siteId}/maintenances/${maintenance.id}`
    );
  }
};

export default SiteMaintenancesService;
