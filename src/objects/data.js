import helper from "@/helper/helper";
import colors from "@/colors";

export class Data {
  constructor(model = {}) {
    this._productId = model.productId;
    this._quantity = model.quantity;
    this._source = model.source;
    this._date = model.date;
    this._timestamp = model.timestamp;
    this._supplierId = model.supplierId;
  }

  // Getters
  get productId() {
    return this._productId;
  }
  get quantity() {
    return this._quantity;
  }
  get source() {
    return this._source;
  }
  get date() {
    return this._date;
  }
  get timestamp() {
    return this._timestamp;
  }
  get supplierId() {
    return this._supplierId;
  }

  // Setters
  set productId(productId) {
    this._productId = productId;
  }
  set quantity(quantity) {
    this._quantity = quantity;
  }
  set source(source) {
    this._source = source;
  }
  set date(date) {
    this._date = date;
  }
  set timestamp(timestamp) {
    this._timestamp = timestamp;
  }
  set supplierId(supplierId) {
    this._supplierId = supplierId;
  }

  static create(model) {
    return new Data(model);
  }
  static createListDataFrom(datas) {
    return datas.map(data => new Data(data));
  }

  static filledValuesByDate(filledData) {
    return filledData.reduce((obj, dataPoint) => {
      if (obj[dataPoint.date] === undefined || obj[dataPoint.date] === null) {
        obj[dataPoint.date] = dataPoint.quantity;
      } else {
        obj[dataPoint.date] += dataPoint.quantity;
      }
      return obj;
    }, {});
  }

  static fillBlankPeriodsWithNull(
    submittedProducts,
    selectedPeriods,
    source,
    data
  ) {
    const blankObjectByProduct = Object.values(submittedProducts).reduce(
      (obj, product) => {
        obj[product.id] = selectedPeriods.reduce(
          (blankObjectByPeriod, period) => {
            blankObjectByPeriod[period] = Data.create({
              productId: product.id,
              quantity: null,
              source: source,
              date: period
            });
            return blankObjectByPeriod;
          },
          {}
        );
        return obj;
      },
      {}
    );

    data.map(dataPoint => {
      blankObjectByProduct[dataPoint.productId][dataPoint.date] = dataPoint;
    });

    const filledData = Object.values(blankObjectByProduct)
      .map(product => Object.values(product))
      .flat();

    return filledData;
  }

  static fillBlankPeriodsWithLatestQt(
    submittedProducts,
    selectedPeriods,
    source,
    data,
    latestQtByProduct
  ) {
    const byId = helper.groupBy(data, "productId");
    const byIdByDate = Object.values(byId).reduce((obj, productObj) => {
      obj[productObj[0].productId] = helper.groupBy(productObj, "date");
      return obj;
    }, {});
    const blankObjectByProduct = Object.values(submittedProducts).reduce(
      (obj, product) => {
        let latestQt = latestQtByProduct[product.id];
        obj[product.id] = selectedPeriods.reduce(
          (blankObjectByPeriod, period) => {
            blankObjectByPeriod[period] = Data.create({
              productId: product.id,
              quantity:
                byIdByDate[product.id] === undefined ||
                byIdByDate[product.id][period] === undefined ||
                byIdByDate[product.id][period][0].quantity === null
                  ? latestQt
                  : byIdByDate[product.id][period][0].quantity,
              source: source,
              date: period
            });
            latestQt =
              byIdByDate[product.id] === undefined ||
              byIdByDate[product.id][period] === undefined ||
              byIdByDate[product.id][period][0].quantity === null
                ? latestQt
                : byIdByDate[product.id][period][0].quantity;
            return blankObjectByPeriod;
          },
          {}
        );
        return obj;
      },
      {}
    );
    const filledData = Object.values(blankObjectByProduct)
      .map(product => Object.values(product))
      .flat();
    return filledData;
  }

  static formatDataForDataChart(chartData, sources) {
    const divider = sources.length;
    chartData.datasets.forEach((productData, index) => {
      const colorIndex = Math.floor(index / divider);
      const colorShade = productData.source === "historicalDemand" ? 1 : 3;
      productData.backgroundColor = colors.dataChartColors(
        colorIndex,
        colorShade
      );
      productData.borderColor = colors.dataChartColors(colorIndex, colorShade);
    });
    return chartData;
  }

  static valuesByProductId(data) {
    const byProductId = helper.groupBy(data, "productId");
    const valuesByProductId = Object.values(byProductId).reduce(
      (obj, productData) => {
        const values = productData.map(dataPoint => dataPoint.quantity);
        obj[productData[0].productId] = values;
        return obj;
      },
      {}
    );
    return valuesByProductId;
  }
}
