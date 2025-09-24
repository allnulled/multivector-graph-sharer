// @code.start: LswSpontaneousFormNota API | @$section: Módulo org.allnulled.lsw-conductometria » Vue.js (v2) Components » LswSpontaneousFormNota API » LswSpontaneousFormAccion component
Vue.component("LswSpontaneousFormNota", {
  template: $template,
  props: {
    onSubmitted: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    this.$trace("lsw-spontaneous-form-nota.data");
    return this.getInitialData({

    });
  },
  methods: {
    getInitialData(extendedWith = {}) {
      return Object.assign({
        tiene_titulo: "",
        tiene_contenido: "",
        tiene_fecha: LswTimer.utils.fromDateToDatestring(new Date()),
        tiene_categorias: "",
      }, extendedWith);
    },
    async addNota() {
      this.$trace("lsw-spontaneous-form-nota.methods.addNota");
      const nota = {
        tiene_titulo: this.tiene_titulo,
        tiene_contenido: this.tiene_contenido,
        tiene_fecha: this.tiene_fecha,
        tiene_categorias: this.tiene_categorias,
      };
      if(nota.tiene_titulo.trim() === "") {
        const superaLimite = nota.tiene_contenido.length > 30;
        nota.tiene_titulo = nota.tiene_contenido.substr(0,30) + (superaLimite ? "..." : "");
      }
      const notaId = await this.$lsw.database.insert("Nota", nota);
      Object.assign(this, this.getInitialData());
      this.$forceUpdate(true);
      this.focusContenidos();
      if(this.onSubmitted) {
        this.onSubmitted(notaId, nota, this);
      }
    },
    focusContenidos() {
      this.$trace("lsw-spontaneous-form-nota.methods.addNota");
      // this.$refs.tiene_contenido.focus();
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-spontaneous-form-nota.mounted");
      // 
    } catch(error) {
      console.log(error);
    }
  }
});
// @code.end: LswSpontaneousFormNota API