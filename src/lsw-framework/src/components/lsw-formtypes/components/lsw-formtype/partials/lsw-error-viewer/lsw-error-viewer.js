// @code.start: LswSyntaxErrorViewer API | @$section: Vue.js (v2) Components » Lsw Formtypes API » LswSyntaxErrorViewer component
Vue.component("LswSyntaxErrorViewer", {
  template: $template,
  props: {
    error: {
      type: [Object, Boolean],
      default: () => false
    },
    onClearError: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    this.$trace("lsw-syntax-error-viewer.data");
    return {
      currentError: this.error,
    };
  },
  methods: {
    setError(error = undefined) {
      this.$trace("lsw-syntax-error-viewer.methods.setError");
      this.currentError = error;
      if(typeof error === "undefined") {
        this.onClearError();
      }
    },
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-syntax-error-viewer.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswSyntaxErrorViewer API