import type { Order } from "@/objects/order";
import { Site } from "@/objects/site";
import NotificationService from "@/services/notification.service";
import SupervisorService from "@/services/supervisor.service";

export const sendOrdersToApi = async (
  site: Site,
  orders: Partial<Order>[],
  token: string
) => {
  try {
    await SupervisorService.exportFile(
      [{ key: site.id, label: site.name }],
      orders,
      "api",
      site.isSupplierView ? "salesOrders" : "purchaseOrders",
      "",
      null,
      null,
      null,
      token
    );
  } catch (err) {
    if (err instanceof Error) {
      NotificationService.error(err.message);
      throw err;
    }
  }
};
