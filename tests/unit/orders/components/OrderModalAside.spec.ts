import { renderComponent } from "tests/test-utils";
import OrderModalAside from "@/orders/components/OrderModalAside.vue";
// eslint-disable-next-line jest/no-mocks-import
import { store } from "@/store/__mocks__/store";
import { Order } from "@/objects/order";
import dayjs from "@/dayjs";

const basicProps = {
  isEditing: false,
  editableDeliveryDate: dayjs(),
  disabledDate: (x: string) => x,
  isUpdatingDate: false,
  deliveryDate: ""
};

describe("OrderModalAside", () => {
  it("Shows alert message for each constraint - Full truck", () => {
    const { getByTestId } = renderComponent(OrderModalAside, {
      props: {
        ...basicProps,
        editableSupplies: {
          1: 1
        },
        order: new Order({
          full_truck_quantity: 10,
          full_truck_unit: "",
          supplies: [{ quantity: 1 }]
        })
      },
      store
    });
    expect(() =>
      getByTestId(/order_modal_order_and_supply_constraint_not_met/)
    ).not.toThrow();
  });
  it("Shows alert message for each constraint - MOQ", () => {
    const { getByTestId } = renderComponent(OrderModalAside, {
      props: {
        ...basicProps,
        editableSupplies: {
          1: 1,
          2: 1,
          3: 1
        },
        order: new Order({
          id: 1,
          supplies: [
            {
              id: 1,
              product_site: 1,
              product_price: 2,
              moq: 2
            },
            {
              id: 2,
              product_site: 2,
              product_price: 4,
              moq: 2
            },
            {
              id: 3,
              product_site: 3,
              product_price: 2,
              moq: 2
            }
          ]
        })
      },
      store
    });
    expect(() =>
      getByTestId(/order_modal_supplies_constraint_not_met/)
    ).not.toThrow();
  });
  it("Shows alert message for each constraint - Lot Size", () => {
    const { getByTestId } = renderComponent(OrderModalAside, {
      props: {
        ...basicProps,
        editableSupplies: {
          1: 1,
          2: 1,
          3: 1
        },
        order: new Order({
          id: 1,
          supplies: [
            {
              id: 1,
              product_site: 1,
              product_price: 2,
              lot_size: 2
            },
            {
              id: 2,
              product_site: 2,
              product_price: 4,
              lot_size: 2
            },
            {
              id: 3,
              product_site: 3,
              product_price: 2,
              lot_size: 2
            }
          ]
        })
      },
      store
    });
    expect(() =>
      getByTestId(/order_modal_supplies_constraint_not_met/)
    ).not.toThrow();
  });
  it("Shows the right total", () => {
    const { getByTestId } = renderComponent(OrderModalAside, {
      props: {
        ...basicProps,
        // quantities of supplies
        editableSupplies: {
          1: 200,
          2: 300,
          3: 400
        },
        order: new Order({
          supplies: [
            {
              id: 1,
              product_site: 1,
              product_price: 2
            },
            {
              id: 2,
              product_site: 2,
              product_price: 4
            },
            {
              id: 3,
              product_site: 3,
              product_price: 2
            }
          ]
        })
      },
      store
    });

    expect(getByTestId(/order_modal_total_price/).innerHTML.trim()).toEqual(
      "2 400,00"
    );
  });
  it.todo(
    "Should display the warning icon close to the 'Order frequency' detail if the 'Order frequency constraint' is not met"
  );
  it.todo(
    "Should display the warning icon close to the 'Full truck quantity' detail if the 'Full truck quantity constraint' is not met"
  );
  it.todo(
    "Should display the warning icon close to the 'Minimum order quantity' detail if the 'Minimum order quantity constraint' is not met"
  );
  it.todo(
    "Should display a green message in title to notify that everything is ok if all constraints on Order and Supplies level are met"
  );
  it.todo(
    "Should display a warning message  in title to notify that at least one constraint on Order level and one constraint on a Product level is not met"
  );
  it.todo(
    "Should display a warning message  in title to notify that at least one constraint on Order level is not met (and all constraints on Product are met)"
  );
  it.todo(
    "Should display a warning message  in title to notify that at least one constraint on Product level is not met (and all constraints on Order are met)"
  );
  it.todo(
    "Should not display any warning or green message in title in Supplier View"
  );
});
