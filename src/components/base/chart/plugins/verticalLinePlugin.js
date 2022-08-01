const getLinePosition = (chart, pointIndex, axis) => {
  const meta = chart.getDatasetMeta(0);
  const data = meta.data;
  return data[pointIndex]._model[axis];
};

export const renderVerticalLine = (chartInstance, pointObject) => {
  const lineLeftOffset = getLinePosition(
    chartInstance,
    pointObject.position,
    "x"
  );
  const scale = chartInstance.scales["y-axis-0"];
  const context = chartInstance.chart.ctx;

  context.beginPath();
  if (pointObject.lineDash) {
    context.setLineDash(pointObject.lineDash);
  }
  context.strokeStyle = pointObject.strokeStyle;
  context.moveTo(lineLeftOffset, scale.top);
  context.lineTo(lineLeftOffset, scale.bottom);
  context.stroke();

  // write label
  context.fillStyle = pointObject.fillStyle;
  context.textAlign = pointObject.textAlign || "center";
  context.fillText(
    pointObject.label,
    lineLeftOffset,
    scale.bottom - scale.top + scale.top + 17
  );
};
export const renderHorizontalLine = (chartInstance, pointObject) => {
  const context = chartInstance.chart.ctx;
  context.beginPath();
  if (pointObject.lineDash) {
    context.borderColor = "black";
    context.setLineDash(pointObject.lineDash);
  }
  context.moveTo(30, 250);
  context.lineTo(600, 250);
  context.stroke();

  context.fillStyle = pointObject.fillStyle;
  context.textAlign = "center";
};

export default {
  afterDatasetsDraw: function (chart) {
    if (chart.config.options.lineAtIndex) {
      chart.config.options.lineAtIndex.forEach(pointIndex => {
        renderVerticalLine(chart, pointIndex);
        if (pointIndex.horizontalDisplay)
          renderHorizontalLine(chart, pointIndex);
      });
    }
  }
};
