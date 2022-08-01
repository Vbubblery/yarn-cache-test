<i18n src="@/i18n/orders.json"></i18n>
<template>
  <div>
    <div class="h-14 p-2 mb-1 flex border-b">
      <div class="w-6 max-w-6" />

      <div class="text-center items-center justify-start flex pl-2">
        <input
          data-testid="select_all_orders_checkbox"
          type="checkbox"
          class="ml-2 h-4 w-4"
          :checked="selectAll"
          @change="selectAllOrders(!selectAll)"
        />

        <ADropdown
          :trigger="['click']"
          :placement="`bottomLeft`"
          data-testid="select_all_orders_dropdown"
        >
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <BaseSVG name="arrow-down-s-fill" class="text-gray-500" />
          </a>
          <template #overlay>
            <div class="bg-white shadow-lg py-2 mt-3">
              <div class="px-4 py-2">
                <a @click="selectAllOrders(true)">
                  {{ $t("select_all") }} (visible)
                </a>
              </div>
              <div
                v-if="!!selectedOrders.length || selectAll"
                class="px-4 py-2"
              >
                <a @click="selectAllOrders(false)">
                  {{ $t("deselect_all") }}
                </a>
              </div>
              <div
                v-if="
                  !!selectedOrders.length && availableActions.includes('delete')
                "
                class="border-t px-4 py-2"
              >
                <a
                  data-testid="select_dropdown_delete"
                  class="flex items-center space-x-1"
                  @click="deleteSelected"
                >
                  <BaseSVG name="delete-bin-fill" size="20" />
                  <span>
                    {{ $t("deleteSelected") }} ({{ selectedOrders.length }})
                  </span>
                </a>
              </div>
            </div>
          </template>
        </ADropdown>
      </div>
      <div
        class="grid grid-cols-9 gap-2 content-center text-xs w-full text-gray-600"
      >
        <div
          v-if="!!selectedOrders.length"
          data-testid="selected_orders_actions"
          class="col-span-6 grid grid-flow-col auto-cols-max gap-4"
        >
          <ADivider
            type="vertical"
            style="height: 30px; border-color: #7cb305"
            class="m-auto"
          />

          <div class="m-auto">
            <span>
              {{ $tc("orders.selected_orders", selectedOrders.length) }}:
              <span class="font-bold">{{ selectedOrders.length }}</span>
            </span>
          </div>
          <BaseButton
            v-if="availableActions.includes(ORDER_ACTION_TYPE.UNCONFIRMED)"
            type="secondary"
            data-testid="order_discard_button"
            @click="discardSelectedOrders"
          >
            {{ $t("orders.orderDiscard") }}
          </BaseButton>

          <BaseButton
            v-if="availableActions.includes(ORDER_ACTION_TYPE.EXPORT)"
            type="secondary"
            icon="download-2-line"
            data-testid="download_exports_orders_page"
            @click="downloadSelected"
          >
            {{ $t("download_selected") }}
          </BaseButton>

          <BaseButton
            v-if="availableActions.includes(ORDER_ACTION_TYPE.CONFIRM)"
            icon="check-line"
            data-testid="order_confirm_button"
            @click="acceptSelectedOrders"
          >
            {{ $t("orders.orderConfirm") }}
          </BaseButton>

          <BaseButton
            v-if="
              availableActions.includes(ORDER_ACTION_TYPE.EXPORT_SFTP) &&
              company.allowSftpExport
            "
            icon="upload-cloud-2-fill"
            @click="sftpSelected"
          >
            {{ $t("sftp_selected") }}
          </BaseButton>
          <BaseButton
            v-if="availableActions.includes('upload')"
            :icon="{
              name: 'cloud-upload-alt',
              position: 'left'
            }"
            data-testid="upload_exports_orders_page"
            secondary
            @click="uploadSelected"
          >
            {{ $t("upload_selected") }}
          </BaseButton>
        </div>
        <template v-else>
          <div class="col-span-1 py-2 px-4">
            {{
              $t(
                [1, 2].includes(selectedOrderType) ? "temporary_id" : "order_id"
              )
            }}
          </div>
          <div
            v-if="[1, 2].includes(selectedOrderType)"
            class="col-span-1 py-2 flex items-center"
          >
            {{ $t("lastOrderDate") }}
            <a
              data-testid="change_sort_button"
              @click="changeOrderSort(!sortAsc)"
            >
              <BaseSVG
                v-if="sortAsc"
                name="arrow-up-line"
                size="15"
                class="text-gray-600"
              />
              <BaseSVG
                v-else
                name="arrow-down-line"
                class="text-gray-600"
                size="15"
              />
            </a>
          </div>
          <div class="col-span-1 py-2">
            {{ $t("date") }}
          </div>
          <div class="py-2" :class="supplierHeadingClass">
            {{
              $t(
                currentSite.isSupplierView
                  ? "orders.customer.display"
                  : "orders.supplier.display"
              )
            }}
          </div>
          <div class="col-span-1 py-2 text-right px-4">
            {{ $t("orders.includesItems") }}
          </div>
          <div class="col-span-1 py-2 text-right px-6">
            {{ $t("orders.price") }}
          </div>
          <div class="col-span-1 py-2 text-right px-6">
            {{ $t("orders.volume") }}
          </div>
          <div
            v-if="showSFTPExportDateColumn"
            class="col-span-1 py-2 text-right px-6"
          >
            {{ $t("orders.sftp_exported") }}
          </div>
        </template>
      </div>
    </div>

    <OrderModal
      v-if="modalViewOrder"
      key="orderViewModal"
      :visible="!!modalViewOrder"
      :order-prop="modalViewOrder"
      :should-display-actions="displayActions"
      :available-actions="availableActions"
      :date-label-to-display="fieldToSort"
      @close:modal="closeModalAndReloadIfNeeded"
      @reload:page="reloadPage"
      @update:order="updateOrder"
    />
    <BasePaginatedLoadingList
      :api-service="apiService"
      :endpoint="endpoint"
      :reload="reload"
      :before-paginate="transform"
      :base-filters="ordersFilter"
      :custom-items="stateOrders"
      @itemsProcessed="handleProcessedOrders"
    >
      <template #loading="{ loading }">
        <div v-if="loading" class="flex justify-center">
          <BaseDotLoader />
        </div>
      </template>
      <template #error="{ error }">
        <div v-if="error" class="text-center">
          {{ error }}
        </div>
      </template>
      <template #nodata>
        <div class="text-center py-12 text-xl" :data-testid="`orders_no_data`">
          {{ $t("noOrders") }}
        </div>
      </template>
      <template #listItem="{ listItem: order }">
        <OrderListItem
          :key="order.id"
          :data-testid="`order_line_item_${order.id}`"
          :order="order"
          :orders-list="stateOrders"
          :is-selected="selectAll || selectedOrders.includes(order.id)"
          :should-display-actions="displayActions"
          :available-actions="availableActions"
          :order-type-value="selectedOrderType"
          :date-label-to-display="fieldToSort"
          @reload:page="reloadPage"
          @select:order="selectOrderById"
          @update:viewItem="updateModalViewOrder"
        />
      </template>
    </BasePaginatedLoadingList>
  </div>
