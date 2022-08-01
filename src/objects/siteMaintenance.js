import { validate } from "jsonschema";
import SiteMaintenanceSchema from "@/schemas/siteMaintenance";

export class SiteMaintenance {
  constructor(model) {
    this._id = model.id;
    this._startDate = model.start_date;
    this._endDate = model.end_date;
    this._siteId = model.site;
    this._description = model.description;
  }
  static create(model) {
    return validate(model, SiteMaintenance.schema())
      ? new SiteMaintenance(model)
      : null;
  }
  static schema() {
    return SiteMaintenanceSchema;
  }

  // Getters
  get id() {
    return this._id;
  }
  get startDate() {
    return this._startDate;
  }
  get endDate() {
    return this._endDate;
  }
  get siteId() {
    return this._siteId;
  }
  get description() {
    return this._description;
  }

  // Setters
  set id(id) {
    this._id = id;
  }
  set startDate(startDate) {
    this._startDate = startDate;
  }
  set endDate(endDate) {
    this._endDate = endDate;
  }
  set siteId(siteId) {
    throw new Error("Should not transfer maintenances between sites");
  }
  set description(description) {
    this._description = description;
  }
}
