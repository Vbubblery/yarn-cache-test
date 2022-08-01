import { validate } from "jsonschema";
import OrderSchema, { orderSupplySchema } from "@/schemas/order";

export class OrderSupply {
  constructor(model = {}) {
    this._model = model;
    this._id = model.id;
    this._productId = model.product_site;
    this._externalId = model.external_id;
    this._isDefaultUnit = model.is_default_unit;
    this._defaultUnitValue = model.default_unit_value;
    this._quantity = model.quantity;
    this._secondaryUnitValue = model.second_unit_value;
    this._secondaryUnitQuantity = model.second_unit_quantity;
    this._orderId = model.order;
    this._name = model.name;
    this._unit = model.unit;
    this._secondaryUnit = model.second_unit;
    this._leadTime = model.lead_time;
    this._price = model.product_price;
    this._totalPrice = model.total_price;
    this._moq = model.moq;
    this._description = model.description;
    this._lotSize = model.lot_size;
    this._stockAtEndOfPeriod = model.stock_at_end_of_period;
    this._minStockAtEndOfPeriod = model.minimum_stock_at_end_of_period;
    this._totalDemand = model.total_demand;
  }
  static create(model) {
    return validate(model, OrderSupply.schema())
      ? new OrderSupply(model)
      : null;
  }

  static schema() {
    return orderSupplySchema;
  }

  get externalId() {
    return this._externalId;
  }

  get defaultUnitValue() {
    return this._defaultUnitValue;
  }

  get secondaryUnitValue() {
    return this._secondaryUnitValue;
  }

  get secondaryUnitQuantity() {
    return this._secondaryUnitQuantity;
  }

  get secondaryUnit() {
    return this._secondaryUnit;
  }

  get moq() {
    return this._moq;
  }

  get description() {
    return this._description;
  }

  get lotSize() {
    return this._lotSize;
  }

  get id() {
    return this._id;
  }

  get productId() {
    return this._productId;
  }

  get quantity() {
    return this._quantity;
  }

  get orderId() {
    return this._orderId;
  }

  get name() {
    return this._name;
  }

  get unit() {
    return this._unit;
  }

  get leadTime() {
    return this._leadTime;
  }

  get price() {
    return this._price;
  }

  get totalPrice() {
    return this._totalPrice;
  }

  get isDefaultUnit() {
    return this._isDefaultUnit;
  }

  get minStockAtEndOfPeriod() {
    return this._minStockAtEndOfPeriod;
  }
  get stockAtEndOfPeriod() {
    return this._stockAtEndOfPeriod;
  }
  get totalDemand() {
    return this._totalDemand;
  }
  set id(id) {
    this._id = id;
  }

  set productId(productId) {
    this._productId = productId;
  }

  set orderId(orderId) {
    this._orderId = orderId;
  }

  set quantity(quantity) {
    this._quantity = quantity;
  }

  set name(name) {
    this._name = name;
  }

  set unit(unit) {
    this._unit = unit;
  }

  set leadTime(leadTime) {
    this._leadTime = leadTime;
  }
  set totalPrice(totalPrice) {
    this._totalPrice = totalPrice;
  }

  add(otherSupply) {
    return new OrderSupply({
      ...this._model,
      quantity: this.quantity + otherSupply.quantity
    });
  }
}

export class Order {
  constructor(model = {}) {
    this._customerSiteId = model.customer_site_id;
    this._customerSiteName = model.customer_site_name;
    this._date = model.date;
    this._externalId = model.external_id;
    this._fullTruckQuantity = model.full_truck_quantity;
    this._fullTruckUnit = model.full_truck_unit;
    this._id = model.id;
    this._minOrderQuantity = model.minimum_order_quantity;
    this._minOrderUnit = model.minimum_order_unit;
    this._orderFrequency = model.order_frequency;
    this._previousOrderDate = model.previous_order_date;
    this._sendBefore = model.send_before;
    this._shipBefore = model.ship_before;
    this._statusId = model.status_id;
    this._supplierId = model.supplier_id;
    this._supplies = (model.supplies || []).map(supply =>
      OrderSupply.create(supply)
    );
    this._supplierName = model.name;
    this._tagGrouper = model.tag_grouper;
    this._leadTime = model.lead_time;
    this._lastSftpExportDate = model.last_sftp_export_date;
  }
  static create(model) {
    return validate(model, Order.schema()) ? new Order(model) : null;
  }
  static schema() {
    return OrderSchema;
  }

  // Getters
  get customerSiteId() {
    return this._customerSiteId;
  }
  get customerSiteName() {
    return this._customerSiteName;
  }
  get orderFrequency() {
    return this._orderFrequency;
  }
  get previousOrderDate() {
    return this._previousOrderDate;
  }
  get sendBefore() {
    return this._sendBefore;
  }
  get shipBefore() {
    return this._shipBefore;
  }
  get id() {
    return this._id;
  }
  get statusId() {
    return this._statusId;
  }
  get date() {
    return this._date;
  }
  get supplierId() {
    return this._supplierId;
  }
  get supplies() {
    return this._supplies;
  }
  get fullTruckQuantity() {
    return this._fullTruckQuantity;
  }
  get fullTruckUnit() {
    return this._fullTruckUnit;
  }
  get minOrderQuantity() {
    return this._minOrderQuantity;
  }
  get minOrderUnit() {
    return this._minOrderUnit;
  }
  get supplierName() {
    return this._supplierName;
  }
  get externalId() {
    return this._externalId;
  }
  get tagGrouper() {
    return this._tagGrouper;
  }
  get leadTime() {
    return this._leadTime;
  }
  get lastSftpExportDate() {
    return this._lastSftpExportDate;
  }

  // Setters
  set id(id) {
    this._id = id;
  }

  set statusId(statusId) {
    this._statusId = statusId;
  }
  set date(date) {
    this._date = date;
  }
  set supplierId(supplierId) {
    throw new Error(
      "Cannot change a supplier for an existing order. Create a new order instead"
    );
  }
  set supplies(supplies) {
    this._supplies = supplies;
  }
  set fullTruckQuantity(fullTruckQuantity) {
    this._fullTruckQuantity = fullTruckQuantity;
  }
  set fullTruckUnit(fullTruckUnit) {
    this._fullTruckUnit = fullTruckUnit;
  }
  set minOrderQuantity(minOrderQuantity) {
    this._minOrderQuantity = minOrderQuantity;
  }
  set minOrderUnit(minOrderUnit) {
    this._minOrderUnit = minOrderUnit;
  }
  set supplierName(supplierName) {
    this._supplierName = supplierName;
  }
  set externalId(externalId) {
    this._externalId = externalId;
  }
  set tagGrouper(tagGrouper) {
    this._tagGrouper = tagGrouper;
  }
  set lastSftpExportDate(lastSftpExportDate) {
    this._lastSftpExportDate = lastSftpExportDate;
  }
}
