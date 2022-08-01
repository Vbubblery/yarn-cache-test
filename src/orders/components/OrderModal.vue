<template>
  <AModal
    :visible="visible"
    width="100%"
    height="100%"
    centered
    :closable="false"
    :body-style="{ padding: 0 }"
    dialog-class="pb-0 h-full"
    :footer="null"
    @cancel="closeModalAndReloadIfNeeded"
  >
    <OrderPlanning
      v-if="selectedSupply"
      :key="selectedSupply.id"
      :visible="scheduleVisible"
      :delivery-date="formattedDeliveryDate"
      @close="closeOrderPlanning"
      @handle:planningSaved="handlePlanningSaved"
    />
    <div
      data-testid="order_modal_container"
      class="flex flex-col h-screen bg-white font-montserrat"
    >
      <OrderModalHeader
        :order="order"
        :is-editing="isEditing"
        :has-order-unsaved-modification="hasOrderUnsavedModification"
        :is-updating-order="isUpdatingOrder"
        @close:modal="closeModalAndReloadIfNeeded"
        @revert:changes="revertChanges"
        @update:order="updateOrder"
        @switch:status="switchOrderStatus"
        @delete:order="deleteCurrentOrder"
      />
      <div class="flex justify-between flex-1 overflow-hidden">
        <OrderModalProductsTable
          :order="order"
          :is-editing="hasOrderUnsavedModification"
          :editable-supplies="editableSupplies"
          :view="view"
          @input="editSupplyByProductId"
          @view:planning="goToPlanning"
          @delete:supply="deleteSupply"
        />
        <OrderModalAside
          :is-editing="isEditing"
          :order="order"
          :editable-supplies="editableSupplies"
          :editable-delivery-date="editableDeliveryDate"
          :disabled-date="disabledDate"
          :is-updating-date="isUpdatingDate"
          :delivery-date="deliveryDate"
          @update:deliveryDate="modifyDeliveryDate"
        />
      </div>
    </div>
  </AModal>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  SetupContext,
  toRefs
} from "@vue/composition-api";
import OrderPlanning from "@/orders/components/OrderPlanning.vue";
import OrderModalAside from "@/orders/components/OrderModalAside.vue";
import OrderModalHeader from "@/orders/components/OrderModalHeader.vue";
import OrderModalProductsTable from "@/orders/components/OrderModalProductsTable.vue";
import { Modal } from "ant-design-vue";
import { Order, OrderSupply } from "@/objects/order";
import dayjs from "@/dayjs";
import { Site } from "@/objects/site";
import { ORDER_TYPE_VALUE, Views } from "@/orders/constants";
import helper from "@/helper/helper";
import SupervisorService from "@/services/supervisor.service";
import NotificationService from "@/services/notification.service";
import { Dayjs } from "dayjs";
import PlanningService from "@/services/planning.service";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import { baseOptions } from "@/sweetalert";
import { useOrderActions, useOrderDetails } from "@/orders/composables";
import {
  deleteBackendOrder,
  deleteOrder,
  deleteOrderSupply,
  getOrderByFilters,
  updateOrders
} from "../backend";
import { FlowlityDateUnit } from "@/helper/date";
import { useI18n } from "vue-i18n-composable";

