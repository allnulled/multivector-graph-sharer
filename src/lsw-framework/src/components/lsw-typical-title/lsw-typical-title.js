// @code.start: LswTypicalTitle API | @$section: Vue.js (v2) Components » LswTypicalTitle component
Vue.component("LswTypicalTitle", {
  template: $template,
  props: {
    buttons: {
      type: [Array, Boolean],
      default: () => []
    }
  },
  data() {
    this.$trace("lsw-typical-title.data");
    return {
      
    };
  },
  methods: {
    
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-typical-title.mounted");
      // @OK
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswTypicalTitle API