/* eslint-disable no-underscore-dangle */
import { render } from "@testing-library/vue";
import VueRouter from "vue-router";
import { CombinedVueInstance } from "vue/types/vue";

type HTMLElementWithVue = HTMLElement & {
  __vue__?: CombinedVueInstance<Vue, unknown, unknown, unknown, unknown>;
};

export const renderComponent: (
  ...args: Parameters<typeof render>
) => ReturnType<typeof render> = (component, opts, callback) => {
  return render(
    component,
    {
      routes: new VueRouter({ mode: "abstract", routes: [] }),
      mocks: {
        $tc: (k: string) => k,
        $t: (k: string) => k
      },
      ...opts
    },
    callback
  );
};

// TODO: find a better of typing this function without raison type errors
export const extractVueComponent: (
  e: HTMLElementWithVue
) => CombinedVueInstance<Vue, unknown, unknown, unknown, unknown> = e =>
  e.__vue__!;