export default defineComponent({
  name: "OrderModal",
  components: {
    AModal: Modal,
    OrderPlanning,
    OrderModalAside,
    OrderModalHeader,
    OrderModalProductsTable
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    orderProp: {
      type: Object as () => Order,
      required: true
    },
    dateLabelToDisplay: {
      type: String,
      required: true
    },
    shouldDisplayActions: {
      type: Boolean,
      required: false
    },
    availableActions: {
      type: Array,
      required: true
    }
  },
  emits: ["reload:page", "close:modal", "update:order"],
  setup(props, context: SetupContext) {
    const { t } = useI18n();
    const { orderProp: order } = toRefs(props);
    const stepsMessages = ref<object>({});
    const deleting = ref(false);
    const scheduleVisible = ref(false);
    const selectedSupply = ref<object | undefined>(undefined);
    const editableDeliveryDate = ref(dayjs(order.value.date));
    const editableSupplies = ref<Record<string, number>>({});
    const isUpdatingDate = ref(false);
    const isUpdatingOrder = ref(false);
    const isEditing = ref(false);
    const shouldMerge = ref(false);
    const mergeOrder = ref<object | null>(null);
    const shouldReloadOrdersAfterModalClosing = ref(false);
    const isOrderStillExistingAfterChangeInPlanning = ref(true);
    const store = context.root.$store;
    const {
      quantity,
      suppliesTotalPrice,
      deliveryDate,
      isOrderRespectingMOQConstraint,
      isOrderRespectingFullTruckQuantityConstraint,
      isOrderRespectingOrderFrequencyConstraint,
      isTotalQuantityPrimaryValid,
      isTotalQuantitySecondaryValid
    } = useOrderDetails(order, editableSupplies);

    const currentSite = computed<Site>(
      () => store.getters["common/getCurrentSite"]
    );

    const { acceptCurrentOrder, discardCurrentOrder } = useOrderActions(
      context,
      order,
      currentSite
    );

    const makeEditableSupplies = (anOrder: {
      supplies: Array<OrderSupply>;
    }) => {
      return anOrder.supplies.reduce((acc, curr) => {
        acc[curr.productId] = curr.quantity;
        return acc;
      }, {} as { [key: string]: number });
    };

    const dataJobsIsRunning = computed<boolean>(() => {
      return store.state.alerts.dataJobsAlerts?.dataJobsIsRunning;
    });
    const view = computed(() => {
      return currentSite.value.isSupplierView ? Views.SUPPLIER : Views.CUSTOMER;
    });
    const displayId = computed(() => {
      const isTemporaryId = [
        ORDER_TYPE_VALUE.PLANNED,
        ORDER_TYPE_VALUE.VALIDATED
      ].includes(order.value.statusId);
      const idTitle = isTemporaryId ? "tempId" : "orderId";
      const idRef =
        !isTemporaryId && order.value.externalId
          ? order.value.externalId
          : order.value.id;
      return { idTitle, idRef };
    });
    const showValidateBtn = computed(() => {
      const isPlanned = order.value.statusId === ORDER_TYPE_VALUE.PLANNED;
      return view.value === Views.SUPPLIER && isPlanned;
    });
    const hasLeadTime = computed(() => {
      return !isNaN(parseInt(order.value.leadTime));
    });
    const hasOrderUnsavedModification = computed(() => {
      const originalSupplies = makeEditableSupplies(order.value);
      return (
        dayjs(order.value.date).format("YYYY-MM-DD") !==
          editableDeliveryDate.value.format("YYYY-MM-DD") ||
        !helper.isEqual(originalSupplies, { ...editableSupplies.value })
      );
    });
    const modifiedPids = computed(() => {
      return order.value.supplies
        .filter(
          (supply: OrderSupply) =>
            supply.quantity !== editableSupplies.value[supply.productId]
        )
        .map((supply: OrderSupply) => supply.productId);
    });
    const formattedDeliveryDate = computed(() => {
      return dayjs(props.orderProp.date).format("ddd DD/MM");
    });
    const editSupplyByProductId = ({
      editedId,
      value
    }: {
      editedId: number;
      value: number;
    }) => {
      editableSupplies.value[editedId] = Number(value);
    };
    const handleEditOrder = (shouldEdit: boolean) => {
      if (!dataJobsIsRunning.value && shouldEdit) {
        editableSupplies.value = makeEditableSupplies(props.orderProp);
      }
      isEditing.value = shouldEdit;
    };

    const switchOrderStatus = async () => {
      try {
        Swal.fire({
          text: t("orders.orderIsUpdating").toString(),
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          onOpen: () => {
            Swal.showLoading();
          }
        });
        if (order.value.statusId === ORDER_TYPE_VALUE.PLANNED) {
          await acceptCurrentOrder(false);
        } else {
          await discardCurrentOrder(false);
        }
        const newOrder: Order = (await getOrderByFilters(
          order.value.date,
          order.value.supplierId,
          order.value.statusId === ORDER_TYPE_VALUE.PLANNED
            ? ORDER_TYPE_VALUE.VALIDATED
            : ORDER_TYPE_VALUE.PLANNED,
          currentSite.value.id
        )) as Order;
        context.emit("update:order", newOrder);
        Swal.close();
      } catch (error) {
        NotificationService.error((error as Error).message);
      }
    };

    const stepColor = (step: number): string => {
      let color = "";
      if (step === order.value.statusId) color = "text-purple-600";
      if (step < order.value.statusId) color = "text-fl-green-1";
      return color;
    };

    const revertChanges = (): void => {
      editableSupplies.value = makeEditableSupplies(order.value);
      editableDeliveryDate.value = dayjs(order.value.date);
      shouldMerge.value = false;
      mergeOrder.value = null;
    };

    const makeStepsMessages = (orderStatus: number): void => {
      const validateStepMsg = {
        title:
          orderStatus > ORDER_TYPE_VALUE.PLANNED
            ? "orderValidated"
            : "waitValidateOrder"
      };
      const shipStepMsg = {
        title:
          orderStatus > ORDER_TYPE_VALUE.VALIDATED
            ? "orderSent"
            : "waitSendOrder",
        subtitle:
          view.value === Views.SUPPLIER && !hasLeadTime.value
            ? "leadTimeNotSet"
            : "sendBefore"
      };
      const deliveryStepMsg = {
        title: "expectedDelivery"
      };

      stepsMessages.value = { validateStepMsg, shipStepMsg, deliveryStepMsg };
    };
    const goToSiteSettings = (): void => {
      if (!(view.value === Views.SUPPLIER && !hasLeadTime.value)) return;
      context.root.$router.push({
        name: "editSite",
        params: { siteId: currentSite.value.id }
      });
    };
    const updateSelectedParameters = (payload: {
      productId: number;
      strDate: string;
      timebucket: FlowlityDateUnit;
      additionalMonths: number;
    }) => store.dispatch("planning/updateSelectedParameters", payload);
    const goToPlanning = async (payload: {
      orderDate: string;
      supply: OrderSupply;
    }) => {
      await updateSelectedParameters({
        productId: payload.supply.productId,
        strDate: payload.orderDate,
        timebucket: "day",
        additionalMonths: 1
      });
      scheduleVisible.value = true;
      selectedSupply.value = payload.supply;
    };

    const closeModalAndReloadIfNeeded = () => {
      context.emit("close:modal", {
        shouldReloadOrdersAfterModalClosing:
          shouldReloadOrdersAfterModalClosing.value
      });
    };

    const closeOrderPlanning = () => {
      scheduleVisible.value = false;
      selectedSupply.value = undefined;
      if (isOrderStillExistingAfterChangeInPlanning.value === false)
        closeModalAndReloadIfNeeded();
    };

    const fetchUpdatedOrder = async () => {
      try {
        const { data } = await SupervisorService.get(
          `/api/v1/sites/${currentSite.value.id}/orders?keyword_search=${props.orderProp.id}`
        );
        return data?.results?.[0] ?? null;
      } catch {
        NotificationService.error(t("orderDetails.error.fetchOrderError"));
      }
    };

    const handlePlanningSaved = async () => {
      // if the Planning was saved it means that this Order or Orders in the Order List were potentially modified
      // therefore we should refresh the Order list after closing the Modal
      shouldReloadOrdersAfterModalClosing.value = true;

      const updatedOrder = await fetchUpdatedOrder();

      // we should check if the Order was deleted in Planning
      // (it can happen if there is only one product in the Order and its supply was removed from the Planning)
      // if the Order was deleted we should close the modal and refresh as soon as the Planning is closed
      isOrderStillExistingAfterChangeInPlanning.value = !!updatedOrder;

      if (isOrderStillExistingAfterChangeInPlanning.value) {
        const newOrder = Order.create(updatedOrder) as Order;
        context.emit("update:order", newOrder);

        // after fetching the new Order changed from the Planning modal
        // we should reset the editableSupplies with the new Supplies fetched
        editableSupplies.value = makeEditableSupplies(newOrder);
      }
    };

    const disabledDate = (startValue: Dayjs) => {
      return startValue.valueOf() < dayjs().valueOf();
    };
    const mergeSupplies = (
      supplyArr1: OrderSupply[],
      supplyArr2: OrderSupply[]
    ) => {
      const grouped = helper.groupBy(
        [...supplyArr1, ...supplyArr2],
        "productId"
      );
      return Object.values(grouped).map(groupedSupplies =>
        groupedSupplies.reduce((acc, curr) => acc.add(curr))
      );
    };
    const updateSupplies = async (
      orderSupplies: OrderSupply[],
      updatedDate: string
    ) => {
      try {
        const payloads = orderSupplies.map(supply => ({
          productId: supply.productId,
          supply: PlanningService.formatSupplyPayload({
            supplierId: order.value.supplierId,
            productId: supply.productId,
            period: updatedDate,
            periodType: "day",
            quantity: supply.quantity
          })
        }));

        // We execute the promises sequentially to avoid deadlock issues on postgres
        for (let p of payloads) {
          await PlanningService.updatePlanning(p);
        }
        if (shouldMerge.value) {
          await deleteOrder(order.value, currentSite.value.id);
        }
      } catch (error: unknown) {
        NotificationService.error((error as Error).message);
      }
    };
    const warn = (type: string) => {
      return Swal.fire({
        ...baseOptions,
        title: t("orders." + type + "WarningTitle").toString(),
        text: t("orders." + type + "WarningText").toString(),
        confirmButtonText: context.root
          .$t(type + "WarningConfirmButton")
          .toString(),
        cancelButtonText: context.root
          .$t(type + "WarningCancelButton")
          .toString(),
        cancelButtonColor: "transparent"
      });
    };
    const updateDeliveryDate = async () => {
      const updatedDate = editableDeliveryDate.value.format("YYYY-MM-DD");
      isUpdatingDate.value = true;
      try {
        const existingOrder = await getOrderByFilters(
          updatedDate,
          order.value.supplierId,
          order.value.statusId,
          currentSite.value.id
        );
        if (existingOrder && existingOrder.id !== order.value.id) {
          const choice = await warn("merge");
          if (choice.isConfirmed) {
            shouldMerge.value = true;
            mergeOrder.value = existingOrder;
          } else {
            editableDeliveryDate.value = dayjs(order.value.date);
            return false;
          }
        }
        return true;
      } catch (error: unknown) {
        NotificationService.error((error as Error).message);
      } finally {
        isUpdatingDate.value = false;
      }
    };
    const updateOrder = async () => {
      try {
        isUpdatingOrder.value = true;
        const shouldContinue = await updateDeliveryDate();
        if (!shouldContinue) return revertChanges();
        Swal.fire({
          text: t("orders.orderIsUpdating").toString(),
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          onOpen: () => {
            Swal.showLoading();
          }
        });
        const updatedDate = editableDeliveryDate.value.format("YYYY-MM-DD");

        let orderSupplies = order.value.supplies.map((s: OrderSupply) => {
          const ratio = s.isDefaultUnit
            ? 1
            : s.quantity / s.secondaryUnitQuantity;
          // clone to avoid the side effect of modifying the original order's supplies
          const cloned = helper.clone(s);
          cloned.quantity =
            (editableSupplies.value[s.productId] as number) / ratio;
          return cloned;
        });
        if (shouldMerge.value) {
          orderSupplies = mergeSupplies(
            orderSupplies,
            (mergeOrder.value as { supplies: OrderSupply[] }).supplies
          );
        } else {
          // If only a few products have been changed, without the date,
          // no need to send all the products for update
          orderSupplies =
            updatedDate !== order.value.date
              ? orderSupplies
              : orderSupplies.filter((s: OrderSupply) =>
                  modifiedPids.value.includes(s.productId)
                );
          await updateOrders([order.value], updatedDate, currentSite.value.id);
        }
        await updateSupplies(orderSupplies, updatedDate);
        const newOrder = (await getOrderByFilters(
          updatedDate,
          order.value.supplierId,
          order.value.statusId,
          currentSite.value.id
        )) as Order;
        context.emit("update:order", newOrder);
        editableSupplies.value = makeEditableSupplies(newOrder);
        NotificationService.success(t("orders." + "updateSuccess").toString());
        shouldReloadOrdersAfterModalClosing.value = true;
        isUpdatingOrder.value = false;
        Swal.close();
      } catch (error: unknown) {
        NotificationService.error((error as Error).message);
        isUpdatingOrder.value = false;
        shouldMerge.value = false;
      }
    };
    const modifyDeliveryDate = (newDate: Dayjs) => {
      editableDeliveryDate.value = newDate;
    };
    const deleteSupply = async (supplyId: string) => {
      Swal.fire({
        ...baseOptions,
        title: t("orders." + "deleteWarningTitle"),
        text: t("orders." + "deleteSupplyWarningText"),
        confirmButtonText: t("orders." + "deleteWarningConfirmButton"),
        cancelButtonText: t("orders." + "deleteWarningCancelButton"),
        cancelButtonColor: "transparent"
      } as never).then(async result => {
        if (result.isConfirmed) {
          try {
            Swal.fire({
              text: t("orders." + "productDeletionMessage").toString(),
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              onOpen: () => {
                Swal.showLoading();
              }
            });
            if (order.value.supplies.length === 1) {
              await deleteBackendOrder(order.value, currentSite.value.id);
              context.emit("reload:page");
            } else {
              await deleteOrderSupply(
                order.value,
                supplyId,
                currentSite.value.id
              );
              const newOrder = (await getOrderByFilters(
                order.value.date,
                order.value.supplierId,
                order.value.statusId,
                currentSite.value.id
              )) as Order;

              // refresh the Planning table via updateSupplies
              // as we do it for a change of Supply quantity
              // TODO: find a more robust backend way to handle the update of Order, Supplies and Planning at the same time
              const supplyToDelete = order.value.supplies.find(
                (supplyObj: OrderSupply) =>
                  parseInt(supplyObj.id) === parseInt(supplyId)
              );
              supplyToDelete.quantity = 0;
              await updateSupplies([supplyToDelete], order.value.date);

              context.emit("update:order", newOrder);
              // after deleting a Supply we should remove it from the editableSupplies
              // so that everything related to editableSupplies (e.g. the computed hasOrderUnsavedModification) works as expected
              editableSupplies.value = makeEditableSupplies(newOrder);
              shouldReloadOrdersAfterModalClosing.value = true;
            }
            Swal.close();
            NotificationService.success(
              t("orders." + "deleteSupplySuccess").toString()
            );
          } catch (error) {
            NotificationService.error(
              t("orders." + "deleteSupplyError").toString()
            );
            throw error;
          }
        }
      });
    };
    const deleteCurrentOrder = () => {
      Swal.fire({
        ...baseOptions,
        title: t("orders.deleteWarningTitle"),
        text: `${t("orders.deleteCurrentOrderWarningText")}
         ${t("orders.deleteCurrentOrderSupplyWarningText")}`,
        confirmButtonText: t("orders.deleteWarningConfirmButton"),
        cancelButtonText: t("orders.deleteWarningCancelButton"),
        cancelButtonColor: "transparent"
      } as never).then(async result => {
        if (result.isConfirmed) {
          try {
            Swal.fire({
              text: t("orders." + "deletionMessage").toString(),
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              onOpen: () => {
                Swal.showLoading();
              }
            });
            await deleteBackendOrder(order.value, currentSite.value.id);
            Swal.close();
            context.emit("reload:page");
            NotificationService.success(
              t("orders." + "deleteSuccess").toString()
            );
          } catch (error) {
            NotificationService.error(
              t("orders." + "deleteOrderError").toString()
            );
            throw error;
          }
        }
      });
    };

    const init = () => {
      makeStepsMessages(order.value.statusId);
      if (order.value.statusId <= ORDER_TYPE_VALUE.VALIDATED) {
        handleEditOrder(true);
      }
    };
    init();
    return {
      order,
      stepsMessages,
      deleting,
      scheduleVisible,
      selectedSupply,
      editableDeliveryDate,
      editableSupplies,
      isUpdatingDate,
      isUpdatingOrder,
      isEditing,
      shouldMerge,
      mergeOrder,
      makeEditableSupplies,
      currentSite,
      view,
      displayId,
      showValidateBtn,
      hasLeadTime,
      hasOrderUnsavedModification,
      modifiedPids,
      formattedDeliveryDate,
      handleEditOrder,
      stepColor,
      revertChanges,
      makeStepsMessages,
      goToSiteSettings,
      goToPlanning,
      closeOrderPlanning,
      handlePlanningSaved,
      disabledDate,
      mergeSupplies,
      updateSupplies,
      warn,
      updateOrder,
      switchOrderStatus,
      closeModalAndReloadIfNeeded,
      quantity,
      deliveryDate,
      suppliesTotalPrice,
      isOrderRespectingFullTruckQuantityConstraint,
      isOrderRespectingMOQConstraint,
      isOrderRespectingOrderFrequencyConstraint,
      isTotalQuantityPrimaryValid,
      isTotalQuantitySecondaryValid,
      deleteCurrentOrder,
      deleteSupply,
      ORDER_TYPE_VALUE,
      editSupplyByProductId,
      modifyDeliveryDate
    };
  }
});
</script>
