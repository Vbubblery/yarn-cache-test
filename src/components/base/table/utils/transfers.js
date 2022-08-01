export const getOptionsForTransfers = options => ({
  isAggregated: options.isAggregated,
  access: options.access
});

export const getTransfersValues = (transfers, options) => {
  return transfers.values.map((value, index) => {
    return {
      value: value,
      isByFlowlity: false,
      status: undefined,
      isFrozen: false,
      isEditable: options.access && !options.isAggregated && index > 0,
      isPast: index === 0
    };
  });
};
