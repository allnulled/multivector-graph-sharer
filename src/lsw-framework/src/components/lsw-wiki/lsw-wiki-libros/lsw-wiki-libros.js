// @code.start: LswWikiLibros API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswWikiLibros component
Vue.component("LswWikiLibros", {
  name: "LswWikiLibros",
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-wiki-libros.data");
    return {
      selectedLibros: [],
      selectedLibroInfos: [],
      loadedLibros: {},
      libros: false,
    };
  },
  methods: {
    async toggleLibro(libroId) {
      this.$trace("LswWikiLibros.methods.loadLibros");
      const pos = this.selectedLibros.indexOf(libroId);
      if(pos === -1) {
        await this.loadLibro(libroId);
        this.selectedLibros.push(libroId);
      } else {
        this.selectedLibros.splice(pos, 1);
      }
      this.$forceUpdate(true);
    },
    async toggleLibroInfo(libroId) {
      this.$trace("LswWikiLibros.methods.toggleLibroInfo");
      const pos = this.selectedLibroInfos.indexOf(libroId);
      if(pos === -1) {
        this.selectedLibroInfos.push(libroId);
      } else {
        this.selectedLibroInfos.splice(pos, 1);
      }
      this.$forceUpdate(true);
    },
    async loadLibro(libroId) {
      this.$trace("LswWikiLibros.methods.loadLibro");
      const libroData = await this.$lsw.fs.evaluateAsTripiFileOrReturn(`/kernel/wiki/libros/${libroId}`, false);
      if(!libroData) return;
      this.loadedLibros[libroId] = libroData;
      return libroData;
    },
    async loadLibros() {
      this.$trace("LswWikiLibros.methods.loadLibros");
      const librosBrute = await LswWikiUtils.getLibros();
      this.libros = librosBrute;
    },
    getLibroName(file) {
      this.$trace("LswWikiLibros.methods.getLibroName");
      return file.replace(/\.tri(pi)?/g, "")
    },
    async abrirArticulo(articulo, componenteDeArticulo) {
      this.$trace("LswWikiLibros.methods.abrirLibro");
      console.log("Abriendo artículo:", articulo.link);
      componenteDeArticulo.toggleState();
    },
    async editLibro(libro) {
      this.$trace("LswWikiLibros.methods.editLibro");
      await this.$lsw.dialogs.open({
        id: LswRandomizer.getRandomString(10),
        title: "Editar libro",
        template: `
          <lsw-filesystem-explorer
            :absolute-layout="true"
            :opened-by="'/kernel/wiki/libros/' + libro"
          />
        `,
        factory: {
          data: { libro }
        }
      });
    },
    async printLibro(libroId) {
      this.$trace("LswWikiLibros.methods.printLibro");
      const libroTree = await this.loadLibro(libroId);
      const libroTexted = await this.resolveLibroTree(libroTree)
      await this.$lsw.dialogs.open({
        id: LswRandomizer.getRandomString(10),
        title: "Imprimir libro",
        template: `
          <lsw-data-printer-report :input="libro" />
        `,
        factory: {
          data: { libro: libroTexted }
        }
      });
    },
    async resolveLibroTree(treeNode) {
      this.$trace("LswWikiLibros.methods.resolveLibroTree");
      if(typeof treeNode === "undefined") {
        return "";
      }
      let out = "";
      const { id, link, subtree } = treeNode;
      const reference = id || link;
      const articulosCoincidentes = await this.$lsw.database.selectMany("Articulo", articulo => {
        return articulo.tiene_titulo === reference;
      });
      out += `### ${id}\n\n`;
      if(articulosCoincidentes && articulosCoincidentes.length) {
        const articuloTextualizado = articulosCoincidentes.map(articulo => articulo.tiene_contenido).join("\n\n");
        out += `${articuloTextualizado || ""}\n\n`;
      }
      if(typeof subtree === "object") {
        for(let prop in subtree) {
          out += await this.resolveLibroTree(subtree[prop]);
        }
      }
      return out;
    },
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki-libros.mounted");
      await this.loadLibros();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswWikiLibros API