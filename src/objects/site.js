import { validate } from "jsonschema";
import SiteSchema from "@/schemas/site";

const DEFAULT_HORIZON_WEEKS = 52;
export class Site {
  constructor(model) {
    this._id = model.id;
    this._name = model.name;
    this._address = model.address;
    this._company = model.company;
    this._users = model.users ? model.users.map(user => user.id) : [];
    this._storages = model.storage_sites;
    this._isSupplierView = model.is_supplier_view ?? false;
    this._demandDistributionWeek = model.demand_distribution_week;
    this._currentYearDemand = model.current_year_demand;
    this._currentYearMonthlyStock = model.current_year_monthly_stock;
    this._currentYearTotalValues = model.current_year_total_values;
    this._avgSiteStockouts = model.avg_site_stockout;
    this._hasSameDefaultUnit = model.has_same_default_unit;
    this._showFutureDashboard = model.show_future_dashboard;
    this._currency = model.currency ?? "eur";
    this._aggSiteAccuracy = model.agg_site_accuracy;
    this._wAvgSiteAccuracy = model.w_avg_site_accuracy;
    this._avgSiteAccuracy = model.avg_site_accuracy;
    this._hasShelfLife = model.has_shelf_life;
    this._displayDemandForecastExternal =
      model.display_demand_forecast_external;
    this._displayFirmOrdersInDemand = model.display_firm_orders_in_demand;
    this._hasStockWithBacklog = model.has_stock_with_backlog;
    this._defaultDemandTimeBucket = model.default_demand_time_bucket;
    this._defaultPlanningTimeBucket = model.default_planning_time_bucket;
    this._currentYearMonthlyStockCoverage =
      model.current_year_monthly_stock_coverage;
    this._planningHorizonWeeks =
      model.global_config?.[0]?.planning_horizon_week ?? DEFAULT_HORIZON_WEEKS;
    this._demandHorizonWeeks =
      model.global_config?.[0]?.demand_horizon_week ?? DEFAULT_HORIZON_WEEKS;
  }
  static create(model) {
    return validate(model, Site.schema()) ? new Site(model) : null;
  }
  static schema() {
    return SiteSchema;
  }

  // Getters
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get address() {
    return this._address;
  }
  get users() {
    return this._users;
  }
  get storages() {
    return this._storages;
  }
  get company() {
    return this._company;
  }
  get isSupplierView() {
    return this._isSupplierView;
  }
  get demandDistributionWeek() {
    return this._demandDistributionWeek;
  }
  get currentYearDemand() {
    return this._currentYearDemand;
  }
  get currentYearMonthlyStock() {
    return this._currentYearMonthlyStock;
  }
  get currentYearMonthlyStockCoverage() {
    return this._currentYearMonthlyStockCoverage;
  }
  get currentYearTotalValues() {
    return this._currentYearTotalValues;
  }
  get avgSiteStockouts() {
    return this._avgSiteStockouts;
  }
  get showFutureDashboard() {
    return this._showFutureDashboard;
  }
  get currency() {
    return this._currency;
  }
  get hasSameDefaultUnit() {
    return this._hasSameDefaultUnit;
  }
  get aggSiteAccuracy() {
    return this._aggSiteAccuracy;
  }
  get wAvgSiteAccuracy() {
    return this._wAvgSiteAccuracy;
  }
  get avgSiteAccuracy() {
    return this._avgSiteAccuracy;
  }
  get hasShelfLife() {
    return this._hasShelfLife;
  }
  get hasStockWithBacklog() {
    return this._hasStockWithBacklog;
  }
  get displayDemandForecastExternal() {
    return this._displayDemandForecastExternal;
  }
  get displayFirmOrdersInDemand() {
    return this._displayFirmOrdersInDemand;
  }

  get defaultDemandTimeBucket() {
    return this._defaultDemandTimeBucket;
  }

  get defaultPlanningTimeBucket() {
    return this._defaultPlanningTimeBucket;
  }

  get planningHorizonWeeks() {
    return this._planningHorizonWeeks;
  }
  get demandHorizonWeeks() {
    return this._demandHorizonWeeks;
  }
  // Setters
  set id(id) {
    this._id = id;
  }
  set name(name) {
    this._name = name;
  }
  set address(address) {
    this._address = address;
  }
  set users(users) {
    this._users = users;
  }
  set storages(storages) {
    this._storages = storages;
  }
  set company(company) {
    this._company = company;
  }
  set isSupplierView(isSupplierView) {
    this._isSupplierView = isSupplierView;
  }
  set demandDistributionWeek(demandDistributionWeek) {
    this._demandDistributionWeek = demandDistributionWeek;
  }
  set currentYearDemand(currentYearDemand) {
    this._currentYearDemand = currentYearDemand;
  }
  set currentYearMonthlyStock(currentYearMonthlyStock) {
    this._currentYearMonthlyStock = currentYearMonthlyStock;
  }
  set currentYearTotalValues(currentYearTotalValues) {
    this._currentYearTotalValues = currentYearTotalValues;
  }
  set avgSiteStockouts(avgSiteStockouts) {
    this._avgSiteStockouts = avgSiteStockouts;
  }
  set showFutureDashboard(showFutureDashboard) {
    this._showFutureDashboard = showFutureDashboard;
  }
  set currency(currency) {
    this._currency = currency;
  }
  set hasSameDefaultUnit(hasSameDefaultUnit) {
    this._hasSameDefaultUnit = hasSameDefaultUnit;
  }
  set aggSiteAccuracy(aggSiteAccuracy) {
    this._aggSiteAccuracy = aggSiteAccuracy;
  }
  set wAvgSiteAccuracy(wAvgSiteAccuracy) {
    this._wAvgSiteAccuracy = wAvgSiteAccuracy;
  }
  set avgSiteAccuracy(avgSiteAccuracy) {
    this._avgSiteAccuracy = avgSiteAccuracy;
  }
  set hasShelfLife(hasShelfLife) {
    this._hasShelfLife = hasShelfLife;
  }
  set hasStockWithBacklog(hasStockWithBacklog) {
    this._hasStockWithBacklog = hasStockWithBacklog;
  }
  set displayDemandForecastExternal(displayDemandForecastExternal) {
    this._displayDemandForecastExternal = displayDemandForecastExternal;
  }
  set displayFirmOrdersInDemand(displayFirmOrdersInDemand) {
    this._displayFirmOrdersInDemand = displayFirmOrdersInDemand;
  }

  set defaultDemandTimeBucket(timeBucket) {
    this._defaultDemandTimeBucket = timeBucket;
  }
  set defaultPlanningTimeBucket(timeBucket) {
    this._defaultPlanningTimeBucket = timeBucket;
  }
  set planningHorizonWeeks(months) {
    this._planningHorizonWeeks = months;
  }
  set demandHorizonWeeks(months) {
    this._demandHorizonWeeks = months;
  }
}
