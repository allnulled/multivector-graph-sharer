// @code.start: LswBookFactory API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswBookFactory component
Vue.component("LswBookFactory", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-book-factory.data");
    return {
      titles: [],
    };
  },
  methods: {
    async loadTitles() {
      this.$trace("lsw-book-factory.methods.loadTitles");
      const librosMap = await this.$lsw.fs.read_directory("/kernel/wiki/libros");
      this.titles = Object.keys(librosMap);
      // await LswLazyLoads.loadEjs();
    },
    openLibrosDirectory() {
      this.$trace("lsw-book-factory.methods.openLibrosDirectory");
      this.$lsw.dialogs.open({
        title: "Directorio de libros",
        template: `<lsw-filesystem-explorer opened-by="/kernel/wiki/libros" />`,
      });
    },
    editLibro(title) {
      this.$trace("lsw-book-factory.methods.editLibro");
      this.$lsw.dialogs.open({
        title: "Editar libro",
        template: `<lsw-filesystem-explorer :opened-by="'/kernel/wiki/libros/' + title" />`,
        factory: {
          data: {
            title,
          }
        }
      });
    },
    async openLibro(title) {
      this.$trace("lsw-book-factory.methods.openLibro");
      const originalSource = await this.$lsw.fs.read_file(`/kernel/wiki/libros/${title}`);
      const source = originalSource;
      this.$lsw.dialogs.open({
        title: "Leer libro",
        template: `
          <div class="pad_1">
            <lsw-markdown-viewer :source="source" :activate-ejs="true" />
          </div>
        `,
        factory: {
          data: {
            source,
          }
        }
      });
    },
  },
  async mounted() {
    this.$trace("lsw-book-factory.mounted");
    await this.loadTitles();
  },
  unmount() {
    this.$trace("lsw-book-factory.unmount");
  }
});
// @code.end: LswBookFactory API