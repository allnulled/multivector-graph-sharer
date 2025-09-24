// @code.start: LswWikiCategorias API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswWikiCategorias component
Vue.component("LswWikiCategorias", {
  name: "LswWikiCategorias",
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-wiki-categorias.data");
    return {
      categorias: false,
    };
  },
  methods: {
    async loadCategorias() {
      this.$trace("LswWikiCategorias.methods.loadCategorias");
      this.categorias = await LswWikiUtils.getCategorias();
    },
    async abrirCategoria(categoria) {
      this.$trace("LswWikiCategorias.methods.abrirCategoria");
      const articulosCategorizados = await this.$lsw.database.selectMany("Articulo", articulo => {
        return articulo.tiene_categorias.indexOf(categoria.id) !== -1;
      })
      console.log(categoria);
      this.$lsw.dialogs.open({
        id: LswRandomizer.getRandomString(10),
        title: "Ver categoría: " + categoria.id,
        template: `
          <div>
            <lsw-database-explorer
              :show-breadcrumb="false"
              initial-page="lsw-page-rows"
              :initial-args="{
                database: 'lsw_default_database',
                table: 'Articulo',
                tableStorageId: 'categoria-' + categoriaId,
                filterCallback: it => it.tiene_categorias && (it.tiene_categorias.toLowerCase().indexOf(categoriaId.toLowerCase()) !== -1),
              }"
            />
          </div>
        `,
        factory: {
          data: { categoriaId: categoria.id, articulosCategorizados }
        }
      });
    }
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki-categorias.mounted");
      await this.loadCategorias();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswWikiCategorias API