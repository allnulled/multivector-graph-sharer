// @code.start: LswMermaidViewer API | @$section: Vue.js (v2) Components » LswMermaidViewer component
Vue.component("LswMermaidViewer", {
  template: $template,
  props: {
    initialSource: {
      type: String,
      default: () => `graph TD;\n  A --> B;\n  B --> C;\n  C --> D;\n  C --> A;`,
    },
    initialPage: {
      type: String,
      default: () => "editor" // too: "visualizador"
    }
  },
  data() {
    this.$trace("lsw-mermaid-viewer.data");
    return {
      currentPage: this.initialPage,
      error: false,
      isLoaded: false,
      source: this.initialSource,
    };
  },
  methods: {
    async loadImage() {
      this.$trace("lsw-mermaid-viewer.methods.loadImage");
      try {
        this.isLoaded = false;
        const targetHtml = this.$refs.mermaidTargetTag;
        const targetId = LswRandomizer.getRandomString(10);
        const targetCode = this.source;
        // Hacemos saltar el error antes:
        mermaid.parse(targetCode);
        // Procedemos al parse convencional
        const output = await window.mermaid.render(targetId, targetCode);
        targetHtml.innerHTML = output.svg;
        this.isLoaded = true;
        this.setError(false);
      } catch (error) {
        this.setError(error);
      }
    },
    abrirEditor() {
      this.$trace("lsw-mermaid-viewer.methods.abrirEditor");
      this.currentPage = 'editor';
    },
    abrirVisualizador() {
      this.$trace("lsw-mermaid-viewer.methods.abrirVisualizador");
      this.currentPage = 'visualizador';
      this.loadImage();
    },
    setError(error) {
      this.$trace("lsw-mermaid-viewer.methods.setError");
      this.error = error;
    },
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-mermaid-viewer.mounted");
      this.loadImage();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswMermaidViewer API