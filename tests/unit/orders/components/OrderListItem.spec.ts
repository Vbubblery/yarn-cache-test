import { renderComponent } from "tests/test-utils";
import OrderListItem from "@/orders/components/OrderListItem.vue";
// eslint-disable-next-line jest/no-mocks-import
import { store } from "@/store/__mocks__/store";
import { Order } from "@/objects/order";
describe("Orders Filter Header", () => {
  it("Renders the component - even with empty order", () => {
    const { html } = renderComponent(OrderListItem, {
      store,
      propsData: {
        orderTypeValue: 1,
        availableActions: [],
        order: new Order()
      }
    });
    expect(html()).toMatchSnapshot();
  });
  it("Displays alert icon if order does not respect all constraints - MOQ", async () => {
    const { findByTestId } = renderComponent(OrderListItem, {
      store,
      propsData: {
        orderTypeValue: 1,
        availableActions: [],
        order: new Order({
          minimum_order_unit: "eur",
          minimum_order_quantity: 10
        })
      }
    });
    await expect(findByTestId(/order_alert_tooltip/)).resolves.toBeTruthy();
  });
  it("Displays alert icon if order does not respect all constraints - Full Truck", async () => {
    const { findByTestId } = renderComponent(OrderListItem, {
      store,
      propsData: {
        orderTypeValue: 1,
        availableActions: [],
        order: new Order({
          full_truck_quantity: 10,
          full_truck_unit: "",
          supplies: [{ quantity: 1 }]
        })
      }
    });
    await expect(findByTestId(/order_alert_tooltip/)).resolves.toBeTruthy();
  });
  it("Displays alert icon if order does not respect all constraints - Products count", async () => {
    const { findByTestId } = renderComponent(OrderListItem, {
      store,
      propsData: {
        orderTypeValue: 1,
        availableActions: [],
        order: new Order({
          supplies: [{ quantity: 1, moq: 2 }]
        })
      }
    });
    await expect(findByTestId(/order_alert_tooltip/)).resolves.toBeTruthy();
  });
  it("Displays alert icon if order does not respect all constraints - Frequency", async () => {
    const { findByTestId } = renderComponent(OrderListItem, {
      store,
      propsData: {
        orderTypeValue: 1,
        availableActions: [],
        order: new Order({
          previous_order_date: "fakeDate",
          order_frequency: 10
        })
      }
    });
    await expect(findByTestId(/order_alert_tooltip/)).resolves.toBeTruthy();
  });
});
