import emitter from "@/services/emitter.service";

export default {
  data() {
    return {
      products: {}
    };
  },
  mounted() {
    emitter.on("checkboxValueChange", event => {
      let targetItem = this.products[event.id];
      if (targetItem) {
        targetItem.checked = event.checked;
      } else {
        targetItem = this.targetProducts[event.id];
        if (targetItem) {
          targetItem.checked = event.checked;
        }
      }
    });
  }
};
