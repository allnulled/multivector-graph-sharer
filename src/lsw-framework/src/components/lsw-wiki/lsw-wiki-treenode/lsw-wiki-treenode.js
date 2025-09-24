// @code.start: LswWikiTreenode API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswWikiTreenode component
Vue.component("LswWikiTreenode", {
  name: "LswWikiTreenode",
  template: $template,
  props: {
    initialInput: {
      type: Array,
      default: () => [],
    },
    initialSettings: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    this.$trace("lsw-wiki-treenode.data");
    return {
      treeNode: this.initialInput || [],
    };
  },
  methods: {
    
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki-treenode.mounted");
      
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswWikiTreenode API