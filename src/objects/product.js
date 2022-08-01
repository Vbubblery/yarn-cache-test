import { validate } from "jsonschema";
import ProductSchema from "@/schemas/product";

export class Product {
  constructor(model = {}) {
    this._id = model.id;
    this._name = model.name;
    this._externalId = model.external_id;
    this._description = model.description;
    this._serviceLevel = model.service_level;
    this._site = model.site;
    this._productSupplierLinks = (model.product_supplier_link || []).map(link =>
      Product.supplierLink(link)
    );
    this._units = {
      defaultUnitName: model.default_unit_name || "",
      secondaryUnitName: model.secondary_unit_name || "",
      defaultUnitValue: model.default_unit_value || 1,
      secondaryUnitValue: model.secondary_unit_value || 1
    };
    this._lookALikes = model.look_alikes ?? [];
    this._replacedBy = model.replaced_by ?? [];
    this._promotions = model.promotions;
    this._tags = model.tags;
    this._productionDate = {
      start: model.production_start_at ?? null,
      end: model.production_end_at ?? null
    };
    this._saleDate = {
      start: model.sale_start_at ?? null,
      end: model.sale_end_at ?? null
    };
    this._defaultSupplyStorage = model.default_supply_storage_site;
    this._defaultDemandStorage = model.default_demand_storage_site;
    this._demandType = model.demand_type?.toLowerCase();
    this._isDefaultUnit = model.is_default_unit ?? true;
    this._shelfLife = model.shelf_life;
  }
  static create(model) {
    return validate(model, Product.schema()) ? new Product(model) : null;
  }
  static schema() {
    return ProductSchema;
  }
  static supplierLink(model) {
    return {
      id: model.id,
      product: model.product,
      partner: model.supplier,
      partnerId: model.supplier.id,
      isSupplier: model.supplier.is_supplier,
      price: model.price,
      moq: model.moq,
      leadTime: model.lead_time,
      ratio: model.ratio,
      tagGrouper: model.tag_grouper
        ? model.tag_grouper
        : { id: null, name: null },
      fixedLotSize: model.fixed_lot_size
    };
  }
  static dumpSupplierLink(model) {
    return {
      id: model.id,
      product: model.product || null,
      supplier: model.partnerId,
      price: model.price,
      moq: model.moq,
      tag_grouper: model.tagGrouper.id ? model.tagGrouper : null,
      lead_time: model.leadTime,
      ratio: model.ratio,
      fixed_lot_size: model.fixedLotSize
    };
  }

  // Getters
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get externalId() {
    return this._externalId;
  }
  get description() {
    return this._description;
  }
  get serviceLevel() {
    return this._serviceLevel;
  }
  get site() {
    return this._site;
  }
  get productSupplierLinks() {
    return this._productSupplierLinks;
  }
  get units() {
    return this._units;
  }
  get lookALikes() {
    return this._lookALikes;
  }
  get replacedBy() {
    return this._replacedBy;
  }
  get promotions() {
    return this._promotions;
  }
  get productionDate() {
    return this._productionDate;
  }
  get tags() {
    return this._tags;
  }
  get saleDate() {
    return this._saleDate;
  }
  get defaultSupplyStorage() {
    return this._defaultSupplyStorage;
  }
  get defaultDemandStorage() {
    return this._defaultDemandStorage;
  }
  get demandType() {
    return this._demandType;
  }
  get isDefaultUnit() {
    return this._isDefaultUnit;
  }
  get shelfLife() {
    return this._shelfLife;
  }

  // Setters
  set name(name) {
    this._name = name;
  }
  set externalId(externalId) {
    this._externalId = externalId;
  }
  set description(description) {
    this._description = description;
  }
  set serviceLevel(serviceLevel) {
    this._serviceLevel = serviceLevel;
  }
  set site(site) {
    this._site = site;
  }
  set productSupplierLinks(productSupplierLinks) {
    this._productSupplierLinks = productSupplierLinks;
  }
  set units(units) {
    this._units = units;
  }
  set lookALikes(lookALikes) {
    this._lookALikes = lookALikes;
  }
  set replacedBy(replacedBy) {
    this._replacedBy = replacedBy;
  }
  set promotions(promotions) {
    this._promotions = promotions;
  }
  set tags(tags) {
    this._tags = tags;
  }
  set productionDate(productionDate) {
    this._productionDate = productionDate;
  }
  set saleDate(saleDate) {
    this._saleDate = saleDate;
  }
  set defaultSupplyStorage(defaultSupplyStorage) {
    this._defaultSupplyStorage = defaultSupplyStorage;
  }
  set defaultDemandStorage(defaultDemandStorage) {
    this._defaultDemandStorage = defaultDemandStorage;
  }
  set demandType(demandType) {
    this._demandType = demandType;
  }
  set isDefaultUnit(isDefaultUnit) {
    this._isDefaultUnit = isDefaultUnit;
  }
  set shelfLife(shelfLife) {
    this._shelfLife = shelfLife;
  }

  dump() {
    let supplierLinks = (this._productSupplierLinks || []).map(link =>
      Product.dumpSupplierLink(link)
    );

    return {
      name: this._name,
      external_id: this._externalId,
      description: this._description,
      service_level: this._serviceLevel,
      site: this._site,
      default_unit_name: this._units.defaultUnitName,
      secondary_unit_name: this._units.secondaryUnitName,
      default_unit_value: this._units.defaultUnitValue,
      secondary_unit_value: this._units.secondaryUnitValue,
      is_default_unit: this._isDefaultUnit,
      look_alikes: this._lookALikes,
      promotions: this._promotions,
      tags: this._tags,
      production_start_at: this._productionDate.start ?? null,
      production_end_at: this._productionDate.end ?? null,
      sale_start_at: this._saleDate.start ?? null,
      sale_end_at: this._saleDate.end ?? null,
      default_supply_storage_site: this._defaultSupplyStorage,
      default_demand_storage_site: this._defaultDemandStorage,
      product_supplier_link: supplierLinks,
      shelf_life: this._shelfLife
    };
  }
}
