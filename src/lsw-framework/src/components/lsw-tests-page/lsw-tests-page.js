// @code.start: LswTestsPage API | @$section: Vue.js (v2) Components » Lsw Unit Test Page » LswTestsPage component
Vue.component("LswTestsPage", {
  template: $template,
  props: {

  },
  data() {
    return {
      selectedSection: "coverage", // also: "tester", "coverage"
      initializationError: false,
      choosenTester: false,
    };
  },
  methods: {
    selectSection(subsection) {
      this.$trace("lsw-tests-page.methods.selectSection");
      this.selectedSection = subsection;
    },
    async initializeTester() {
      this.$trace("lsw-tests-page.methods.initializeTester");
      try {
        const testcases = await importer.json("assets/tests/urls.json");
        this.choosenTester = LswTester.create().define(testcases).options({
          onAnything(event) {
            console.log("eventuated:", event);
          }
        });
      } catch (error) {
        this.initializationError = error;
        this.$lsw.toasts.showError(error);
        console.log(error);
        throw error;
      }
    }
  },
  watch: {},
  async mounted() {
    this.$trace("lsw-tests-page.mounted");
    await this.initializeTester();
  }
});
// @code.end: LswTestsPage API