// @code.start: LswAgendaConceptoAdd API | @$section: Vue.js (v2) Components » LswAgenda API » LswAgendaConceptoAdd API » LswAgendaConceptoAdd component
Vue.component("LswAgendaConceptoAdd", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-agenda-concepto-add.data");
    return {
      // 
    };
  },
  methods: {
    async insertConcepto(v) {
      this.$trace("lsw-agenda-concepto-add.methods.insertConcepto");
      await this.$lsw.database.insert("Concepto", v);
      // *@TODO: should redirect
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-agenda-concepto-add.mounted");
    } catch(error) {
      console.log(error);
    }
  }
});
// @code.end: LswAgendaConceptoAdd API