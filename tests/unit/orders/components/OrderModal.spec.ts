import { renderComponent } from "tests/test-utils";
import OrderModal from "@/orders/components/OrderModal.vue";
import { Order } from "@/objects/order";
// eslint-disable-next-line jest/no-mocks-import
import { store } from "@/store/__mocks__/store";
import Vue from "vue";
import { Modal } from "ant-design-vue";
import { waitFor, RenderOptions, fireEvent } from "@testing-library/vue";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import * as OrdersBackend from "@/orders/backend";
jest.mock("ant-design-vue", () => ({
  ...jest.requireActual("ant-design-vue"),
  DatePicker: jest.fn()
}));

const fetchOrder = jest.spyOn(OrdersBackend, "getOrderByFilters");
const spyOrdersByStatus = jest.spyOn(OrdersBackend, "getOrdersCountByStatus");
jest.spyOn(OrdersBackend, "fetchOrdersCountByStatus").mockImplementation();
jest.spyOn(OrdersBackend, "updateOrderStatus").mockImplementation();
jest.spyOn(Swal, "fire").mockResolvedValue({
  isConfirmed: true,
  isDenied: false,
  isDismissed: false
});
// const deleteOrderSpy = jest
//   .spyOn(OrdersBackend, "deleteBackendOrder")
//   .mockImplementation();
// Reduce the modal rendering boilerplate
const renderModal = async (opts: RenderOptions<Vue>) => {
  const renderResult = renderComponent(OrderModal, opts);
  await waitFor(() => {}); // Must wait until the modal is mounted
  return renderResult;
};

const basicProps = {
  visible: true,
  orderProp: new Order(),
  dateLabelToDisplay: "",
  shouldDisplayActions: true,
  availableActions: []
};

