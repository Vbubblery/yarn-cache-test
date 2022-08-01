const drawFreezeZone = chart => {
  var ctx = chart.chart.ctx;
  var chartArea = chart.chartArea;
  const zones = chart.config.options.freezenZones;
  zones.forEach(zone => {
    const meta = chart?.getDatasetMeta(zone.dataset - 1);
    var start = meta.data[zone.start]._model.x;
    var stop = meta.data[zone.end]._model.x;
    ctx.save();
    ctx.fillStyle = zone.color;
    ctx.fillRect(
      start,
      chartArea.top,
      stop - start,
      chartArea.bottom - chartArea.top
    );
    ctx.restore();
  });
};
export default {
  beforeDraw: function (chart) {
    if (chart.config.options.freezenZones) {
      drawFreezeZone(chart);
    }
  }
};
