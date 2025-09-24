// @code.start: LswWindowsViewer API | @$section: Vue.js (v2) Components » Lsw Windows API » LswWindowsViewer classes and functions
// Change this component at your convenience:
Vue.component("LswWindowsViewer", {
  template: $template,
  props: {},
  data() {
    return {
      isShowing: false
    };
  },
  methods: {
    hide() {
      this.isShowing = false;
    },
    show() {
      this.isShowing = true;
    },
    toggleState() {
      this.isShowing = !this.isShowing;
      this.$forceUpdate(true);
    },
    selectDialog(id) {
      this.hide();
      this.$refs.dialogs.maximize(id);
    }
  },
  mounted() {
    this.$window.LswWindows = this;
    this.$lsw.windows = this;
    this.$lsw.windowsViewer = this;
  }
});
// @code.end: LswWindowsViewer API
