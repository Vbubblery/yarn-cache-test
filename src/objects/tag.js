import { validate } from "jsonschema";
import TagSchema from "@/schemas/tag";

export class Tag {
  constructor(model) {
    this._id = model.id;
    this._name = model.name;
    this._products = model.products;
    this._productTagLink = model.product_tag_link;
    this._isTagGrouper = model.is_tag_grouper;
  }
  static create(model) {
    return validate(model, Tag.schema()) ? new Tag(model) : null;
  }
  static schema() {
    return TagSchema;
  }

  // Getters
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get products() {
    return this._products;
  }
  get productTagLink() {
    return this._productTagLink;
  }
  get isTagGrouper() {
    return this._isTagGrouper;
  }

  // Setters
  set id(id) {
    this._id = id;
  }
  set name(name) {
    this._name = name;
  }
  set products(products) {
    this._products = products;
  }
  set productTagLink(productTagLink) {
    this._productTagLink = productTagLink;
  }
  set isTagGrouper(isTagGrouper) {
    this._isTagGrouper = isTagGrouper;
  }
}
