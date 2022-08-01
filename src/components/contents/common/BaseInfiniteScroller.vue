<template>
  <div class="relative w-0 h-0">
    <div ref="scroller" :style="styles" class="absolute w-0 h-0 left-0" />
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  SetupContext,
  watch,
  computed,
  defineComponent
} from "@vue/composition-api";
import { timeout } from "@/helper/timeout";

interface IBaseInfiniteScrollerProps {
  page: number;
  position: string;
  offset: number;
}

export default defineComponent({
  name: "BaseInfiniteScroller",
  props: {
    page: {
      type: Number,
      required: true
    },
    position: {
      type: String,
      required: false,
      default: "bottom",
      validator(position: string) {
        return ["top", "bottom"].includes(position);
      }
    },
    offset: {
      type: Number,
      required: false,
      default: 200
    }
  },
  emits: ["observed"],
  setup(props: IBaseInfiniteScrollerProps, context: SetupContext) {
    let visible = false;
    let observer: IntersectionObserver;
    const scroller = ref<HTMLDivElement | null>(null);
    const styles = computed(() => `${props.position}: ${props.offset}px`);

    // emit event to request new data if scroller is visible
    const recheck = () => {
      if (visible) {
        context.emit("observed");
      }
    };

    // if scroller became visible or disappeared from the screen
    const onChange = (isVisible: boolean) => {
      visible = isVisible;
      recheck();
    };

    const initObserver = () => {
      observer = new IntersectionObserver(entries => {
        entries.forEach(el => {
          onChange(el.isIntersecting);
        });
      });
    };

    // debounced recheck if scroller is still visible after page has been loaded
    watch(
      () => props.page,
      async () => {
        await timeout(300);
        recheck();
      }
    );

    onMounted(() => {
      initObserver();
      // observe when div has been mounted
      observer.observe(scroller.value as HTMLDivElement);
    });

    onUnmounted(() => {
      observer.disconnect();
    });

    return { styles, scroller };
  }
});
</script>
