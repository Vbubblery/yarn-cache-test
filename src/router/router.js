import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./routes";
import { store } from "@/store/store";
import SupervisorService from "@/services/supervisor.service";
import OptimizationService from "@/services/optimization.service";
import AlertApiService from "@/services/alerts.api.service";
import { controlRbacAccess } from "./middleware";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "history"
});

router.beforeEach(async (to, from, next) => {
  if (to.name == "callback") {
    return next();
  } else if (router.app.$auth.isAuthenticated()) {
    const email = router.app.$auth.user?.email;
    // set user email for APM
    router.app.$apm.setUserContext({
      email
    });
    // Set page default view
    let pages = ["/demand", "/planning"];
    if (pages.includes(to.path)) {
      store.dispatch(
        "common/updatePageDefaultView",
        to.path === "/demand" ? "demand" : "planning"
      );
    }
    let curSite = store.getters["common/getCurrentSite"];
    if (!curSite) {
      // set headers after authentication
      SupervisorService.setHeader();
      OptimizationService.setHeader();
      AlertApiService.setHeader();
      // trigger real user event for hotjar
      if (!email.includes("@flowlity.com")) {
        window.hj("event", "real_customer");
      }
      await store.dispatch("common/initMe");
      await store.dispatch(
        "common/initCurrentSite",
        store.getters["common/getMe"].defaultSiteId
      );
      curSite = store.getters["common/getCurrentSite"];
    }
    const routePermissions = to.meta?.permissions ?? [];
    controlRbacAccess(routePermissions, (to, from, next) => {
      if (curSite.isSupplierView && ["planning", "home"].includes(to.name)) {
        return next("/orders");
      }
      return next();
    })(to, from, next);
  } else {
    // trigger auth0 login
    router.app.$auth.login();
  }
});

export default router;
