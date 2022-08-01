import "@/setup-composition-api";
import Vue from "vue";
import SvgSpritePlugin from "vue-svg-sprite";
import FloatingVue from "floating-vue";

Vue.use(SvgSpritePlugin);
Vue.use(FloatingVue);
Object.defineProperty(window, "scrollTo", { value: () => {}, writable: true });
