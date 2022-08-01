import { store } from "@/store/store";
import SupervisorService from "@/services/supervisor.service";
import NotificationService from "@/services/notification.service";

const PartnersService = {
  async get(partnerId, params = {}) {
    const companyId = store.getters["common/getMe"].company.id;
    const { data } = await SupervisorService.get(
      `/api/v1/companies/${companyId}/partners/${partnerId}`,
      params
    );
    const { partner_site } = data;
    return partner_site;
  },
  async search({ name = null, isSupplier = false, isCustomer = false }) {
    const companyId = store.getters["common/getMe"].company.id;
    const siteId = store.getters["common/getCurrentSite"].id;
    let params = [];
    if (name) {
      const encodedPattern = encodeURIComponent(name);
      params.push(`name=${encodedPattern}`);
    }
    if (siteId) params.push(`site_id=${siteId}`);
    if (isSupplier) params.push("suppliers=true");
    if (isCustomer) params.push("customers=true");

    const { data } = await SupervisorService.get(
      `/api/v1/companies/${companyId}/partners?` + params.join("&"),
      { only: ["id", "name"] }
    );
    const { results } = data;
    return results;
  },
  async postPartnerSite(partnerData) {
    const companyId = store.getters["common/getMe"].company.id;
    await SupervisorService.post(
      `/api/v1/companies/${companyId}/partners`,
      partnerData
    )
      .then(() => NotificationService.info("Supplier has been created"))
      .catch(error => {
        NotificationService.error(error.response.data.message);
        throw error;
      });
  },
  async updatePartnerSite(partnerId, partnerData) {
    const companyId = store.getters["common/getMe"].company.id;
    await SupervisorService.put(
      `/api/v1/companies/${companyId}/partners/${partnerId}`,
      partnerData
    )
      .then(NotificationService.info("Supplier has been updated"))
      .catch(error => {
        NotificationService.error(error.response.data.message);
        throw error;
      });
  }
};

export default PartnersService;
