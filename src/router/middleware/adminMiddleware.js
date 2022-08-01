import { store } from "@/store/store";
import NotificationService from "@/services/notification.service";

export const controlRbacAccess = (
  permissionList = [],
  then = (to, from, next) => {
    return next();
  }
) => (to, from, next) => {
  const me = store.getters["common/getMe"];
  if (me.canAccess(permissionList)) return then(to, from, next);
  const unauthorizedMsg =
    me.locale === "en" ? "Not authorized" : "Non autorisé";
  NotificationService.error(unauthorizedMsg);
  return next({ name: "home" });
};

export const adminNotFound = (getter, { tryFetch, fetchAction } = {}) => (
  to,
  from,
  next
) => {
  const entityId = parseInt(Object.values(to.params)[0]);
  const entity = store.getters[getter](entityId);
  if (entity) return next();
  else if (!tryFetch) return next("/notFound");
  else {
    store
      .dispatch(fetchAction, entityId)
      .then(() => {
        if (store.getters[getter](entityId)) return next();
        else return next("/notFound");
      })
      .catch(() => {
        return next("/notFound");
      });
  }
};
export const adminNotAuthorized = (to, from, next) => {
  const site = store.getters["common/getCurrentSite"];
  const me = store.getters["common/getMe"];
  if (me.admin && !site.isSupplierView) return next();
  const unauthorizedMsg =
    me.locale === "en" ? "Not authorized" : "Non autorisé";
  NotificationService.error(unauthorizedMsg);
  return next({ name: "home" });
};
export const supplierNotAuthorized = (to, from, next) => {
  const me = store.getters["common/getMe"];
  const site = store.getters["common/getCurrentSite"];
  if (!site.isSupplierView) return next();
  const unauthorizedMsg =
    me.locale === "en" ? "Not authorized" : "Non autorisé";
  NotificationService.error(unauthorizedMsg);
  return next({ name: "orders" });
};
export const customerNotAuthorized = (to, from, next) => {
  const me = store.getters["common/getMe"];
  const site = store.getters["common/getCurrentSite"];
  if (site.isSupplierView) return next();
  const unauthorizedMsg =
    me.locale === "en" ? "Not authorized" : "Non autorisé";
  NotificationService.error(unauthorizedMsg);
  return next({ name: "orders" });
};
