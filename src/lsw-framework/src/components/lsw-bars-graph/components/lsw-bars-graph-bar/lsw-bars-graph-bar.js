// @code.start: LswBarsGraphBar API | @$section: Vue.js (v2) Components » LswBarsGraphBar component
Vue.component("LswBarsGraphBar", {
  template: $template,
  props: {
    value: {
      type: Number,
      required: true,
    },
    text: {
      type: [String, Boolean],
      required: true,
    },
    onClick: {
      type: Function,
      default: () => {},
    },
    color: {
      type: [String, Boolean],
      default: () => false
    }
  },
  data() {
    this.$trace("lsw-bars-graph-bar.data");
    return {
      
    };
  },
  methods: {
    
  },
  mounted() {
    this.$trace("lsw-bars-graph-bar.mounted");
    
  },
  unmount() {
    this.$trace("lsw-bars-graph-bar.unmounted");
  }
});
// @code.end: LswBarsGraphBar API