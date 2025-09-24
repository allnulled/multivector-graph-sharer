// @code.start: LswTestsPage API | @$section: Vue.js (v2) Components » Lsw Unit Test Page » LswTestsPage component
Vue.component("LswTestsPage", {
  template: $template,
  props: {

  },
  data() {
    return {
      isLoaded: false,
      isRunning: false,
      isDownloaded: false,
      isCompleted: false,
      section: "available",
      baseUrl: "assets/tests/cases/",
      available: [],
      selected: [],
      downloaded: [],
    };
  },
  methods: {
    goToSection(section) {
      this.$trace("lsw-tests-page.methods.goToSection");
      this.section = section;
    },
    backToTests() {
      this.$trace("lsw-tests-page.methods.backToTests");
      this.resetState();
    },
    resetState() {
      this.$trace("lsw-tests-page.methods.resetState");
      this.isLoaded = false;
      this.isRunning = false;
      this.isDownloaded = false;
    },
    selectTest(test) {
      const pos = this.selected.indexOf(test);
      if(pos !== -1) {
        this.selected.splice(pos, 1);
      } else {
        this.selected.push(test);
      }
    },
    resetSelectedTests() {
      this.$trace("lsw-tests-page.methods.resetSelectedTests");
      this.selected = [].concat(this.available);
    },
    async loadTests() {
      this.$trace("lsw-tests-page.methods.loadTests");
      try {
        this.available = await importer.json("assets/tests/testcases.json");
        this.selected = [].concat(this.available);
        this.isLoaded = true;
      } catch (error) {
        this.$lsw.toasts.showError(error);
      }
    },
    async downloadTests() {
      this.$trace("lsw-tests-page.methods.downloadTests");
      try {
        const allDownloads = [];
        for (let index = 0; index < this.selected.length; index++) {
          const selectedTest = this.selected[index];
          const testCallbackPromise = importer.scriptAsync(selectedTest);
          allDownloads.push(testCallbackPromise)
        }
        const testsResult = await Promise.all(allDownloads);
        const testsFormatted = LswUtils.flattenObjects(testsResult, {
          keyMapper(key, totalKeys, indexKey) {
            return `[T${('' + (totalKeys + 1)).padStart(4, '0')}] ${key}`;
          }
        });
        this.downloaded = testsFormatted;
        this.isDownloaded = true;
      } catch (error) {
        this.$lsw.toasts.showError(error);
      }
    },
    selectAllTests() {
      this.$trace("lsw-tests-page.methods.selectAllTests");
      if(this.available.length === this.selected.length ) {
        this.selected = [];
      } else {
        this.selected = [].concat(this.available);
      }
      this.$forceUpdate(true);
    },
    shortSubpath(subpath) {
      return subpath.replace(this.baseUrl, "");
    },
    async runTests() {
      this.$trace("lsw-tests-page.methods.runTests");
      try {
        this.isRunning = true;
        this.goToSection("running");
        // @TODO: continue running tests:
      } catch (error) {
        this.showError(error);
      }
    },
    interruptTests() {
      this.$trace("lsw-tests-page.methods.interruptTests");
      this.isRunning = false;
    },
    async start() {
      this.$trace("lsw-tests-page.methods.start");
      try {
        await this.downloadTests();
        await this.runTests();
      } catch (error) {
        this.showError(error);
      }
    }
  },
  watch: {},
  async mounted() {
    this.$trace("lsw-tests-page.mounted");
    await this.loadTests();
  }
});
// @code.end: LswTestsPage API