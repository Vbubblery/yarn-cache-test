export const legendPlugin = {
  afterLayout: function (chart) {
    chart.legend.legendItems.forEach(label => {
      return label;
    });
  }
};
