// @code.start: LswSpontaneousFormArticulo API | @$section: Módulo org.allnulled.lsw-conductometria » Vue.js (v2) Components » LswSpontaneousFormArticulo API » LswSpontaneousFormAccion component
Vue.component("LswSpontaneousFormArticulo", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-spontaneous-form-articulo.data");
    return {
      ...this.getInitialContents(),
      opcionesGarantia: {
        "ns/nc": "ns/nc",
        "muy inestable": "muy inestable",
        "inestable": "inestable",
        "estable": "estable",
        "muy estable": "muy estable",
        "popular": "popular",
      }
    };
  },
  methods: {
    getInitialContents() {
      return Object.assign({}, {
        tiene_titulo: "",
        tiene_contenido: "",
        tiene_categorias: "",
        tiene_garantia: "ns/ns",
        tiene_fecha: LswTimer.utils.fromDateToDatestring(new Date()),
        tiene_tags: "",
      });
    },
    async addArticulo() {
      this.$trace("lsw-spontaneous-form-articulo.methods.addArticulo");
      try {
      await this.$lsw.database.insert("Articulo", {
        tiene_titulo: this.tiene_titulo,
        tiene_contenido: this.tiene_contenido,
        tiene_categorias: this.tiene_categorias,
        tiene_garantia: this.tiene_garantia,
        tiene_fecha: this.tiene_fecha,
        tiene_tags: this.tiene_tags,
      });
      this.$lsw.toasts.send({
        title: "Artículo insertado",
        message: "El artículo fue insertado con éxito."
      });
      Object.assign(this, this.getInitialContents());
    } catch (error) {
      console.log(error);
      this.$lsw.toasts.send({
        title: "Error al insertar artículo",
        message: "Hubo errores al insertar el artículo: " + error.message
      });
    }
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-spontaneous-form-articulo.mounted");
      // 
    } catch(error) {
      console.log(error);
    }
  }
});
// @code.end: LswSpontaneousFormArticulo API