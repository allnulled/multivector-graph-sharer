// @code.start: LswAgendaLimitadorSearch API | @$section: Vue.js (v2) Components » LswAgenda API » LswAgendaLimitadorSearch API » LswAgendaLimitadorSearch component
Vue.component("LswAgendaLimitadorSearch", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-agenda-limitador-search.data");
    return {
      isLoaded: false,
    };
  },
  methods: {
    async loadRows() {
      this.$trace("lsw-agenda-limitador-search.methods.loadRows");
      this.rows = await this.$lsw.database.selectMany("Limitador", it => true);
      this.isLoaded = true;
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-agenda-limitador-search.mounted");
      this.loadRows();
    } catch(error) {
      console.log(error);
    }
  }
});
// @code.end: LswAgendaLimitadorSearch API