// @code.start: LswJsViewer API | @$section: Vue.js (v2) Components » Lsw SchemaBasedForm API » LswJsViewer component
Vue.component("LswJsViewer", {
  template: $template,
  props: {
    source: {
      type: String,
      required: true,
    },
  },
  data() {
    this.$trace("lsw-js-viewer.data");
    return {
      isLoaded: false,
      isExpanded: false,
      beautifiedSource: false,
    };
  },
  methods: {
    toggleExpansion() {
      this.isExpanded = !this.isExpanded;
    },
    async load() {
      await LswLazyLoads.loadHighlightJs();
      await LswLazyLoads.loadBeautifier();
      try {
        this.beautifiedSource = beautifier.js(this.source);
      } catch (error) {
        // @BADLUCK!
        this.beautifiedSource = this.source;
      } finally {
        this.isLoaded = true;
      }
      this.$nextTick(() => {
        hljs.highlightElement(this.$refs.sourceTag);
      });
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-js-viewer.mounted");
      await this.load();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswJsViewer API