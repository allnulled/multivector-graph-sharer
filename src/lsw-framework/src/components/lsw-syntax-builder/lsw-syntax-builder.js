// @code.start: LswSyntaxBuilder API | @$section: Vue.js (v2) Components » LswSyntaxBuilder component
Vue.component("LswSyntaxBuilder", {
  template: $template,
  props: {

  },
  data() {
    this.$trace("lsw-syntax-builder.data");
    return {
      selectedPage: "editor", // also: "editor", "tester"
      source: "",
      compiler: false,
      test: "",
      output: false,
      outputToJson: "",
      error: false,
      syntaxBuilderButtons: []
    };
  },
  methods: {
    async loadLibraries() {
      this.$trace("lsw-syntax-builder.methods.loadLibraries");
      await LswLazyLoads.loadPegjs()
    },
    selectPage(page) {
      this.$trace("lsw-syntax-builder.methods.selectPage");
      try {
        if (page === "tester") {
          this.compile();
          this.setError(false);
        }
        this.selectedPage = page;
      } catch (error) {
        console.log(error);
        this.setError(error);
      }
    },
    setError(error = undefined) {
      this.$trace("lsw-syntax-builder.methods.setError");
      this.error = error;
      this.$forceUpdate(true);
    },
    compile() {
      this.$trace("lsw-syntax-builder.methods.compile");
      this.compiler = PEG.buildParser(this.source);
    },
    testSyntax() {
      this.$trace("lsw-syntax-builder.methods.testSyntax");
      this.output = this.compiler.parse(this.test);
    }
  },
  watch: {
    output(newValue) {
      this.$trace("lsw-syntax-builder.watch.output");
      this.outputToJson = JSON.stringify(newValue, null, 2);
    }
  },
  async mounted() {
    try {
      this.$trace("lsw-syntax-builder.mounted");
      await this.loadLibraries();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswSyntaxBuilder API