</template>

<script lang="ts">
import { Order } from "@/objects/order";
import { Site } from "@/objects/site";
import SupervisorService from "@/services/supervisor.service";
import OrderModal from "@/orders/components/OrderModal.vue";
import {
  defineComponent,
  SetupContext,
  ref,
  computed,
  watch
} from "@vue/composition-api";
import { useOrdersSearch } from "@/orders/composables";
import { ORDER_ACTION_TYPE, ORDER_TYPE_VALUE } from "@/orders/constants";
import { OrderFieldSort, OrdersFilters } from "@/orders/typings";
import SftpService from "@/services/sftp.service";
import NotificationService from "@/services/notification.service";
import OrderService from "@/services/order.service";
import {
  updateOrderStatus,
  deleteBackendOrder,
  sendOrdersToApi
} from "@/orders/backend";
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from "sweetalert2";
import { baseOptions } from "@/sweetalert";
import { Company } from "@/objects/company";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import { Dropdown, Divider } from "ant-design-vue";
import OrderListItem from "@/orders/components/OrderListItem.vue";
import BasePaginatedLoadingList from "@/components/contents/common/BasePaginatedLoadingList.vue";
import BaseDotLoader from "@/components/contents/common/BaseDotLoader.vue";
import { useI18n } from "vue-i18n-composable";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

