import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "index",
  components: {},
  setup() {
    const data = reactive({
    });

    return {
      ...toRefs(data),
    };
  },
});

