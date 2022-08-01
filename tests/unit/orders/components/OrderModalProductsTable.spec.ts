import { renderComponent } from "tests/test-utils";
import OrderModalProductsTable from "@/orders/components/OrderModalProductsTable.vue";
import { Order } from "@/objects/order";
import { Views } from "@/orders/constants";

// eslint-disable-next-line jest/no-mocks-import
import { store } from "@/store/__mocks__/store";

/**
 * This is a "dumb" component. It has no responsibility besides
 * displaying in a table format the products of an order.
 * As such, a snapshot test is enough to raise a warning if there is a UI change
 */
describe("OrderModalProductsTable", () => {
  it("Renders the component", () => {
    const { html } = renderComponent(OrderModalProductsTable, {
      props: {
        order: new Order(),
        isEditing: false,
        editableSupplies: {},
        view: Views.CUSTOMER
      },
      store
    });
    expect(html()).toMatchSnapshot();
  });
});
