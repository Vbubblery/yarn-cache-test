<i18n src="@/i18n/orders.json"></i18n>
<template>
  <div
    :class="`${
      selectedTimeRangeType === 'deliveryDate' ? 'w-[870px]' : 'w-[580px]'
    } h-[360px] bg-white`"
  >
    <div
      :class="`grid ${
        selectedTimeRangeType === 'deliveryDate' ? 'grid-cols-3' : 'grid-cols-2'
      } gap-2 h-full`"
    >
      <div class="border-r-2 border-gray-300">
        <div class="h-full text-sm p-2 flex flex-col justify-between">
          <div>
            <BaseLabel
              :active="selectedTimeRangeType === 'lastOrderDate'"
              icon="arrow-right-s-line"
              icon-position="right"
              @click="() => setTimeRangeType('lastOrderDate')"
            >
              {{ $t("latestOrderDate") }}
            </BaseLabel>
            <BaseLabel
              :active="selectedTimeRangeType === 'deliveryDate'"
              icon="arrow-right-s-line"
              icon-position="right"
              @click="() => setTimeRangeType('deliveryDate')"
            >
              {{ $t("deliveryDate") }}
            </BaseLabel>
          </div>

          <BaseButton
            v-if="!isEmpty(dateRange)"
            type="secondary"
            class="w-full"
            @click="resetRangeSelection"
          >
            {{ $t("reset") }}
          </BaseButton>
        </div>
      </div>
      <div
        :class="selectedTimeRangeType === 'deliveryDate' ? 'col-span-2' : ''"
      >
        <div
          v-if="selectedTimeRangeType === 'deliveryDate'"
          class="gap-2 h-full w-full p-2"
        >
          <div>
            <date-picker
              :open="true"
              type="date"
              range
              :append-to-body="false"
              value-type="DD M YYYY"
              :clearable="false"
              :popup-style="{
                left: 0,
                top: ' 100%',
                marginTop: '10px',
                boxShadow: 'none',
                border: 'none'
              }"
              @change="date => handleInputChange(date)"
            >
              <template #icon-calendar></template>
              <template #input
                ><div class="text-center border-b border-blue-600 pb-1">
                  {{ displayDates.startDate }} ~ {{ displayDates.endDate }}
                </div></template
              >
            </date-picker>
          </div>
        </div>
        <div v-else class="p-2">
          <div
            v-for="customRange in customRanges"
            :key="customRange.key"
            :data-testid="`order_latest_order_date_custom_filter_${customRange.key}`"
            class="w-full"
          >
            <BaseLabel
              :active="customRange.key === selectedCustomRange"
              :icon="
                customRange.key === selectedCustomRange ? 'check-line' : ''
              "
              icon-position="right"
              @click="() => setCustomRange(customRange)"
            >
              {{ $t(customRange.label) }}
            </BaseLabel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/fr";
import BaseLabel from "@/components/base/components/BaseLabel.vue";
import {
  computed,
  defineComponent,
  reactive,
  Ref,
  ref,
  watch
} from "@vue/composition-api";
import dayjs from "@/dayjs";
import { isEmpty } from "lodash";
import { useOrdersSearch } from "@/orders/composables";
import { DateRangeType, CustomRangeType } from "@/orders/typings";
import BaseButton from "@/components/base/components/button/BaseButton.vue";

export default defineComponent({
  name: "OrderCalendarRangePicker",
  components: { BaseButton, BaseLabel, DatePicker },
  emits: [],
  setup: () => {
    const customRanges = reactive([
      {
        key: "1week",
        label: "thisWeek",
        dateRange: {
          startDate: dayjs().startOf("week").format("DD M YYYY"),
          endDate: dayjs().endOf("week").format("DD M YYYY")
        }
      },
      {
        key: "2weeks",
        label: "in2Weeks",
        dateRange: {
          startDate: dayjs().format("DD M YYYY"),
          endDate: dayjs().add(2, "week").endOf("week").format("DD M YYYY")
        }
      },
      {
        key: "1month",
        label: "in1month",
        dateRange: {
          startDate: dayjs().format("DD M YYYY"),
          endDate: dayjs().add(1, "month").endOf("month").format("DD M YYYY")
        }
      },
      {
        key: "2months",
        label: "in2months",
        dateRange: {
          startDate: dayjs().format("DD M YYYY"),
          endDate: dayjs().add(2, "month").endOf("month").format("DD M YYYY")
        }
      },
      {
        key: "3months",
        label: "in3months",
        dateRange: {
          startDate: dayjs().format("DD M YYYY"),
          endDate: dayjs().add(3, "month").endOf("month").format("DD M YYYY")
        }
      }
    ]);
    const { selectedDateRange, updateSelectedDateRange } = useOrdersSearch();
    const selectedCustomRange: Ref<string | null> = ref("");
    const dateRange = ref<DateRangeType>({});

    // Set up with the composable date
    if (selectedDateRange.value?.field === "lastOrderDate") {
      const curCustomRange = customRanges.filter(
        range =>
          dayjs(range.dateRange.startDate, "DD M YYYY").isSame(
            dayjs(selectedDateRange.value?.start_date)
          ) &&
          dayjs(range.dateRange.endDate, "DD M YYYY").isSame(
            dayjs(selectedDateRange.value?.end_date)
          )
      )[0];
      selectedCustomRange.value = curCustomRange.key;
    } else {
      const curSelectedDateRange = ref(
        selectedDateRange.value
          ? {
              startDate: dayjs(selectedDateRange.value?.start_date).format(
                "DD M YYYY"
              ),
              endDate: dayjs(selectedDateRange.value?.end_date).format(
                "DD M YYYY"
              )
            }
          : {}
      );
      dateRange.value = curSelectedDateRange.value;
    }

    const selectedTimeRangeType: Ref<CustomRangeType> = ref(
      selectedDateRange.value?.field || "lastOrderDate"
    );
    const setTimeRangeType = (option: CustomRangeType) =>
      (selectedTimeRangeType.value = option);
    const setCustomRange = (customRange: {
      key: string;
      dateRange: DateRangeType;
    }) => {
      selectedCustomRange.value = customRange.key;
      dateRange.value = customRange.dateRange;
    };
    const handleInputChange = (newDates: Array<string>) => {
      const [startDate, endDate] = newDates;
      dateRange.value = {
        startDate,
        endDate
      };
      selectedCustomRange.value = null;
    };
    const resetRangeSelection = () => {
      selectedCustomRange.value = "";
      selectedTimeRangeType.value = "lastOrderDate";
      dateRange.value = {};
    };
    const displayDates = computed(() => ({
      ...(dateRange.value.startDate && {
        startDate: dayjs(dateRange.value.startDate, "DD M YYYY").format(
          "DD.MM.YYYY"
        )
      }),
      ...(dateRange.value.endDate && {
        endDate: dayjs(dateRange.value.endDate, "DD M YYYY").format(
          "DD.MM.YYYY"
        )
      })
    }));
    watch(dateRange, () => {
      if (
        (dateRange.value?.startDate && dateRange.value.endDate) ||
        isEmpty(dateRange.value)
      ) {
        updateSelectedDateRange(
          isEmpty(dateRange.value)
            ? null
            : {
                ...dateRange.value,
                field: selectedTimeRangeType.value
              }
        );
      }
    });
    return {
      isEmpty,
      selectedTimeRangeType,
      customRanges,
      selectedCustomRange,
      dateRange,
      displayDates,
      setTimeRangeType,
      setCustomRange,
      handleInputChange,
      resetRangeSelection
    };
  }
});
</script>
<style lang="scss" src="@/assets/styles/calendar.scss" />
