import { validate } from "jsonschema";
import UserSchema from "@/schemas/user";

export class User {
  constructor(model = {}) {
    this._id = model.id;
    this._email = model.email;
    this._name = model.name;
    this._telOffice = model.tel_office;
    this._title = model.title;
    this._company = model.company;
    this._sites = model.sites;
    this._defaultSiteId = model.default_site
      ? model.default_site
      : model.sites.length
      ? model.sites[0].id
      : null;
    this._admin = model.is_admin ? true : false;
    this._superAdmin = model.is_superadmin ? true : false;
    this._demoUser = model.is_demo_user ? true : false;
    this._password = "";
    this._locale = model.locale;
    this._isActive = model.is_active;
    this._permissions = model.permissions || [];
  }
  static create(model) {
    return validate(model, User.schema()) ? new User(model) : null;
  }
  static schema() {
    return UserSchema;
  }

  canAccess(permissionList) {
    return permissionList.every(permission =>
      this._permissions.includes(permission)
    );
  }

  // Getters
  get id() {
    return this._id;
  }
  get email() {
    return this._email;
  }
  get name() {
    return this._name;
  }
  get telOffice() {
    return this._telOffice;
  }
  get title() {
    return this._title;
  }
  get company() {
    return this._company;
  }
  get sites() {
    return this._sites;
  }
  get defaultSiteId() {
    return this._defaultSiteId;
  }
  get admin() {
    return this._admin;
  }
  get superAdmin() {
    return this._superAdmin;
  }
  get demoUser() {
    return this._demoUser;
  }
  get password() {
    return this._password;
  }
  get locale() {
    return this._locale;
  }
  get isActive() {
    return this._isActive;
  }
  get permissions() {
    return this._permissions;
  }

  // Setters
  set id(id) {
    this._id = id;
  }
  set email(email) {
    this._email = email;
  }
  set name(name) {
    this._name = name;
  }
  set telOffice(telOffice) {
    this._telOffice = telOffice;
  }
  set title(title) {
    this._title = title;
  }
  set company(company) {
    this._company = company;
  }
  set sites(sites) {
    this._sites = sites;
  }
  set defaultSiteId(defaultSiteId) {
    this._defaultSiteId = defaultSiteId;
  }
  set admin(admin) {
    this._admin = admin;
  }
  set superAdmin(superAdmin) {
    this._superAdmin = superAdmin;
  }
  set demoUser(demoUser) {
    this._demoUser = demoUser;
  }
  set password(password) {
    this._password = password;
  }
  set locale(locale) {
    this._locale = locale;
  }
  set isActive(isActive) {
    this._isActive = isActive;
  }
  set permissions(permissions) {
    throw new Error("Cannot set manually permissions of user");
  }
}
