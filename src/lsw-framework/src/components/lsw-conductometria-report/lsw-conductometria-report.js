// @code.start: LswConductometriaReport API | @$section: Vue.js (v2) Components » LswConductometriaReport API » LswConductometriaReport API » LswConductometriaReport component
Vue.component("LswConductometriaReport", {
  name: "LswConductometriaReport",
  template: $template,
  props: {
    reportId: {
      type: String,
      required: true,
    }
  },
  data() {
    this.$trace("lsw-conductometria-report.data");
    return {
      isLoaded: false,
      report: false,
    };
  },
  methods: {
    async loadReport() {
      this.$trace("lsw-conductometria-report.methods.loadReport");
      this.isLoaded = false;
      const reportSource = await this.$lsw.fs.read_file(this.reportId);
      const reportInstance = LswConductometriaReport.create(reportSource, this);
      const report = await reportInstance.buildReport();
      this.report = report;
      this.$nextTick(() => {this.isLoaded = true;});
    },
    goToReportTitle(reportIndex) {
      this.$trace("lsw-conductometria-report.methods.loadReport");
      const presuntReportTitle = this.$refs["report_" + reportIndex];
      try {
        presuntReportTitle[0].$el.scrollIntoView();
      } catch (error) {
        console.log(error);
      }
    },
    async openReportSource() {
      this.$trace("lsw-conductometria-report.methods.openReportSource");
      await this.$lsw.dialogs.open({
        title: "Editar reporte",
        template: `
          <lsw-filesystem-explorer :opened-by="reportId" :absolute-layout="true" />
        `,
        factory: {
          data: {
            reportId: this.reportId
          }
        }
      });
    },
  },
  watch: {

  },
  computed: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-conductometria-report.mounted");
      await this.loadReport();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswConductometriaReport API
