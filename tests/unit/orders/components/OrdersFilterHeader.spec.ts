import { renderComponent } from "tests/test-utils";
import OrdersFilterHeader from "@/orders/components/OrdersFilterHeader.vue";
// eslint-disable-next-line jest/no-mocks-import
import { store } from "@/store/__mocks__/store";
import { fireEvent, waitFor } from "@testing-library/vue";
import { useOrdersSearch } from "@/orders/composables";
import { ORDER_TYPE_VALUE } from "@/orders/constants";
import { Site } from "@/objects/site";
import * as OrdersBackend from "@/orders/backend";
import SupervisorService from "@/services/supervisor.service";
jest.mock("@/helper/validation");

const orderStatus: { [key: string]: string } = {
  [ORDER_TYPE_VALUE.PLANNED]: "PLANNED",
  [ORDER_TYPE_VALUE.VALIDATED]: "VALIDATED",
  [ORDER_TYPE_VALUE.PURCHASE_ORDER]: "PURCHASE_ORDER",
  [ORDER_TYPE_VALUE.DELIVERED]: "DELIVERED"
};

const fetchOrders = jest
  .spyOn(SupervisorService, "get")
  .mockResolvedValue(jest.fn());
const fetchOrdersCountByStatus = jest
  .spyOn(OrdersBackend, "fetchOrdersCountByStatus")
  .mockResolvedValue({
    all: 1,
    1: 1,
    2: 0,
    3: 0,
    4: 0
  });

describe("Orders Filter Header", () => {
  beforeEach(() => {
    fetchOrders.mockClear();
    fetchOrdersCountByStatus.mockClear();
  });
  it("renders the orders' filter header", () => {
    const { html } = renderComponent(OrdersFilterHeader, {}, () => ({
      store
    }));
    expect(html()).toMatchSnapshot();
  });
  it("updates search keyword on input", async () => {
    const newSearch = "newSearch";
    const { searchKeyword } = useOrdersSearch();
    const { findByTestId } = renderComponent(OrdersFilterHeader, {}, () => ({
      store
    }));
    const searchInput = await findByTestId(/search_orders_page/i);
    await fireEvent.update(searchInput, newSearch);

    //wait for the debounce to be effective
    setTimeout(() => expect(searchKeyword.value).toEqual(newSearch), 500);
  });

  it.each(Object.entries(orderStatus))(
    "updates selected status %s named %s on filter click",
    async key => {
      const { selectedOrderType } = useOrdersSearch();
      const { getByTestId } = renderComponent(OrdersFilterHeader, {}, () => ({
        store
      }));
      const filterButton = getByTestId(new RegExp(`order_status_${key}_tab`));
      fireEvent
        .click(filterButton)
        .then(() => expect(selectedOrderType.value).toEqual(+key));
    }
  );

  it("fetches new count of orders by status on site change", async () => {
    renderComponent(OrdersFilterHeader, {}, () => ({
      store
    }));
    store.commit(
      "common/initCurrentSite",
      Site.create({
        id: 2,
        name: "TestSite",
        address: "42, rue du FooBar",
        currency: "eur",
        company: 2,
        users: [{ id: "2" }],
        storage_sites: [{ id: "1", name: "storageTest" }],
        demand_distribution_week: [1, 0, 0, 0, 0, 0, 0],
        customer_sites: [],
        planning_horizon_months: 12,
        demand_horizon_months: 12
      })
    );
    await waitFor(() =>
      // The fetch is called on component creation and by watcher trigger
      expect(fetchOrdersCountByStatus).toHaveBeenCalledTimes(2)
    );
  });
});
