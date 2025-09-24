// @code.start: LswWindowsPivotButton API | @$section: Vue.js (v2) Components » Lsw Windows API » LswWindowsPivotButton component
// Change this component at your convenience:
Vue.component("LswWindowsPivotButton", {
  template: $template,
  props: {
    viewer: {
      type: Object,
      required: true
    }
  },
  data() {
    this.$trace("lsw-windows-pivot-button.data");
    return {
      
    };
  },
  methods: {
    onClick(event) {
      this.$trace("lsw-windows-pivot-button.methods.onClick");
      this.viewer.toggleState();
    },
  },
});
// @code.end: LswWindowsPivotButton API