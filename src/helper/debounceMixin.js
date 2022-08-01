export default {
  data() {
    return {
      timerId: null
    };
  },
  methods: {
    debounce(fn, delay = 300) {
      return ((...args) => {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
          this.timerId = null;
          fn(...args);
        }, delay);
      })();
    }
  }
};
