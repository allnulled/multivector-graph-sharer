// @code.start: LswWikiArticuloViewer API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswWikiArticuloViewer component
Vue.component("LswWikiArticuloViewer", {
  name: "LswWikiArticuloViewer",
  template: $template,
  props: {
    articuloId: {
      type: [Number, String],
      required: true,
    }
  },
  data() {
    this.$trace("lsw-wiki-articulo-viewer.data");
    return {
      isLoaded: false,
      selectedArticulos: false,
      markdownContent: false,
      error: false,
    };
  },
  methods: {
    setError(error) {
      this.$trace("lsw-wiki-articulo-viewer.methods.setError");
      this.error = error;
    },
    async loadContent() {
      this.$trace("lsw-wiki-articulo-viewer.methods.loadContent");
      const matchedRows = await this.$lsw.database.selectMany("Articulo", articulo => {
        return articulo.tiene_titulo === this.articuloId;
      });
      console.log("[*] Artículos coincidentes:", matchedRows);
      try {
        if(matchedRows.length === 0) {
          throw new Error(`Articulo no encontrado por «${this.articuloId}»`);
        } else if(matchedRows.length === 1) {
          this.markdownContent = LswMarkdown.global.parse(matchedRows[0].tiene_contenido);
        } else {
          this.markdownContent = matchedRows.map(row => LswMarkdown.global.parse(row.tiene_contenido)).join("\n\n----\n\n");
        }
        this.selectedArticulos = matchedRows;
      } catch (error) {
        console.log("[*] Error loading articulo:", error);
        this.setError(error);
      } finally {
        this.isLoaded = true;
      }
    }
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki-articulo-viewer.mounted");
      await this.loadContent();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswWikiArticuloViewer API