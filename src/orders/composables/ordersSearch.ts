import { ref, readonly } from "@vue/composition-api";
import { ORDER_TYPE_VALUE } from "@/orders/constants";
import { OrdersByStatusDto } from "@/orders/typings/dto";
import { CustomRangeType } from "@/orders/typings";
import dayjs from "dayjs";
import { fetchOrdersCountByStatus } from "../backend";

const searchKeyword = ref<string>("");
const selectedDateRange = ref<{
  field: CustomRangeType;
  start_date: string;
  end_date: string;
} | null>(null);
const selectedSuppliers = ref<Array<string>>([]);
const selectedOrderType = ref<ORDER_TYPE_VALUE>();
const ordersByStatusCount = ref<OrdersByStatusDto>({
  all: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0
});

export const useOrdersSearch = () => {
  const updateSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword;
  };
  const updateSelectedDateRange = (
    dateRange: {
      field: CustomRangeType;
      startDate?: string;
      endDate?: string;
    } | null
  ) => {
    selectedDateRange.value = !dateRange
      ? null
      : {
          field: dateRange.field,
          start_date: dayjs(dateRange.startDate, "DD M YYYY").format(
            "YYYY-M-DD"
          ),
          end_date: dayjs(dateRange.endDate, "DD M YYYY").format("YYYY-M-DD")
        };
  };
  const updateSelectedSuppliers = (suppliers: Array<string>) => {
    selectedSuppliers.value = suppliers;
  };
  const updateOrderType = (orderType: ORDER_TYPE_VALUE) => {
    selectedOrderType.value = orderType;
  };
  const updateOrdersByStatusCount = (nbOrdersByStatus: OrdersByStatusDto) => {
    ordersByStatusCount.value = nbOrdersByStatus;
  };
  const fetchOrdersByStatus = async (siteId: number) => {
    const ordersByStatus = await fetchOrdersCountByStatus(siteId);
    if (ordersByStatus) updateOrdersByStatusCount(ordersByStatus);
  };
  return {
    searchKeyword: readonly(searchKeyword),
    updateSearchKeyword,
    selectedOrderType: readonly(selectedOrderType),
    updateOrderType,
    ordersByStatusCount: readonly(ordersByStatusCount),
    updateOrdersByStatusCount,
    selectedDateRange: readonly(selectedDateRange),
    updateSelectedDateRange,
    selectedSuppliers: readonly(selectedSuppliers),
    updateSelectedSuppliers,
    fetchOrdersByStatus
  };
};
