// @code.start: LswTestContextViewer API | @$section: Vue.js (v2) Components » Lsw Test Context Viewer API » LswTestContextViewer component
Vue.component("LswTestContextViewer", {
  template: $template,
  props: {
    testsPage: {
      type: [Object, Boolean],
      default: false,
    }
  },
  data() {
    const testContext = LswTestContext.create({}, this);
    const testAsserter = testContext.$asserter;
    return {
      isStarted: false,
      isFinished: false,
      testAssertions: [],
      testContext,
      testAsserter,
      testCronometer: undefined,
      testContextButtons: this.testsPage ? [{
        text: "🪖 ↗️",
        event: () => this.testsPage.selectSection("coverage")
      }] : [],
    };
  },
  methods: {
    async startTests() {
      this.$trace("lsw-tests-context-viewer.methods.startTests");
      this.isStarted = true;
      this.testCronometer = LswTemporizer.create();
      Export_assert_expanded: {
        const assert = this.testAsserter;
        // Overwrite global assert function:
        window.assert = assert;
        // Inject title feature externally:
        window.assert.title = (title) => {
          this.testAssertions.unshift({ title });
        };
      }
      assert.title("Ready for tests");
      assert.as("starting tests", true);
      this.testContext.start();
      // Run your custom tests:
      await this.callTests();
    },
    async callTests() {
      this.$trace("lsw-tests-context-viewer.methods.callTests");
      // @TODO: call all the tests from here:
      await importer.scriptAsync("./assets/tests/cases/app/start-your-test-here.js");
      await importer.scriptAsync("./assets/tests/cases/framework/lsw.can-find-all-globals.js");
    },
    addAssertion(text, value) {
      this.$trace("lsw-tests-context-viewer.methods.addAssertion");
      this.testAssertions.unshift({
        text,
        value,
        moment: this.testCronometer.getTime()
      });
    },
  },
  async mounted() {
    this.$trace("lsw-tests-context-viewer.mounted");
  }
});
// @code.end: LswTestContextViewer API