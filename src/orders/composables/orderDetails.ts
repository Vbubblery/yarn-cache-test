import helper from "@/helper/helper";
import { Order, OrderSupply } from "@/objects/order";
import { computed, ref, Ref } from "@vue/composition-api";

export const useOrderDetails = (
  order: Ref<Order>,
  // reactive map; provide it if you want to have reactive values
  _suppliesQuantities?: Ref<Record<string, number>>
) => {
  const suppliesQuantities =
    _suppliesQuantities && Object.keys(_suppliesQuantities.value).length >= 1
      ? _suppliesQuantities
      : ref(
          Object.fromEntries(
            order.value.supplies.map((s: OrderSupply) => [
              s.productId,
              s.quantity
            ])
          )
        );

  const supplies = computed<OrderSupply[]>(() => {
    return order.value.supplies || [];
  });

  const suppliesQuantity = computed<number>(() =>
    supplies.value.reduce(
      (acc: number, supply: OrderSupply) =>
        acc + suppliesQuantities.value[supply.productId],
      0
    )
  );

  const suppliesTotalPrice = computed<number>(() =>
    supplies.value.reduce(
      (acc: number, supply: OrderSupply) =>
        acc + suppliesQuantities.value[supply.productId] * supply.price,
      0
    )
  );

  const formattedSuppliesTotal = computed<string>(() =>
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(suppliesTotalPrice.value)
  );

  const calculateTotalQuantity = (primary: boolean): number =>
    Math.round(
      supplies.value.reduce((total: number, supply: OrderSupply) => {
        const primaryUnitQuantity = suppliesQuantities.value[supply.productId];
        const secondaryUnitQuantity =
          (primaryUnitQuantity * supply.secondaryUnitValue) /
          supply.defaultUnitValue;
        return total + (primary ? primaryUnitQuantity : secondaryUnitQuantity);
      }, 0) * 100
    ) / 100;

  const quantity = computed<{
    primaryUnitQuantity: number;
    secondaryUnitQuantity: number;
    primaryUnit: string;
    secondaryUnit: string;
  }>(() => {
    const primaryUnitQuantity = calculateTotalQuantity(true);
    const secondaryUnitQuantity = calculateTotalQuantity(false);
    return {
      primaryUnitQuantity,
      secondaryUnitQuantity,
      primaryUnit: supplies.value[0]?.unit || "",
      secondaryUnit: supplies.value[0]?.secondaryUnit || ""
    };
  });

  const deliveryDate = computed<string>(() => {
    return helper.switchDateFormat(
      order.value.date,
      "YYYY-MM-DD",
      "ddd D. M. YYYY"
    );
  });

  const isOrderRespectingFullTruckQuantityConstraint = computed<boolean>(() => {
    if (!order.value.fullTruckQuantity) return true;
    const totalQuantity =
      order.value.fullTruckUnit === quantity.value.primaryUnit
        ? quantity.value.primaryUnitQuantity
        : quantity.value.secondaryUnitQuantity;
    return totalQuantity % order.value.fullTruckQuantity === 0;
  });

  const isOrderRespectingMOQConstraint = computed<boolean>(() => {
    const moq = order.value.minOrderQuantity;
    const unit = order.value.minOrderUnit;
    if (!moq) return true;
    if (["eur", "EUR"].includes(unit)) {
      return suppliesTotalPrice.value >= moq;
    }
    const totalQuantity =
      unit?.toLowerCase() === quantity.value.primaryUnit?.toLowerCase()
        ? quantity.value.primaryUnitQuantity
        : quantity.value.secondaryUnitQuantity;
    return totalQuantity >= moq;
  });

  const isTotalQuantityPrimaryValid = computed<boolean>(() => {
    const primaryUnits = (order.value.supplies || []).map(
      (supply: OrderSupply) => supply.unit
    );
    const primaryUnitsSet = new Set(primaryUnits);
    return (
      primaryUnitsSet.size === 1 &&
      !primaryUnitsSet.has("") &&
      !primaryUnitsSet.has(null)
    );
  });

  const isTotalQuantitySecondaryValid = computed<boolean>(() => {
    const secondaryUnits = (order.value.supplies || []).map(
      (supply: OrderSupply) => supply.secondaryUnit
    );
    const secondaryUnitsSet = new Set(secondaryUnits);
    return (
      secondaryUnitsSet.size === 1 &&
      !secondaryUnitsSet.has("") &&
      !secondaryUnitsSet.has(null)
    );
  });

  const isOrderRespectingOrderFrequencyConstraint = computed<boolean>(() => {
    if (!order.value?.previousOrderDate || !order.value?.orderFrequency)
      return true;
    return (
      helper.dateDiff(order.value.date, order.value.previousOrderDate, "day") >=
      order.value.orderFrequency
    );
  });
  const isOrderWithoutConstraints = computed<boolean>(
    () =>
      !order.value.fullTruckQuantity &&
      !order.value.minOrderQuantity &&
      !order.value.orderFrequency
  );
  const isOrderRespectingAllConstraints = computed<boolean>(() => {
    return (
      isOrderRespectingOrderFrequencyConstraint.value &&
      isOrderRespectingFullTruckQuantityConstraint.value &&
      isOrderRespectingMOQConstraint.value
    );
  });

  const isSupplyRespectingMOQConstraint = (
    aQuantity: number,
    moq: number
  ): boolean => {
    return aQuantity >= moq;
  };

  const isSupplyRespectingLotSizeConstraint = (
    aQuantity: number,
    lotSize: number
  ): boolean => {
    if (typeof lotSize !== "number" || lotSize === 0) return true;
    return aQuantity % lotSize === 0;
  };

  const areSuppliesRespectingAllConstraints = computed<boolean>(() => {
    const areAllSuppliesRespectingMOQ = supplies.value.every(supply => {
      return isSupplyRespectingMOQConstraint(
        suppliesQuantities.value[supply.productId],
        supply.moq
      );
    });

    const areAllRespectingLotSize = supplies.value.every(supply =>
      isSupplyRespectingLotSizeConstraint(
        suppliesQuantities.value[supply.productId],
        supply.lotSize
      )
    );
    return areAllSuppliesRespectingMOQ && areAllRespectingLotSize;
  });

  return {
    supplies,
    quantity,
    deliveryDate,
    suppliesQuantity,
    suppliesTotalPrice,
    formattedSuppliesTotal,
    isTotalQuantityPrimaryValid,
    isTotalQuantitySecondaryValid,
    isOrderRespectingOrderFrequencyConstraint,
    isOrderRespectingFullTruckQuantityConstraint,
    isOrderRespectingMOQConstraint,
    isOrderRespectingAllConstraints,
    isOrderWithoutConstraints,
    areSuppliesRespectingAllConstraints,
    isSupplyRespectingMOQConstraint,
    isSupplyRespectingLotSizeConstraint
  };
};
