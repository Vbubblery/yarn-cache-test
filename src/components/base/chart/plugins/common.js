export const hideLegend = (legendItem, data) => {
  var index = legendItem.datasetIndex;
  var currentDataValue = data.datasets[index];
  if (!currentDataValue.hideLegend) {
    return true;
  }
};

export const fillCaptions = (captions, ctx) => {
  captions.forEach(caption => {
    caption.contents.forEach((content, index) => {
      ctx.textAlign = "center";
      ctx.font = "black";
      ctx.fillText(content, caption.x, caption.y + index * 15);
    });
  });
};
