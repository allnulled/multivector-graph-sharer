// @code.start: LswUnitTesterCollection API | @$section: Vue.js (v2) Components » LswUnitTesterCollection component
Vue.component("LswUnitTesterCollection", {
  template: $template,
  props: {
    allTests: {
      type: Array,
      required: true,
    },
    autorun: {
      type: Boolean,
      default: () => false,
    }
  },
  data() {
    this.$trace("lsw-unit-tester-collection.data");
    return {
      isCompleted: false,
      isPassed: undefined,
      startedTests: [],
      testResults: [],
    };
  },
  methods: {
    async nextTest(previousReport = false) {
      this.$trace("lsw-unit-tester-collection.methods.nextTest");
      if(typeof previousReport === 'object') {
        this.testResults.push(previousReport.result);
      }
      const shouldNotInterrupt = this.autorun || force;
      if(!shouldNotInterrupt) {
        return;
      }
      if(this.allTests.length === this.startedTests.length) {
        this.isCompleted = true;
        this.calculatePass();
        return;
      }
      try {
        const nextTestIndex = this.startedTests.length;
        const nextTestCallback = this.allTests[nextTestIndex];
        this.startedTests.push(nextTestCallback);
      } catch (error) {
        this.startedTests.push(error);
        console.log(error);
      }
    },
    calculatePass() {
      let isPassed = true;
      Iterating_results:
      for(let index=0; index<this.testResults.length; index++) {
        const result = this.testResults[index];
        const isOk = ["defined", "passed"].indexOf(result) !== -1;
        if(!isOk) {
          isPassed = false;
          break Iterating_results;
        }
      }
      this.isPassed = isPassed;
    },
    startTest(testIndex) {
      this.allTests[testIndex].$lswTester = {
        state: "started",
      };
      const nextTestCallback = this.allTests[testIndex];
      this.startedTests.push(nextTestCallback);
      this.$forceUpdate(true);
    },
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-unit-tester-collection.mounted");
      this.nextTest();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswUnitTesterCollection API