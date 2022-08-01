import { Site } from "@/objects/site";
import { ORDER_TYPE_VALUE } from "@/orders/constants";
import OrdersPage from "@/orders/OrdersPage.vue";
// eslint-disable-next-line jest/no-mocks-import
import { store } from "@/store/__mocks__/store";
import { renderComponent } from "tests/test-utils";
import { useOrdersSearch } from "@/orders/composables";
import * as OrdersBackend from "@/orders/backend";
import SupervisorService from "@/services/supervisor.service";
import { fireEvent } from "@testing-library/vue";
jest.spyOn(OrdersBackend, "fetchOrdersCountByStatus").mockResolvedValue({
  all: 1,
  1: 1,
  2: 0,
  3: 0,
  4: 0
});

describe("Orders page", () => {
  it("renders the orders page", async () => {
    const { html } = renderComponent(OrdersPage, {}, () => ({
      store
    }));
    expect(html()).toMatchSnapshot();
  });
  it("renders the orders of type 1 by default - regular view", async () => {
    renderComponent(OrdersPage, {}, () => ({
      store
    }));
    const { selectedOrderType } = useOrdersSearch();
    expect(selectedOrderType.value).toEqual(ORDER_TYPE_VALUE.PLANNED);
  });
  it("renders the orders of type 3 by default - supplier view", async () => {
    const currentSite: Site = store.getters["common/getCurrentSite"];
    currentSite.isSupplierView = true;
    renderComponent(OrdersPage, {}, () => ({
      store
    }));
    const { selectedOrderType } = useOrdersSearch();
    expect(selectedOrderType.value).toEqual(ORDER_TYPE_VALUE.PURCHASE_ORDER);
  });
  it("renders orders base on the selected status", async () => {
    const fetchOrders = jest.spyOn(SupervisorService, "get");
    fetchOrders.mockImplementation((_endpoint, params) => {
      const ordersSize = (params as { filter: number }).filter === 2 ? 5 : 3;
      return {
        data: {
          results: Array.from({ length: ordersSize }, (_, i) => ({ id: i }))
        }
      };
    });
    const currentSite: Site = store.getters["common/getCurrentSite"];
    currentSite.isSupplierView = false;
    const { findAllByTestId, findByTestId } = renderComponent(
      OrdersPage,
      {},
      () => ({
        store
      })
    );
    expect((await findAllByTestId(/^order_line_item/)).length).toBe(3);
    const filterButton = await findByTestId(new RegExp("order_status_2_tab"));
    await fireEvent.click(filterButton);
    expect((await findAllByTestId(/^order_line_item/)).length).toBe(5);
  });
});
