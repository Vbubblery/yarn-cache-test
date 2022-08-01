export const createChartGradient = (canvasContext, startColor, stopColor) => {
  const gradient = canvasContext.createLinearGradient(
    0,
    0,
    0,
    canvasContext.canvas.parentElement.getBoundingClientRect().height - 50
  );
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, stopColor);
  return gradient;
};
