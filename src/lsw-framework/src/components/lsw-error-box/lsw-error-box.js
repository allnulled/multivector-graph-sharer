// @code.start: LswErrorBox API | @$section: Vue.js (v2) Components » LswErrorBox component
Vue.component("LswErrorBox", {
  template: $template,
  props: {
    error: {
      type: [Object, Boolean],
      default: () => false,
    },
    onClearError: {
      type: [Function, Boolean],
      default: () => false,
    },
    context: {
      type: String,
      default: () => {},
    }
  },
  data() {
    this.$trace("lsw-error-box.data");
    return {
      isShowingTrace: false,
    };
  },
  methods: {
    toggleTrace() {
      this.$trace("lsw-error-box.methods.toggleTrace");
      this.isShowingTrace = !this.isShowingTrace;
    },
    clearError() {
      this.$trace("lsw-error-box.methods.clearError");
      this.onClearError();
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-error-box.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswErrorBox API