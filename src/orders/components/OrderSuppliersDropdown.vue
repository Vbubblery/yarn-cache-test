<i18n src="@/i18n/orders.json"></i18n>
<template>
  <div class="flex items-center h-full col-span-2">
    <BaseDropdown
      v-if="!isSupplierView"
      :menu-title="$t('suppliers')"
      :menu-sub-title="orderSupplierSubTitle"
      wrapper-style=" dropdown cursor-pointer"
      title-style="color: #0a6ee3;"
      menu-style="max-w-xs text-xs"
    >
      <template ref="productTags">
        <BaseCheckTable
          key="suppliers-menu"
          :data="ordersSuppliers"
          :selected-items="selectedSuppliers"
          :grid-template="[0, 9, 2]"
          line-item-style="grid grid-cols-12 flex content-center text-xs my-2"
          container-style="m-2"
          :table-style="`${
            ordersSuppliers.length > 5 ? 'h-80 overflow-y-scroll' : ''
          } px-4 py-2 overflow-x-hidden`"
          @handle-select-change="selectSupplier"
        >
          <template #tableSearch>
            <div class="px-2 flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">
                  {{ `${$t("suppliers")} (${ordersSuppliers.length})` }}
                </p>
              </div>
              <div>
                <BaseToggleButton
                  v-if="selectedSuppliers.length >= 1"
                  @click.stop="deselectAllSuppliers"
                >
                  {{ $t("deselectAll") }}
                </BaseToggleButton>
              </div>
            </div>
          </template>
          <template #lineItem="{ item, selectCurrent }">
            <div
              class="cursor-pointer col-span-11 grid grid-cols-11"
              data-testid="order_supplier_dropdown_filter"
              @click="() => selectCurrent(item)"
            >
              <div class="col-span-7 text-xs flex items-center">
                <p class="min-w-0 truncate px-2">
                  {{ item.name }}
                </p>
              </div>
            </div>
          </template>
        </BaseCheckTable>
      </template>
    </BaseDropdown>
  </div>
</template>

<script lang="ts">
import BaseDropdown from "@/components/base/components/BaseDropdown.vue";
import BaseCheckTable from "@/components/base/components/BaseCheckTable.vue";
import {
  computed,
  defineComponent,
  Ref,
  ref,
  SetupContext,
  watch
} from "@vue/composition-api";
import { useBaseResources } from "@/forecasts-review/store";
import BaseToggleButton from "@/components/base/components/button/BaseToggleButton.vue";
import { fetchOrdersSuppliers } from "@/orders/backend";
import { useOrdersSearch } from "@/orders/composables";
import { SupplierDropdownDto } from "@/orders/typings/dto";
import NotificationService from "@/services/notification.service";
import { useI18n } from "vue-i18n-composable";

export default defineComponent({
  name: "OrderSuppliersDropdown",
  components: {
    BaseDropdown,
    BaseToggleButton,
    BaseCheckTable
  },
  emits: [],
  setup: (_, context: SetupContext) => {
    const { t, tc } = useI18n();
    const { currentSite } = useBaseResources(context);
    const isSupplierView = ref(currentSite.value.isSupplierView);
    const {
      updateSelectedSuppliers,
      selectedSuppliers: { value }
    } = useOrdersSearch();
    const ordersSuppliers: Ref<Array<SupplierDropdownDto>> = ref([]);
    const selectedSuppliers = ref<Array<SupplierDropdownDto>>([]);
    const fetchSuppliers = async () => {
      try {
        const suppliers = await fetchOrdersSuppliers(currentSite.value.id);
        ordersSuppliers.value = suppliers || [];
      } catch {
        NotificationService.error(t("orders.updateError"));
      }
    };

    const selectSupplier = (suppliers: Array<{ id: string; name: string }>) => {
      selectedSuppliers.value = suppliers;
      const ids = selectedSuppliers.value.map(
        selectedSupplier => selectedSupplier.id
      );

      updateSelectedSuppliers(ids);
    };
    const orderSupplierSubTitle = computed(() => {
      const selectedSuppliersCount = selectedSuppliers.value.length;
      return selectedSuppliersCount > 0
        ? `${
            selectedSuppliersCount === 1
              ? selectedSuppliers.value[0].name
              : `${tc("selectedSuppliers", selectedSuppliersCount)}
                (${selectedSuppliersCount})`
          }`
        : "";
    });
    const deselectAllSuppliers = () => {
      selectedSuppliers.value = [];
      updateSelectedSuppliers([]);
    };
    fetchSuppliers().then(() => {
      const preSelectedSupplies = value
        .map(id => ordersSuppliers.value.find(supplier => supplier.id === id))
        .filter(Boolean) as Array<SupplierDropdownDto>;
      if (preSelectedSupplies.length > 0) {
        selectedSuppliers.value = preSelectedSupplies;
      }
    });

    watch(currentSite, () => {
      deselectAllSuppliers();
      fetchSuppliers();
    });

    return {
      currentSite,
      ordersSuppliers,
      orderSupplierSubTitle,
      isSupplierView,
      selectedSuppliers,
      selectSupplier,
      deselectAllSuppliers,
      t
    };
  }
});
</script>

<style lang="scss">
.h-80 {
  height: 20rem;
}
.max-w-96 {
  max-width: 25rem;
}
</style>
