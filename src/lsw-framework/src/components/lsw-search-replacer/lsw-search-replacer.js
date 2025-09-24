// @code.start: LswSearchReplacer API | @$section: Vue.js (v2) Components » LswSearchReplacer component
Vue.component("LswSearchReplacer", {
  template: $template,
  props: {
    input: {
      type: String,
      default: () => false,
    },
    initialSearch: {
      type: String,
      default: () => "",
    },
    initialReplace: {
      type: String,
      default: () => "",
    },
    onAccept: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onFinally: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    this.$trace("lsw-search-replacer.data");
    return {
      currentInput: this.input,
      currentMatch: false,
      search: this.initialSearch || "",
      searchAsRegexp: false,
      replace: this.initialReplace || "",
    };
  },
  methods: {
    toggleRegexpMode() {
      this.$trace("lsw-search-replacer.methods.toggleRegexpMode");
      this.searchAsRegexp = !this.searchAsRegexp;
    },
    accept() {
      this.$trace("lsw-search-replacer.methods.accept");
      this.onAccept(this.currentInput, this);
      this.onFinally(this.currentInput, this);
    },
    cancel() {
      this.$trace("lsw-search-replacer.methods.cancel");
      this.onCancel(this.currentInput, this);
      this.onFinally(this.currentInput, this);
    },
    illuminateMatches() {
      this.$trace("lsw-search-replacer.methods.illuminateMatches");
      if(!this.searchAsRegexp) {

      }
    },
    replaceAllMatches() {
      this.$trace("lsw-search-replacer.methods.replaceAllMatches");
      if(this.searchAsRegexp) {
        const regexp = new RegExp(this.search, "g");
        this.currentInput = this.currentInput.replaceAll(regexp, this.replace);
      } else {
        this.currentInput = this.currentInput.replaceAll(this.search, this.replace);
      }
    },
  },
  watch: {},
  mounted() {
    this.$trace("lsw-search-replacer.mounted");
    
  },
  unmounted() {
    this.$trace("lsw-search-replacer.unmounted");
    
  }
});
// @code.end: LswSearchReplacer API