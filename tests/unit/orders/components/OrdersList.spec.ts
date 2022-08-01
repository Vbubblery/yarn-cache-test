import { renderComponent } from "tests/test-utils";
import OrdersList from "@/orders/components/OrdersList.vue";
// eslint-disable-next-line jest/no-mocks-import
import { store } from "@/store/__mocks__/store";
import { fireEvent, waitFor } from "@testing-library/vue";
import { useOrdersSearch } from "@/orders/composables";
import * as OrdersBackend from "@/orders/backend";
import SupervisorService from "@/services/supervisor.service";
import { Order } from "@/objects/order";
import OrderService from "@/services/order.service";
import MockDate from "mockdate";
jest.spyOn(OrdersBackend, "deleteBackendOrder");
const fetchOrders = jest.spyOn(SupervisorService, "get");
const downloadOrdersSpy = jest.spyOn(SupervisorService, "exportFile");
const spyDeleteOrder = jest.spyOn(OrderService, "deleteOrders");

describe("Orders List", () => {
  // Avoid rendering the order line item with an undefined order type
  beforeAll(() => {
    const { updateOrderType } = useOrdersSearch();
    updateOrderType(1);
  });
  beforeEach(() => {
    fetchOrders.mockClear();
    downloadOrdersSpy.mockClear();
  });
  it("renders the orders' list with the right number of orders", async () => {
    const receivedOrders = Array.from({ length: 5 }, (_, i) => ({ id: i }));
    fetchOrders.mockResolvedValue({
      data: {
        results: receivedOrders
      }
    });
    const { html, findAllByTestId } = renderComponent(OrdersList, {}, () => ({
      store
    }));
    expect(html()).toMatchSnapshot();
    const renderedOrders = await findAllByTestId(/^order_line_item/);
    expect(renderedOrders.length).toEqual(receivedOrders.length);
  });
  it("renders the orders' list with the empty orders", async () => {
    const receivedOrders = [] as { id: string }[];
    fetchOrders.mockResolvedValue({
      data: {
        results: receivedOrders
      }
    });
    const { findAllByTestId, findByTestId } = renderComponent(
      OrdersList,
      {},
      () => ({
        store
      })
    );
    await expect(findAllByTestId(/^order_line_item/)).rejects.toBeTruthy();
    await expect(findByTestId(/^orders_no_data/)).resolves.toBeTruthy();
  });
  it("changes the sorting of the orders when clicking on the sort button", async () => {
    fetchOrders.mockResolvedValue({
      data: {
        results: []
      }
    });
    const { findByTestId } = renderComponent(OrdersList, {}, () => ({ store }));
    const sortButton = await findByTestId(/change_sort_button/);
    await fireEvent.click(sortButton);
    expect(fetchOrders).toHaveBeenCalledWith("/api/v1/sites/1/orders", {
      filter: 1,
      keyword_search: "",
      page: 1,
      per_page: 10,
      sort: { field: "send_before", order: "asc" },
      suppliers_ids: []
    });
  });
  it("displays action buttons when an order is selected", async () => {
    fetchOrders.mockResolvedValue({
      data: {
        results: [{ id: 1 }]
      }
    });
    const { getByTestId } = renderComponent(OrdersList, {}, () => ({
      store
    }));
    // We should wait until the component fetches the data and displays it
    await waitFor(async () => {
      const checkbox = getByTestId(/select_all_orders_checkbox/);
      await fireEvent.click(checkbox);
      expect(getByTestId(/selected_orders_actions/)).toBeTruthy();
    });
  });
  it("triggers the expected actions when the action buttons are clicked", async () => {
    MockDate.set(new Date("2021-01-01T10:00:00Z"));
    downloadOrdersSpy.mockResolvedValue(undefined);
    fetchOrders.mockResolvedValue({
      data: {
        results: [{ id: 1 }]
      }
    });
    const { getByTestId } = renderComponent(OrdersList, {}, () => ({
      store
    }));
    const exportedOrder = new Order({ id: 1 });
    OrderService.updateOrderLatestDate(exportedOrder);
    await waitFor(async () => {
      const checkbox = getByTestId(/select_all_orders_checkbox/);
      await fireEvent.click(checkbox);
      await fireEvent.click(getByTestId(/download_exports_orders_page/));
    });
    expect(downloadOrdersSpy).toHaveBeenCalledWith(
      [{ key: 1, label: "FlowlitySite" }],
      [exportedOrder],
      "csv",
      "purchaseOrders",
      "",
      null,
      null,
      null
    );
    MockDate.reset();
  });
  it("should display the correct action for validate orders", async () => {
    fetchOrders.mockResolvedValue({
      data: {
        results: [{ id: 1 }]
      }
    });
    const { getByTestId } = renderComponent(OrdersList, {}, () => ({
      store
    }));
    await waitFor(async () => {
      const checkbox = getByTestId(/select_all_orders_checkbox/);
      await fireEvent.click(checkbox);
      expect(getByTestId(/order_confirm_button/)).toBeTruthy();
    });
  });

  it("should be able to delete selected orders", async () => {
    fetchOrders
      .mockResolvedValue({
        data: {
          results: []
        }
      })
      .mockResolvedValueOnce({
        data: {
          results: [{ id: "xxxx1" }]
        }
      });
    spyDeleteOrder.mockResolvedValue();
    const { getByTestId, getByText, findByTestId } = renderComponent(
      OrdersList,
      {},
      () => ({
        store
      })
    );
    await waitFor(async () => {
      const checkbox = getByTestId(/select_all_orders_checkbox/);
      await fireEvent.click(checkbox);
      const dropdown = getByTestId(/select_all_orders_dropdown/);
      await fireEvent.click(dropdown);
      const deleteButton = getByTestId(/select_dropdown_delete/);
      await fireEvent.click(deleteButton);
      const confirmButton = getByText("deleteWarningConfirmButton");
      await fireEvent.click(confirmButton);
    });

    await expect(findByTestId(/^orders_no_data/)).resolves.toBeTruthy();
  });
});
