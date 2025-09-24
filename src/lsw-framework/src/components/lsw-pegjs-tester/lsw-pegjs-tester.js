// @code.start: LswPegjsTester API | @$section: Vue.js (v2) Components » Lsw SchemaBasedForm API » LswPegjsTester component
Vue.component("LswPegjsTester", {
  template: $template,
  props: {
    source: {
      type: String,
      default: () => 'Example = "0"',
    }
  },
  data() {
    this.$trace("lsw-pegjs-tester.data");
    return {
      isLoaded: false,
      currentAst: false,
      currentParserSource: this.source,
      currentParser: false,
      currentSnippet: "0",
      currentParserSyntaxError: false,
      currentSnippetSyntaxError: false,
      showingPaneOf: 'parser',
    };
  },
  methods: {
    async loadDependencies() {
      await LswLazyLoads.loadPegjs();
    },
    showParserError(error) {
      this.$refs.parserErrorViewer.setError(error);
    },
    showSnippetError(error) {
      this.$refs.snippetErrorViewer.setError(error);
    },
    compileSyntax() {
      this.$trace("lsw-pegjs-tester.methods.compileSyntax");
      try {
        this.currentParser = PEG.buildParser(this.currentParserSource);
        this.showParserError(false);
      } catch (error) {
        this.showParserError(error);
        this.$lsw.toasts.showError(error);
        throw error;
      }
    },
    compileParser() {
      this.$trace("lsw-pegjs-tester.methods.compileParser");
      this.compileSyntax();
      this.showingPaneOf = 'snippet';
    },
    resetState() {
      this.$trace("lsw-pegjs-tester.methods.resetState");
      this.currentSnippetSyntaxError = false;
      this.currentAst = false;
    },
    testSnippet() {
      this.$trace("lsw-pegjs-tester.methods.testSnippet");
      try {
        this.resetState();
        Check_it_has_parser: {
          if (!this.currentParser) {
            throw new Error("No parser selected on «testSnippet»");
          }
        }
        Parse_contents: {
          try {
            this.currentAst = this.currentParser.parse(this.currentSnippet);
            this.currentSnippetSyntaxError = false;
            this.showSnippetError(false);
          } catch (error) {
            this.showSnippetError(error);
            throw error;
          }
        }
      } catch (error) {
        this.$lsw.toasts.showError(error);
      }
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-pegjs-tester.mounted");
      await this.loadDependencies();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswPegjsTester API