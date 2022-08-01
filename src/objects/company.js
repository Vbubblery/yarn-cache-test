import { validate } from "jsonschema";
import CompanySchema from "@/schemas/company";

export class Company {
  constructor(model) {
    this._id = model.id;
    this._name = model.name;
    this._autoFillSupply = model.auto_fill_supply;
    this._users = model.users ? model.users.map(user => user.id) : [];
    this._sites = model.sites ? model.sites : [];
    this._allowSftpExport = model.allow_sftp_export;
  }
  static create(model) {
    return validate(model, Company.schema()) ? new Company(model) : null;
  }
  static schema() {
    return CompanySchema;
  }

  // Getters
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get autoFillSupply() {
    return this._autoFillSupply;
  }
  get users() {
    return this._users;
  }
  get sites() {
    return this._sites;
  }
  get allowSftpExport() {
    return this._allowSftpExport;
  }

  // Setters
  set id(id) {
    this._id = id;
  }
  set name(name) {
    this._name = name;
  }
  set autoFillSupply(autoFillSupply) {
    this._autoFillSupply = autoFillSupply;
  }
  set users(users) {
    this._users = users;
  }
  set sites(sites) {
    this._sites = sites;
  }
  set allowSftpExport(value) {
    throw new Error(
      "This operation is not allowed. Please contact Flowlity to enable sftp export for your company"
    );
  }
}
