import { validate } from "jsonschema";
import PromotionSchema from "@/schemas/promotion";

export class Promotion {
  constructor(model) {
    this._id = model.id;
    this._name = model.name;
    this._startDate = model.start_date;
    this._endDate = model.end_date;
    this._products = model.products;
    this._coefficient = model.coefficient;
    this._description = model.description;
  }
  static create(model) {
    return validate(model, Promotion.schema()) ? new Promotion(model) : null;
  }
  static schema() {
    return PromotionSchema;
  }

  // Getters
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get startDate() {
    return this._startDate;
  }
  get endDate() {
    return this._endDate;
  }
  get products() {
    return this._products;
  }
  get coefficient() {
    return this._coefficient;
  }
  get description() {
    return this._description;
  }

  // Setters
  set id(id) {
    this._id = id;
  }
  set name(name) {
    this._name = name;
  }
  set startDate(startDate) {
    this._startDate = startDate;
  }
  set endDate(endDate) {
    this._endDate = endDate;
  }
  set products(products) {
    this._products = products;
  }
  set coefficient(coefficient) {
    this._coefficient = coefficient;
  }
  set description(description) {
    this._description = description;
  }
}
