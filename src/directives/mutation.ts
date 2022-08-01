import { DirectiveBinding } from "vue/types/options";

type ObservableHTMLElement = HTMLElement & {
  observer: MutationObserver | null;
};

export const mutationObserverDirective = {
  bind(el: ObservableHTMLElement, binding: DirectiveBinding) {
    el.observer = new MutationObserver((mutations: MutationRecord[]) =>
      binding.value(el, mutations[0])
    );
  },

  inserted(el: ObservableHTMLElement, binding: DirectiveBinding) {
    el.observer?.observe(el, {
      childList: true,
      subtree: true,
      attributes: true
    });

    if (binding.modifiers.immediate) {
      binding.value(el, null);
    }
  },

  unbind(el: ObservableHTMLElement) {
    el.observer?.disconnect();
  }
};
