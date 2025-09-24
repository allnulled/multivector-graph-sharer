// @code.start: LswUnitTestPage API | @$section: Vue.js (v2) Components » Lsw Unit Test Page » LswUnitTestPage component
Vue.component("LswUnitTestPage", {
  template: $template,
  props: {
    
  },
  data() {
    return {
      testsBaseUrl: "assets/tests/cases/",
      isLoaded: false,
      isReady: false,
      availableTests: false,
      selectedTests: [],
      downloadedTests: [],
    };
  },
  methods: {
    backToTests() {
      this.$trace("lsw-unit-test-page.methods.backToTests");
      this.isReady = false;
    },
    async loadTests() {
      this.$trace("lsw-unit-test-page.methods.loadTests");
      this.availableTests = await importer.json("assets/tests/testcases.json");
      this.selectedTests = [].concat(this.availableTests);
    },
    async start() {
      const allDownloads = [];
      for(let index=0; index<this.selectedTests.length; index++) {
        const selectedTest = this.selectedTests[index];
        const testCallbackPromise = importer.scriptSrc(selectedTest);
        allDownloads.push(testCallbackPromise)
      }
      await Promise.all(allDownloads);
      this.downloadedTests = LswTests.all();
      console.log(this.downloadedTests);
      this.isReady = true;
    }
  },
  watch: {},
  async mounted() {
    this.$trace("lsw-unit-test-page.mounted");
    await this.loadTests();
    this.isLoaded = true;
  }
});
// @code.end: LswUnitTestPage API