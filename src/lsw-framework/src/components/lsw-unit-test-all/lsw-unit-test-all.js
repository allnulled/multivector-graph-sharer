// @code.start: LswUnitTestAll API | @$section: Vue.js (v2) Components » Lsw Unit Tester API » LswUnitTestAll component
Vue.component("LswUnitTestAll", {
  template: $template,
  props: {
    
  },
  data() {
    return {
      mode: false,
      autorunOption: false,
    };
  },
  methods: {
    openTests() {
      this.autorunOption = false;
      this.mode = "open";
    },
    runTests() {
      this.autorunOption = true;
      this.mode = "run";
    },
    goBack() {
      this.autorunOption = false;
      this.mode = false;
    }
  },
  watch: {},
  async mounted() {
    this.$trace("lsw-unit-test-all.mounted");
  }
});
// @code.end: LswUnitTestAll API