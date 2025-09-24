// @code.start: LswCodeViewer API | @$section: Vue.js (v2) Components » Lsw Windows API » LswCodeViewer component
Vue.component("LswCodeViewer", {
  template: $template,
  props: {
    code: {
      type: String,
      required: () => true,
    },
    language: {
      type: String,
      required: () => true,
    },
  },
  data() {
    this.$trace("lsw-code-viewer.data");
    return {
      isLoaded: false,
      fontsize: 10,
    };
  },
  methods: {
    increaseFontsize(q = 1) {
      this.$trace("lsw-code-viewer.methods.increaseFontsize");
      this.fontsize += q;
    },
    async loadHighlightJs(event) {
      this.$trace("lsw-code-viewer.methods.loadHighlightJs");
      await LswLazyLoads.loadHighlightJs();
      this.isLoaded = true;
    },
  },
  mounted() {
    this.$trace("lsw-code-viewer.mounter");
    this.loadHighlightJs();
  },
  unmount() {
    this.$trace("lsw-code-viewer.mounter");
  }
});
// @code.end: LswCodeViewer API