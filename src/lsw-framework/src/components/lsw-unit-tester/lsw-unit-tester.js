// @code.start: LswUnitTester API | @$section: Vue.js (v2) Components » Lsw Unit Tester API » LswUnitTester component
Vue.component("LswUnitTester", {
  template: $template,
  props: {
    test: {
      type: Function,
      required: true,
    },
    autorun: {
      type: Boolean,
      default: true,
    },
    onFinish: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      hasRunTests: false,
      isExpanded: false,
      report: false,
      selectedTests: [],
      isSourceAccessed: false,
      error: false,
    };
  },
  methods: {
    showError(error) {
      this.error = error;
      this.$forceUpdate(true);
    },
    toggleTest(testIndex) {
      const pos = this.selectedTests.indexOf(testIndex);
      if(pos !== -1) {
        this.selectedTests.splice(pos, 1);
      } else {
        this.selectedTests.push(testIndex);
      }
    },
    toggleDetails() {
      this.isExpanded = !this.isExpanded;
    },
    async setupTest() {
      this.$trace("lsw-unit-tester.methods.setupTest");
      // @OK.
    },
    createBlankReport() {
      return {
        testCollectionId: 'not specified',
      }
    },
    async runTest() {
      this.$trace("lsw-unit-tester.methods.runTest");
      try {
        console.log("[*] Starts test...")
        const tester = await this.test.call();
        console.log("[*] Test ok!");
        this.hasRunTests = true;
        if(tester instanceof LswTester) {
          this.report = tester.getReport();
        } else {
          this.report = this.createBlankReport();
        }
        if(typeof this.onFinish === "function") {
          this.onFinish(this.report, this);
        }
      } catch (error) {
        console.log("[!] Test failed!");
        this.showError(error);
        console.log(error);
      }
    },
    toggleSource() {
      this.$trace("lsw-unit-tester.methods.toggleSource");
      this.isSourceAccessed = !this.isSourceAccessed;
    },
  },
  watch: {},
  async mounted() {
    this.$trace("lsw-unit-tester.mounted");
    await this.setupTest();
    if(this.autorun) {
      this.runTest();
    }
  }
});
// @code.end: LswUnitTester API