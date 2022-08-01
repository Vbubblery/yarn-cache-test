import { ORDER_TYPE_VALUE } from "@/orders/constants";

export type OrdersByStatusDto = Record<"all" | ORDER_TYPE_VALUE, number>;
