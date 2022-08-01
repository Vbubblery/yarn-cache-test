import { store } from "@/store/store";
import SupervisorService from "@/services/supervisor.service";
import { Promotion } from "@/objects/promotion";

const PromotionsService = {
  fetchPromotionById: async promoId => {
    const companyId = store.getters["common/getCompany"].id;
    const { data } = await SupervisorService.get(
      `/api/v1/companies/${companyId}/promotions/${promoId}`
    );
    return Promotion.create(data.promotion);
  },
  getPromotions: async () => {
    const companyId = store.getters["common/getCompany"].id;
    const { data } = await SupervisorService.get(
      `/api/v1/companies/${companyId}/promotions`
    );
    const { results } = data;
    const promotions = results.reduce((promotions, currentPromotion) => {
      promotions[currentPromotion.id] = Promotion.create(currentPromotion);
      return promotions;
    }, {});
    return promotions;
  },
  createPromotion: async promotionData => {
    const companyId = store.getters["common/getCompany"].id;
    const { data } = await SupervisorService.post(
      `/api/v1/companies/${companyId}/promotions`,
      promotionData
    );
    const { promotion } = data;
    return Promotion.create(promotion);
  },
  updatePromotion: async (oldPromotion, updatedPromoData) => {
    const companyId = store.getters["common/getCompany"].id;
    const { data } = await SupervisorService.put(
      `/api/v1/companies/${companyId}/promotions/${oldPromotion.id}`,
      updatedPromoData
    );
    const { promotion } = data;
    return Promotion.create(promotion);
  },
  deletePromotion: async promotion => {
    const companyId = store.getters["common/getCompany"].id;
    await SupervisorService.delete(
      `/api/v1/companies/${companyId}/promotions/${promotion.id}`
    );
  }
};

export default PromotionsService;
