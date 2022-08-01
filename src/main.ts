/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import "@/polyfills";
import Vue from "vue";
import App from "@/App.vue";
import { store } from "@/store/store";
import router from "@/router/router";
import ScrollLoader from "vue-scroll-loader";
import "./setup-composition-api";
import { createApp } from "@vue/composition-api";
import VueSweetalert2 from "vue-sweetalert2";
import SvgSpritePlugin from "vue-svg-sprite";
import svgSprite from "@/assets/svg/sprite.svg";
import { mutationObserverDirective } from "@/directives/mutation";

// services
import ErrorService from "@/services/error.service";
import AlertApiService from "@/services/alerts.api.service";
import DataIntegrationService from "@/services/dataIntegration.service";
import SupervisorService from "@/services/supervisor.service";
import OptimizationService from "@/services/optimization.service";

// plugin
import VueMeta from "vue-meta";

// css
import "@/assets/styles/antd-variables.less";
import "@/assets/styles/tailwind/tailwind.css";
import "@/assets/styles/main.scss";

// ELK tracking
import { ApmVuePlugin } from "@elastic/apm-rum-vue";

import Hotjar from "vue-hotjar";

Vue.use(Hotjar, {
  id: process.env.VUE_APP_HOTJAR_ID,
  isProduction: true,
  snippetVersion: 6
});

Vue.use(ApmVuePlugin, {
  router,
  config: {
    serviceName: "frontend",
    serverUrl:
      "https://125a6c998a0e4fe29857f1fb70e74369.apm.francecentral.azure.elastic-cloud.com:443",
    active: process.env.VUE_APP_APM_ACTIVE ?? false,
    environment: process.env.NODE_ENV,
    logLevel: "warn"
  }
});

// auth0
import auth from "@/services/auth0.service";
Vue.use(auth);

// scroll loader
Vue.use(ScrollLoader);

// activate error service
ErrorService.init();

//SweetAlert
Vue.use(VueSweetalert2);
Vue.use(SvgSpritePlugin, { url: svgSprite });
Vue.directive("mutation", mutationObserverDirective);

// i18n
import { i18n } from "@/i18n/i18n@next";
Vue.use(i18n);
Vue.use(VueMeta);

// to remove Vue warnings about few Ant components
// https://github.com/vueComponent/ant-design-vue/issues/2394
import { Modal, Drawer } from "ant-design-vue";
Vue.use(Modal);
Vue.use(Drawer);

// floating-ui https://floating-vue.starpad.dev/
import FloatingVue from "floating-vue";
Vue.use(FloatingVue);

// handle click outside event
Vue.directive("click-outside", {
  bind(el, binding) {
    const handler = e => {
      if (!el.contains(e.target) && el !== e.target) {
        binding.value(e);
      }
    };
    el.__vueClickOutside__ = handler;
    document.addEventListener("click", handler);
  },
  unbind(el) {
    document.removeEventListener("click", el.__vueClickOutside__);
    el.__vueClickOutside__ = null;
  }
});

Vue.directive("focus", {
  inserted: function (el) {
    el.focus();
  }
});

Vue.config.productionTip = true;
// Supervisor service
SupervisorService.init();

// Optimization service
OptimizationService.init();

// Alert service
AlertApiService.init();

// Data Integration service
DataIntegrationService.init();

const app = createApp({
  render: h => h(App),
  store,
  router,
  i18n
});

app.mount("#app");
