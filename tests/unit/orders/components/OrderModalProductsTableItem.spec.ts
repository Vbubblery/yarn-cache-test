import { renderComponent } from "tests/test-utils";
import OrderModalProductsTableItem from "@/orders/components/OrderModalProductsTableItem.vue";
import { Order, OrderSupply } from "@/objects/order";
import { Views } from "@/orders/constants";
import { computeStockCoverage } from "@/components/base/table/utils/stockCoverage";
// eslint-disable-next-line jest/no-mocks-import
import { store } from "@/store/__mocks__/store";
import { ref } from "@vue/composition-api";

/**
 * This component is in charge of:
 * - Showing the alerts about a single supply
 * - Displaying the info about a single supply
 * - Computing reactively the days of coverage for a single supply
 * and delegating the following to its grandparent (OrderModal):
 * - Input event and payload
 * - Click on planning view
 * The events that are delegated should be / are tested in the orchestrator, the grandparent (OrderModal)
 */
describe("OrderModalProductsTableItem", () => {
  it("Renders the component", () => {
    const editableSupplies = ref({});
    const { html } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order: new Order(),
        editableSupplies,
        supply: new OrderSupply(),
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(html()).toMatchSnapshot();
  });
  it("Displays an alert on the supply level if not respecting constraints - MOQ", async () => {
    const order = new Order({
      id: 1,
      status_id: 1,
      product_site: 1,
      supplies: [{ id: 1, quantity: 1, moq: 2 }]
    });
    const editableSupplies = ref({ 1: 1 });
    const supply = order.supplies[0];
    const { getAllByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(getAllByTestId(/order_modal_supply_alert_icon/).length).toEqual(1);
  });
  it("Displays the quantity with red color if its unnecessary at all", async () => {
    const editableSupplies = ref({ 1: 10 });
    const order = new Order({
      id: 1,
      status_id: 1,
      minimum_order_quantity: 2,
      supplies: [
        {
          id: 1,
          product_site: 1,
          quantity: 10,
          minimum_order_quantity: 2,
          lotSize: 5,
          minimum_stock_at_end_of_period: 0,
          stock_at_end_of_period: 11
        }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(
      getByTestId(/order_modal_product_input/).getAttribute("class")
    ).toContain("text-red-600");
  });
  it("Displays the quantity with orange color when is partially needed", async () => {
    const editableSupplies = ref({ 1: 10 });
    const order = new Order({
      id: 1,
      status_id: 1,
      minimum_order_quantity: 2,
      supplies: [
        {
          id: 1,
          product_site: 1,
          quantity: 10,
          minimum_order_quantity: 2,
          lotSize: 5,
          minimum_stock_at_end_of_period: 0,
          stock_at_end_of_period: 8
        }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(
      getByTestId(/order_modal_product_input/).getAttribute("class")
    ).toContain("text-orange-500");
  });
  it("Displays the quantity with gray color when is fully needed", async () => {
    const editableSupplies = ref({ 1: 10 });
    const order = new Order({
      id: 1,
      status_id: 1,
      supplies: [
        {
          id: 1,
          product_site: 1,
          quantity: 10,
          moq: 0,
          lot_size: 0,
          minimum_stock_at_end_of_period: 0,
          stock_at_end_of_period: 0
        }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(
      getByTestId(/order_modal_product_input/).getAttribute("class")
    ).toContain("text-gray-500");
  });
  it("Displays the quantity with gray color when moq is higher than needed stock", async () => {
    const editableSupplies = ref({ 1: 10 });
    const order = new Order({
      id: 1,
      status_id: 1,
      supplies: [
        {
          id: 1,
          product_site: 1,
          quantity: 10,
          moq: 10,
          lot_size: 0,
          minimum_stock_at_end_of_period: 0,
          stock_at_end_of_period: 4
        }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(
      getByTestId(/order_modal_product_input/).getAttribute("class")
    ).toContain("text-gray-500");
  });
  it("Displays the quantity with gray color when lotSize is higher than needed stock", async () => {
    const editableSupplies = ref({ 1: 10 });
    const order = new Order({
      id: 1,
      status_id: 1,
      supplies: [
        {
          id: 1,
          product_site: 1,
          quantity: 10,
          moq: 7,
          lot_size: 10,
          minimum_stock_at_end_of_period: 0,
          stock_at_end_of_period: 4
        }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(
      getByTestId(/order_modal_product_input/).getAttribute("class")
    ).toContain("text-gray-500");
  });
  it("Displays an alert on the supply level if not respecting constraints - Lot Size", async () => {
    const editableSupplies = ref({ 3: 1 });
    const order = new Order({
      id: 1,
      status_id: 1,
      supplies: [
        {
          id: 3,
          product_site: 3,
          quantity: 1,
          lot_size: 2
        }
      ]
    });
    const supply = order.supplies[0];
    const { getAllByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(getAllByTestId(/order_modal_supply_alert_icon/).length).toEqual(1);
  });
  it("Computes and displays the right number of days of coverage - positive stock at delivery", async () => {
    const editableSupplies = ref({ 1: 1 });
    const order = new Order({
      supplies: [
        {
          id: 1,
          stock_at_end_of_period: 1,
          total_demand: 77,
          product_site: 1
        }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(
      Number(
        getByTestId(/^order_modal_supply_days_cov/)
          .innerHTML.trim()
          .split(" ")[0]
      )
    ).toEqual(computeStockCoverage(1, 77));
  });
  it("Computes and displays the right number of days of coverage - negative stock at delivery", async () => {
    const editableSupplies = ref({ 2: 2 });
    const order = new Order({
      supplies: [
        { id: 2, stock_at_end_of_period: -1, total_demand: 88, product_site: 2 }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(
      Number(
        getByTestId(/^order_modal_supply_days_cov/)
          .innerHTML.trim()
          .split(" ")[0]
      )
    ).toEqual(computeStockCoverage(-1, 88));
  });
  it("Computes and displays the right number of days of coverage - no totalDemand (Inf days of coverage)", async () => {
    const editableSupplies = ref({ 2: 1 });
    const order = new Order({
      supplies: [
        {
          id: 2,
          stock_at_end_of_period: 1,
          total_demand: null,
          product_site: 2
        }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false,
        editableSupplyQuantity: 0
      },
      store
    });
    expect(
      getByTestId(/^order_modal_supply_days_cov/).innerHTML.trim()
    ).toEqual("∞");
  });
  it("Computes and displays the right number of days of coverage - no stock at delivery (0 days of coverage)", async () => {
    const editableSupplies = ref({ 2: 1 });
    const order = new Order({
      supplies: [
        {
          id: 2,
          stock_at_end_of_period: undefined,
          total_demand: 88,
          product_site: 2
        }
      ]
    });
    const supply = order.supplies[0];
    const { getByTestId } = renderComponent(OrderModalProductsTableItem, {
      props: {
        order,
        editableSupplies,
        supply,
        view: Views.CUSTOMER,
        isEditing: false
      },
      store
    });
    expect(
      Number(
        getByTestId(/^order_modal_supply_days_cov/)
          .innerHTML.trim()
          .split(" ")[0]
      )
    ).toEqual(0);
  });
  it.todo(
    "should open the Planning when clicking on the product name in regular view"
  );
  it.todo(
    "should not be allowed to open the Planning when clicking on the product name in supplier portal view"
  );
});