const redirectURI = encodeURIComponent(
  `${location.origin}/oauth/cartier/callback`
);
const ORDERS_UPLOAD_API_URL = `https://rlg-ric-test-val.apigee.net/oauth2/auth?response_type=code&client_id=c6kpBe7Arho0xqMuBIRWWgAjRHVmid4f&scope=openid&redirect_uri=${redirectURI}`;

export default defineComponent({
  name: "OrdersList",
  components: {
    BaseButton,
    ADropdown: Dropdown,
    ADivider: Divider,
    BasePaginatedLoadingList,
    BaseDotLoader,
    OrderModal,
    OrderListItem,
    BaseSVG
  },
  setup(_, context: SetupContext) {
    const { t } = useI18n();
    const { $store: store } = context.root;
    // @ts-expect-error
    // NOSONAR
    const { $auth: AuthService } = context.root;
    const currentSite = computed<Site>(
      () => store.getters["common/getCurrentSite"]
    );
    const company = computed<Company>(() => store.getters["common/getCompany"]);
    const selectedOrders = ref<Array<string>>([]);
    const stateOrders = ref<Array<Order>>([]);
    const selectAll = ref<boolean>(false);
    const apiService = SupervisorService;
    const sortAsc = ref<boolean>(true);
    const reload = ref<boolean>(false);
    const {
      selectedOrderType,
      ordersByStatusCount,
      searchKeyword,
      selectedSuppliers,
      selectedDateRange,
      updateOrdersByStatusCount,
      fetchOrdersByStatus
    } = useOrdersSearch();

    const endpoint = computed<string>(
      () => `/api/v1/sites/${currentSite.value.id}/orders`
    );
    const modalViewOrder = ref<Order | null>(null);
    const fieldToSort = computed<OrderFieldSort>(() => {
      if (
        [ORDER_TYPE_VALUE.PLANNED, ORDER_TYPE_VALUE.VALIDATED].includes(
          selectedOrderType.value!
        ) &&
        !currentSite.value.isSupplierView
      ) {
        return "send_before";
      } else {
        return "ship_before";
      }
    });
    const dateRange = computed(() => {
      return selectedDateRange.value ? selectedDateRange.value : {};
    });
    const ordersFilter = computed<OrdersFilters>(() => ({
      page: 1,
      filter: selectedOrderType.value,
      sort: {
        field: fieldToSort.value,
        order: sortAsc.value ? "asc" : "desc"
      },
      ...(selectedDateRange.value ? { date_range: dateRange.value } : {}),
      suppliers_ids: selectedSuppliers.value,
      keyword_search: searchKeyword.value
    }));
    const displayActions = computed<boolean>(() => {
      return (
        !!selectedOrderType.value &&
        Object.values(ORDER_TYPE_VALUE).includes(selectedOrderType.value)
      );
    });
    const availableActions = computed<ORDER_ACTION_TYPE[]>(() => {
      const getActionsForOrders = () => {
        switch (selectedOrderType.value) {
          case !currentSite.value.isSupplierView && ORDER_TYPE_VALUE.PLANNED:
            return [
              ORDER_ACTION_TYPE.EXPORT,
              ORDER_ACTION_TYPE.DELETE,
              ORDER_ACTION_TYPE.CONFIRM
            ];
          case !currentSite.value.isSupplierView && ORDER_TYPE_VALUE.VALIDATED:
            return [
              ORDER_ACTION_TYPE.UNCONFIRMED,
              ORDER_ACTION_TYPE.EXPORT,
              ORDER_ACTION_TYPE.EXPORT_SFTP,
              ORDER_ACTION_TYPE.DELETE
            ];
          case ORDER_TYPE_VALUE.PLANNED:
          case ORDER_TYPE_VALUE.PURCHASE_ORDER:
          case ORDER_TYPE_VALUE.DELIVERED:
          case ORDER_TYPE_VALUE.SALES_ORDER:
            return [ORDER_ACTION_TYPE.EXPORT];
          case ORDER_TYPE_VALUE.VALIDATED:
            return [ORDER_ACTION_TYPE.EXPORT_SFTP];
          default:
            return [];
        }
      };
      const result = getActionsForOrders();
      const CARTIER_COMPANY_ID = 206;
      if (company.value.id === CARTIER_COMPANY_ID) {
        result.push(ORDER_ACTION_TYPE.UPLOAD);
      }
      return result;
    });

    const showSFTPExportDateColumn = computed<boolean>(() => {
      return (
        !currentSite.value.isSupplierView &&
        selectedOrderType.value === ORDER_TYPE_VALUE.VALIDATED &&
        company.value.allowSftpExport
      );
    });

    const supplierHeadingClass = computed<string>(() => {
      const isTemporaryStatus = [
        ORDER_TYPE_VALUE.PLANNED,
        ORDER_TYPE_VALUE.VALIDATED
      ].includes(selectedOrderType?.value ?? ORDER_TYPE_VALUE.PLANNED);

      if (isTemporaryStatus) {
        return showSFTPExportDateColumn.value ? "col-span-2" : "col-span-3";
      } else {
        return showSFTPExportDateColumn.value ? "col-span-3" : "col-span-4";
      }
    });

    const updateStateOrders = (orders: Array<Order>) => {
      stateOrders.value = orders;
    };

    const deleteStateOrder = (orderId: number) => {
      stateOrders.value = stateOrders.value.filter(o => o.id !== orderId);
      if (selectedOrderType.value) {
        updateOrdersByStatusCount({
          ...ordersByStatusCount.value,
          [selectedOrderType.value]:
            ordersByStatusCount.value[selectedOrderType.value] - 1
        });
      }
    };

    const deleteOrder = async (orderId: number) => {
      const order = stateOrders.value.find(o => o.id === orderId);
      deleteStateOrder(orderId);
      if (order) await deleteBackendOrder(order, currentSite.value.id);
    };

    const selectOrderById = ({ id }: { id: string }) => {
      const pos = selectedOrders.value.findIndex(
        (element: string) => element === id
      );
      if (pos === -1) {
        selectedOrders.value.push(id);
        if (selectedOrders.value.length === stateOrders.value.length)
          selectAll.value = true;
      } else {
        selectedOrders.value = selectedOrders.value.filter(
          (value: string) => value !== id
        );
        selectAll.value = false;
      }
    };
    const selectAllOrders = (status: boolean) => {
      selectAll.value = status;
      selectedOrders.value = status
        ? stateOrders.value.map((order: Order) => order.id)
        : [];
    };
    const changeOrderSort = (status: boolean) => (sortAsc.value = status);
    const sftpSelected = () => {
      SftpService.exportOrderToSftp({
        site_ids: [currentSite.value.id],
        order_ids: selectedOrders.value,
        is_supplier_view: currentSite.value.isSupplierView
      })
        .then((res: { status: number }) => {
          if (res.status === 200) {
            NotificationService.success(t("orders.sftpSuccess"));
          } else {
            NotificationService.error(t("orders.sftpError"));
          }
        })
        .catch(() => {
          NotificationService.error(t("orders.sftpError"));
        });
    };
    const downloadSelected = async () => {
      const orders = stateOrders.value.filter((order: Order) =>
        selectedOrders.value.includes(order.id)
      );
      await SupervisorService.exportFile(
        [{ key: currentSite.value.id, label: currentSite.value.name }],
        orders,
        "csv",
        currentSite.value.isSupplierView ? "salesOrders" : "purchaseOrders",
        "",
        null,
        null,
        null
      );
    };
    const uploadSelected = async () => {
      const companyOrdersApiToken = localStorage.getItem(
        `${company.value.name.toLowerCase()}OrdersApiToken`
      );
      const ordersToUpload = stateOrders.value.filter((order: Order) =>
        selectedOrders.value.includes(order.id)
      );
      if (
        companyOrdersApiToken &&
        new Date().getTime() <
          new Date(
            AuthService.parseJwt(companyOrdersApiToken).exp * 1000
          ).getTime()
      ) {
        await sendOrdersToApi(
          currentSite.value,
          ordersToUpload,
          companyOrdersApiToken
        );
        NotificationService.success("Orders sent successfully");
      } else {
        window.location.href = ORDERS_UPLOAD_API_URL;
      }
    };
    const transform = (rawOrders: Array<Order>) => {
      const orders = rawOrders.map(order => {
        const formattedOrder = Order.create(order);
        OrderService.updateOrderLatestDate(formattedOrder);
        return formattedOrder;
      });
      return orders;
    };
    const reloadPage = async () => {
      await fetchOrdersByStatus(currentSite.value.id);
      reload.value = true;
    };
    const handleProcessedOrders = (orders: Array<Order>) => {
      updateStateOrders(orders);
      reload.value = false;
    };
    const updateOrder = (order: Order) => {
      updateStateOrders(
        stateOrders.value.map(stateOrder =>
          stateOrder.id === order.id ? order : stateOrder
        )
      );
      modalViewOrder.value = order;
    };
    const deleteSelected = async () => {
      Swal.fire({
        ...baseOptions,
        title: t("deleteWarningTitle").toString(),
        text: t("deleteOrdersWarningText").toString(),
        confirmButtonText: t("deleteWarningConfirmButton").toString(),
        cancelButtonText: t("deleteWarningCancelButton").toString(),
        cancelButtonColor: "transparent"
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            await Promise.all(
              selectedOrders.value.map((orderId: string) =>
                deleteOrder(+orderId)
              )
            );
          } catch (error: unknown) {
            NotificationService.error((error as Error).message);
            throw error;
          }
          selectedOrders.value = [];
          reloadPage();
        }
      });
    };
    const updateModalViewOrder = (orderId: string) => {
      modalViewOrder.value =
        stateOrders.value.find(order => order.id === orderId) ?? null;
    };
    const closeModalAndReloadIfNeeded = (options: {
      shouldReloadOrdersAfterModalClosing: boolean;
    }) => {
      modalViewOrder.value = null;
      if (options.shouldReloadOrdersAfterModalClosing) reloadPage();
    };

    const acceptSelectedOrders = async () => {
      try {
        await Promise.all(
          selectedOrders.value.map(orderId =>
            updateOrderStatus(
              {
                id: orderId,
                statusId: ORDER_TYPE_VALUE.VALIDATED
              },
              currentSite.value.id
            )
          )
        );
        await fetchOrdersByStatus(currentSite.value.id);
        reloadPage();
        NotificationService.success(t("orders.orderConfirmSuccess"));
      } catch (error) {
        NotificationService.error(t("orders.orderConfirmError"));
        throw error;
      }
    };
    const discardSelectedOrders = async () => {
      try {
        await Promise.all(
          selectedOrders.value.map(orderId =>
            updateOrderStatus(
              {
                id: orderId,
                statusId: ORDER_TYPE_VALUE.PLANNED
              },
              currentSite.value.id
            )
          )
        );
        reloadPage();
        NotificationService.success(t("orders.orderConfirmSuccess"));
      } catch (error) {
        NotificationService.error(t("orders.orderConfirmError"));
        throw error;
      }
    };
    watch(selectedOrderType, () => {
      selectAll.value = false;
      selectedOrders.value = [];
    });
    watch(stateOrders, () => {
      selectAll.value = false;
      selectedOrders.value = [];
    });

    return {
      updateOrder,
      modalViewOrder,
      closeModalAndReloadIfNeeded,
      apiService,
      endpoint,
      reload,
      transform,
      ordersFilter,
      stateOrders,
      handleProcessedOrders,
      selectAll,
      displayActions,
      availableActions,
      selectedOrderType,
      fieldToSort,
      reloadPage,
      selectOrderById,
      selectAllOrders,
      selectedOrders,
      deleteSelected,
      company,
      sftpSelected,
      downloadSelected,
      uploadSelected,
      sortAsc,
      currentSite,
      changeOrderSort,
      updateModalViewOrder,
      acceptSelectedOrders,
      discardSelectedOrders,
      ORDER_ACTION_TYPE,
      ORDER_TYPE_VALUE,
      showSFTPExportDateColumn,
      supplierHeadingClass
    };
  }
});
</script>
