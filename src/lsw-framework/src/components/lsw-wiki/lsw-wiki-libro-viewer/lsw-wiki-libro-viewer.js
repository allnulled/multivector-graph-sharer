// @code.start: LswWikiLibroViewer API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswWikiLibroViewer component
Vue.component("LswWikiLibroViewer", {
  name: "LswWikiLibroViewer",
  template: $template,
  props: {
    idHeredado: {
      type: Array,
      default: () => [],
    },
    indiceDeArbol: {
      type: Number,
      default: () => 0,
    },
    arbol: {
      type: Object,
      required: true,
    },
    onClickLink: {
      type: [Boolean, Function],
      default: () => false,
    },
    onClickClip: {
      type: Function,
      default: () => {},
    }
  },
  data() {
    this.$trace("lsw-wiki-libro-viewer.data");
    return {
      isSelected: false,
      isShowingTree: false,
      isShowingDefinition: false,
    };
  },
  methods: {
    getIdFor(node) {
      this.$trace("lsw-wiki-libro-viewer.methods.getIdFor");
      const lastPartId = node.id || node.link;
      return [].concat(this.idHeredado).concat([lastPartId]);
    },
    toggleState() {
      this.$trace("lsw-wiki-libro-viewer.methods.toggleState");
      this.isSelected = !this.isSelected;
    },
    toggleTree() {
      this.$trace("lsw-wiki-libro-viewer.methods.toggleTree");
      this.isShowingTree = !this.isShowingTree;
    },
    toggleDefinition() {
      this.$trace("lsw-wiki-libro-viewer.methods.toggleDefinition");
      this.isShowingDefinition = !this.isShowingDefinition;
    },
    abrirLink(nodo) {
      this.$trace("lsw-wiki-libro-viewer.methods.abrirLink");
      if(this.onClickLink) {
        this.onClickLink(nodo, this);
      } else {
        this.toggleState();
      }
    },
    abrirClip(nodo) {
      this.$trace("lsw-wiki-libro-viewer.methods.abrirClip");
      this.onClickClip(nodo, this);
    }
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki-libro-viewer.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswWikiLibroViewer API