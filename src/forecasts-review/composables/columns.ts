import { IColumn } from "@/components/base/components/table/table.types";
import { useI18n } from "vue-i18n-composable";
import { computed } from "@vue/composition-api";

export const useColumns = () => {
  const { t } = useI18n();

  // DEMAND / PLANNING VIEW – PRODUCTS LIST
  const CHECKBOX_COLUMN = computed<IColumn>(() => ({
    key: "checkbox",
    minWidth: 56,
    maxWidth: 56,
    sticky: true
  }));

  const REFERENCE_COLUMN = computed<IColumn>(() => ({
    key: "external_id",
    title: t("forecastsReview.reference") as string,
    minWidth: 160,
    maxWidth: 160,
    sticky: true
  }));

  const PRODUCT_NAME_COLUMN = computed<IColumn>(() => ({
    key: "name",
    title: t("forecastsReview.productName") as string,
    minWidth: 300,
    sticky: true
  }));

  const SUPPLIERS_COLUMN = computed<IColumn>(() => ({
    key: "partners",
    title: t("forecastsReview.supplier") as string,
    minWidth: 200,
    maxWidth: 200
  }));

  const ALERTS_COLUMN = computed<IColumn>(() => ({
    key: "alerts",
    title: t("forecastsReview.alerts") as string,
    minWidth: 200,
    maxWidth: 200
  }));

  // DEMAND / PLANNING VIEW – TAGS LIST
  const TAG_NAME_COLUMN = computed<IColumn>(() => ({
    key: "name",
    title: t("forecastsReview.tagName") as string
  }));

  return {
    CHECKBOX_COLUMN,
    REFERENCE_COLUMN,
    PRODUCT_NAME_COLUMN,
    SUPPLIERS_COLUMN,
    ALERTS_COLUMN,
    TAG_NAME_COLUMN
  };
};