describe("OrderModal", () => {
  beforeAll(() => Vue.use(Modal));
  beforeEach(() => {
    spyOrdersByStatus.mockClear();
    fetchOrder.mockClear();
  });
  it("Renders the component", async () => {
    const { baseElement } = await renderModal({
      props: basicProps,
      store
    });
    /**
     * Checking the snapshot of the baseElement instead of html
     * because the modal is not mounted in its parent container
     * but in a container generated in the body
     */
    expect(baseElement).toMatchSnapshot();
  });
  it("Does not show edit button if order status not < 2", async () => {
    const { getByTestId } = await renderModal({
      props: { ...basicProps, orderProp: new Order({ status_id: 2 }) },
      store
    });
    expect(() => getByTestId(/order_modal_edit_button/)).toThrow();
  });
  it("Should be in edit mode by default if status is 1", async () => {
    const { getByTestId } = await renderModal({
      props: {
        ...basicProps,
        orderProp: new Order({
          status_id: 1,
          date: null,
          supplies: [{ id: 1, quantity: 1, moq: 2 }]
        })
      },
      stubs: {
        DatePicker: {
          template: "<span />"
        }
      },
      store
    });
    const productInput = getByTestId(/order_modal_product_input/);
    await fireEvent.update(productInput, "5");
    expect(() => getByTestId(/order_modal_save_button/)).toBeDefined();
  });
  // TODO: Check if a cancel button appears after click on edit
  it.todo("Gives the possibility to cancel when a change is made");
  // TODO: Click on edit, input new values in supplies, cancel, then check if the values displayed = the values in the orderProp
  it.todo("Switches back to initial values when cancelling change");
  // TODO: Check if backend service is called with the right arguments after click on confirm
  it.todo("Saves changes when approving changes");
  it.todo("Updates the days of coverage on supply quantity input");
  it("should display confirm button for purchase requisition order", async () => {
    const newOrder = new Order({
      id: 12,
      status_id: 2,
      date: "2022-05-30",
      supplies: [{ quantity: 1 }]
    });
    fetchOrder.mockResolvedValue(newOrder);
    const { getByTestId, updateProps } = await renderModal({
      props: {
        ...basicProps,
        orderProp: new Order({
          id: 12,
          status_id: 1,
          date: "2022-05-30",
          supplies: [{ quantity: 1 }]
        }),
        availableActions: ["delete"]
      },
      store
    });
    const confirmButton = getByTestId(/order_modal_confirm_button/);
    expect(confirmButton).toBeDefined();
    await waitFor(async () => {
      await fireEvent.click(confirmButton);
      expect(fetchOrder).toHaveBeenCalled();
    });
    await waitFor(async () => {
      await updateProps({ ...basicProps, orderProp: newOrder });
      const cancelButton = getByTestId(/order_modal_cancel_button/);
      expect(cancelButton).toBeDefined();
    });
  });
  it("should display discard button for confirmed purchase requisition order", async () => {
    jest.spyOn(OrdersBackend, "deleteBackendOrder").mockImplementation();
    const newOrder = new Order({
      id: 12,
      status_id: 1,
      date: "2022-05-30",
      supplies: [{ quantity: 1 }]
    });
    fetchOrder.mockResolvedValue(newOrder);
    const { getByTestId, updateProps } = await renderModal({
      props: {
        ...basicProps,
        orderProp: new Order({
          id: 12,
          status_id: 2,
          date: "2022-05-30",
          supplies: [{ quantity: 1 }]
        }),
        availableActions: ["delete"]
      },
      store
    });

    const cancelButton = getByTestId(/order_modal_cancel_button/);
    expect(cancelButton).toBeDefined();
    await waitFor(async () => {
      await fireEvent.click(cancelButton);
      expect(fetchOrder).toHaveBeenCalled();
    });
    await waitFor(async () => {
      await updateProps({ ...basicProps, orderProp: newOrder });
      const confirmButton = getByTestId(/order_modal_confirm_button/);
      expect(confirmButton).toBeDefined();
    });
  });
  it("shouldn't display confirm and discard button for status3 orders", async () => {
    jest.spyOn(OrdersBackend, "deleteBackendOrder").mockImplementation();
    const { findByTestId } = await renderModal({
      props: {
        ...basicProps,
        orderProp: new Order({
          id: 12,
          status_id: 3,
          supplies: [{ quantity: 1 }]
        })
      },
      store
    });
    await expect(
      findByTestId(/order_modal_cancel_button/)
    ).rejects.toBeTruthy();
    await expect(
      findByTestId(/order_modal_confirm_button/)
    ).rejects.toBeTruthy();
  });
  it("shouldn't display confirm and discard button for status4 orders", async () => {
    const { findByTestId } = await renderModal({
      props: {
        ...basicProps,
        orderProp: new Order({
          id: 12,
          status_id: 4,
          supplies: [{ quantity: 1 }]
        }),
        availableActions: ["delete"]
      },
      store
    });
    await expect(
      findByTestId(/order_modal_cancel_button/)
    ).rejects.toBeTruthy();
    await expect(
      findByTestId(/order_modal_confirm_button/)
    ).rejects.toBeTruthy();
  });
  // eslint-disable-next-line jest/no-commented-out-tests
  // it("Delete order", async () => {
  //   const { getByTestId } = await renderModal({
  //     props: { ...basicProps, availableActions: ["delete"] },
  //     store
  //   });
  //   await fireEvent.click(getByTestId(/delete_button_order_details/));
  //   expect(deleteOrderSpy).toHaveBeenCalled();
  // });
  it("Opens the planning modal when clicking on Planning button", async () => {
    const { getByTestId } = await renderModal({
      props: {
        ...basicProps,
        orderProp: new Order({
          status_id: 1,
          supplies: [{ quantity: 2 }]
        })
      },
      store
    });
    await fireEvent.click(getByTestId(/order_modal_open_planning_button/));
    await waitFor(() =>
      expect(() => getByTestId(/order_modal_planning/)).not.toThrow()
    );
  });
});
