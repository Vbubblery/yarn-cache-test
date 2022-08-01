<i18n src="@/i18n/orders.json"></i18n>
<template>
  <div class="flex items-center h-full col-span-2 px-2">
    <BaseDropdown
      v-if="!isSupplierView"
      :menu-title="formattedTitle"
      :menu-sub-title="formattedSubTitle"
      wrapper-style="max-w-6xl dropdown cursor-pointer border-l"
      title-style="color: #0a6ee3;"
      menu-style="text-xs"
    >
      <OrderCalendarRangePicker v-on="$listeners" />
    </BaseDropdown>
  </div>
</template>

<script lang="ts">
import BaseDropdown from "@/components/base/components/BaseDropdown.vue";
import OrderCalendarRangePicker from "@/orders/components/OrderCalendarRangePicker.vue";
import {
  computed,
  defineComponent,
  Ref,
  ref,
  SetupContext
} from "@vue/composition-api";
import { useBaseResources } from "@/forecasts-review/store";
import { fetchOrdersSuppliers } from "@/orders/backend";
import { useOrdersSearch } from "@/orders/composables";
import dayjs from "@/dayjs";
import { SupplierDropdownDto } from "@/orders/typings/dto";
import NotificationService from "@/services/notification.service";
import { useI18n } from "vue-i18n-composable";

export default defineComponent({
  name: "OrderTimelinePicker",
  components: {
    BaseDropdown,
    OrderCalendarRangePicker
  },
  setup: (_, context: SetupContext) => {
    const { t } = useI18n();
    const { currentSite } = useBaseResources(context);
    const isSupplierView = ref(currentSite.value.isSupplierView);
    const selectedSuppliers = ref([]);

    const { selectedDateRange } = useOrdersSearch();
    const formattedTitle = computed(() =>
      selectedDateRange.value?.start_date
        ? t(selectedDateRange.value?.field)
        : t("dateRange")
    );
    const formattedSubTitle = computed(() =>
      selectedDateRange.value?.start_date
        ? `${dayjs(selectedDateRange.value.start_date).format(
            "DD.MM.YY"
          )} - ${dayjs(selectedDateRange.value.end_date).format("DD.MM.YY")}`
        : ""
    );
    const ordersSuppliers: Ref<Array<SupplierDropdownDto>> = ref([]);
    const fetchSuppliers = async () => {
      try {
        ordersSuppliers.value =
          (await fetchOrdersSuppliers(currentSite.value.id)) || [];
      } catch {
        NotificationService.error(t("orders.updateError"));
      }
    };
    fetchSuppliers();
    return {
      currentSite,
      ordersSuppliers,
      formattedTitle,
      formattedSubTitle,
      isSupplierView,
      selectedSuppliers
    };
  }
});
</script>
