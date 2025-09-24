// @code.start: LswTesterModuleViewer API | @$section: Vue.js (v2) Components » Lsw Unit Test Page » LswTesterModuleViewer component
window.asserters = [];
Vue.component("LswTesterModuleViewer", {
  template: $template,
  props: {
    tester: {
      type: Object,
      required: true,
    },
    test: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      state: "not started", // "started", "ignored", "passed" or "failed"
      assertions: [],
    };
  },
  methods: {
    addAssertion(assertionData) {
      this.$trace("lsw-tester-module-viewer.methods.addAssertion");
      this.assertions = [].concat(this.assertions).concat([assertionData]);
      this.$forceUpdate(true);
    },
    changeState(newState) {
      this.$trace("lsw-tester-module-viewer.methods.changeState");
      this.state = newState;
      this.$forceUpdate(true);
    }
  },
  watch: {},
  async mounted() {
    this.$trace("lsw-tests-page.mounted");
    asserters.push(this);
  }
});
// @code.end: LswTesterModuleViewer API