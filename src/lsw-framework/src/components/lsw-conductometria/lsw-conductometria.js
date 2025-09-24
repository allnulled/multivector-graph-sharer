// @code.start: LswConductometria API | @$section: Vue.js (v2) Components » LswAgenda API » LswConductometria API » LswConductometria component
Vue.component("LswConductometria", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-conductometria.data");
    return {
      isLoaded: false,
      reportes: [],
    };
  },
  methods: {
    async reloadEverything() {
      this.$trace("lsw-conductometria.methods.reloadEverything");
      this.isLoaded = null;
      const files = await this.$lsw.fs.read_directory("/kernel/agenda/report");
      this.reportes = Object.keys(files);
      Reload_conductometria_fully: {
        await this.$lsw.conductometria.reload(this);
      }
      this.isLoaded = true;
    },
    goToReports() {
      this.$trace("lsw-conductometria.methods.goToReports");
      this.$lsw.dialogs.open({
        id: 'ver-reportes',
        title: "Reportes de conductometría",
        template: `
          <lsw-filesystem-explorer opened-by="/kernel/agenda/report/" :absolute-layout="true" />
        `
      });
    },
    goToScripts() {
      this.$trace("lsw-conductometria.methods.goToScripts");
      this.$lsw.dialogs.open({
        id: 'ver-script',
        title: "Scripts de conductometría",
        template: `
          <lsw-filesystem-explorer opened-by="/kernel/agenda/proto" :absolute-layout="true" />
        `
      });
    },
    async editReport(reporte) {
      this.$trace("lsw-conductometria.methods.editReport");
      this.$lsw.dialogs.open({
        title: "Editar reporte " + reporte,
        template: `
          <lsw-filesystem-explorer
            :opened-by="'/kernel/agenda/report/' + reporte"
            :absolute-layout="true" />
        `,
        factory: {
          data: { reporte }
        }
      });
    },
    openReport(reporteId) {
      this.$trace("lsw-conductometria.methods.openReport");
      this.$lsw.dialogs.open({
        title: "Reproducir reporte " + reporteId,
        template: `
          <lsw-conductometria-report :report-id="'/kernel/agenda/report/' + reporteId" />
        `,
        factory: {
          data: { reporteId }
        }
      });
    },
    showError(error, ...args) {
      Vue.prototype.$lsw.toasts.showError(error, ...args);
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-conductometria.mounted");
      this.$lsw.conductometria = LswConductometria.create(this);
    } catch(error) {
      this.$lsw.toasts.showError(error);
    }
  }
});
// @code.end: LswConductometria API