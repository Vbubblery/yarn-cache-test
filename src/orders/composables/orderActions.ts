import { i18n } from "@/i18n/i18n@next";
import { Order } from "@/objects/order";
import { Site } from "@/objects/site";
import NotificationService from "@/services/notification.service";
import { Ref, SetupContext } from "@vue/composition-api";
import {
  fetchOrdersCountByStatus,
  updateOrderStatus,
  deleteOrder as _deleteOrder
} from "../backend";
import { ORDER_TYPE_VALUE } from "../constants";
import { useOrdersSearch } from "./ordersSearch";

export const useOrderActions = (
  context: SetupContext,
  order: Ref<Order>,
  currentSite: Ref<Site>
) => {
  const refetchOrdersStatus = async () => {
    const { updateOrdersByStatusCount } = useOrdersSearch();
    const ordersByStatus = await fetchOrdersCountByStatus(currentSite.value.id);
    if (ordersByStatus) updateOrdersByStatusCount(ordersByStatus);
  };

  const acceptCurrentOrder = async (reload: boolean = true) => {
    try {
      await updateOrderStatus(
        {
          id: order.value.id,
          statusId: ORDER_TYPE_VALUE.VALIDATED
        },
        currentSite.value.id
      );
      await refetchOrdersStatus();
      if (reload) context.emit("reload:page");
      NotificationService.success(i18n.t("orders.updateSuccess"));
    } catch (error) {
      NotificationService.error(i18n.t("orders.updateError"));
      throw error;
    }
  };

  const discardCurrentOrder = async (reload: boolean = true) => {
    try {
      await updateOrderStatus(
        {
          id: order.value.id,
          statusId: ORDER_TYPE_VALUE.PLANNED
        },
        currentSite.value.id
      );
      await refetchOrdersStatus();
      if (reload) context.emit("reload:page");
      NotificationService.success(i18n.t("orders.updateSuccess"));
    } catch (error) {
      NotificationService.error(i18n.t("orders.updateError"));
      throw error;
    }
  };

  const deleteOrder = async (reload: boolean = true) => {
    try {
      await _deleteOrder({ id: order.value.id }, currentSite.value.id);
      if (reload) context.emit("reload:page");
      NotificationService.success(i18n.t("orders.deleteSuccess"));
    } catch (error) {
      NotificationService.error(i18n.t("orders.deleteOrderError"));
      throw error;
    }
  };

  return { acceptCurrentOrder, discardCurrentOrder, deleteOrder };
};
