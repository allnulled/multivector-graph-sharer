// @code.start: LswMarkdownViewer API | @$section: Vue.js (v2) Components » LswMarkdownViewer component
Vue.component("LswMarkdownViewer", {
  template: $template,
  props: {
    source: {
      type: String,
      required: true,
    },
    activateEjs: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    this.$trace("lsw-markdown-viewer.data");
    return {
      parsingEjsError: false,
      parsingMarkdownError: false,
      output: false,
    };
  },
  methods: {
    async buildSource() {
      this.$trace("lsw-markdown-viewer.methods.buildSource");
      await LswLazyLoads.loadEjs();
      let sourceTransformed = this.source;
      Render_ejs: {
        if (this.activateEjs) {
          try {
            sourceTransformed = await ejs.render(sourceTransformed, {
              component: this
            }, {
              async: true,
            });
          } catch (error) {
            console.log(error);
            this.parsingEjsError = error;
            throw error;
          }
        }
      }
      Render_markdown: {
          try {
            sourceTransformed = await LswMarkdown.global.parse(sourceTransformed);
          } catch (error) {
            console.log(error);
            this.parsingMarkdownError = error;
            throw error;
          }
      }
      this.output = sourceTransformed;
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-markdown-viewer.mounted");
      await this.buildSource();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswMarkdownViewer API