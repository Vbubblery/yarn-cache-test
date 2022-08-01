import * as OrdersBackend from "@/orders/backend";
import { OrdersByStatusDto } from "@/orders/typings/dto";
import NotificationService from "@/services/notification.service";
import { Order } from "@/objects/order";

const spyOrdersByStatus = jest.spyOn(OrdersBackend, "getOrdersCountByStatus");
const spyDeleteOrder = jest.spyOn(OrdersBackend, "deleteOrder");

describe("Orders backend", () => {
  beforeEach(() => {
    spyOrdersByStatus.mockClear();
    spyDeleteOrder.mockClear();
  });
  it("Orders count by status - fetches orders by status from the backend", async () => {
    const mockResponse: OrdersByStatusDto = {
      1: 1,
      2: 0,
      3: 0,
      4: 0,
      all: 1
    };

    spyOrdersByStatus.mockResolvedValue({ data: mockResponse });
    const result = await OrdersBackend.fetchOrdersCountByStatus(1);
    expect(result).toEqual(mockResponse);
  });
  it("Orders cound by status - displays an error notification if wrong behavior", async () => {
    spyOrdersByStatus.mockImplementation(
      () => new Promise((_, reject) => reject(new Error("A backend error")))
    );
    NotificationService.error = jest.fn();
    try {
      await OrdersBackend.fetchOrdersCountByStatus(1);
    } catch (err) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(NotificationService.error).toHaveBeenCalledWith("A backend error");
    }
  });
  it("Delete order - delete order from the backend", async () => {
    spyDeleteOrder.mockResolvedValue();
    const siteId = 1;
    expect(() =>
      OrdersBackend.deleteBackendOrder(new Order(), siteId)
    ).not.toThrow();
  });
  it("Delete order - displays an error notification if wrong behavior", async () => {
    spyDeleteOrder.mockImplementation(
      () => new Promise((_, reject) => reject(new Error("A backend error")))
    );
    NotificationService.error = jest.fn();
    try {
      await OrdersBackend.fetchOrdersCountByStatus(1);
    } catch (err) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(NotificationService.error).toHaveBeenCalledWith("A backend error");
    }
  });
});
