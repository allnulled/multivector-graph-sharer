// @code.start: LswWikiTree API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswWikiTree component
Vue.component("LswWikiTree", {
  name: "LswWikiTree",
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
    this.$trace("lsw-wiki-tree.data");
    const initialData = this.validateInput(this.initialInput || {});
    return {
      selectedNodes: [],
      treeData: initialData,
    };
  },
  methods: {
    validateInput(jsonTree) {
      this.$trace("LswWikiTree.methods.validateInput");
      $ensure({ jsonTree }, 1).to.be.array().its("length").type("number");
      return jsonTree;
    },
    toggleNode(nodeId) {
      this.$trace("LswWikiTree.methods.toggleNode");
      const pos = this.selectedNodes.indexOf(nodeId);
      if(pos === -1) {
        this.selectedNodes.push(nodeId);
      } else {
        this.selectedNodes.splice(nodeId, 1);
      }
    }
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki-tree.mounted");
      
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswWikiTree API