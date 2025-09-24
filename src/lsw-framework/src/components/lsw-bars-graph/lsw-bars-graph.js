// @code.start: LswBarsGraph API | @$section: Vue.js (v2) Components » LswBarsGraph component
Vue.component("LswBarsGraph", {
  template: $template,
  props: {
    sample: {
      type: Object,
      required: true,
    },
    keys: {
      type: Array,
      required: true,
    },
    negativeKeys: {
      type: Array,
      default: () => [],
    },
    propId: {
      type: String,
      default: () => false,
    },
    propOptions: {
      type: String,
      default: () => "$options",
    },
  },
  data() {
    this.$trace("lsw-bars-graph.data");
    const currentSample = LswBarsGraph.toSample(this.sample, this.propId, this.keys, this.propOptions);
    return {
      currentPropertyView: undefined,
      currentSample,
    };
  },
  methods: {
    selectPropertyView(propIndex) {
      this.$trace("lsw-bars-graph.methods.selectPropertyView");
      const isSame = this.currentPropertyView === propIndex;
      this.currentPropertyView = isSame ? undefined : propIndex;
    },
    selectPropertyViewByName(propId) {
      this.$trace("lsw-bars-graph.methods.selectPropertyView");
      const propIndex = this.keys.indexOf(propId);
      if(propIndex === -1) return;
      const isSame = this.currentPropertyView === propIndex;
      this.currentPropertyView = isSame ? undefined : propIndex;
    },
    getColor(propId, value) {
      this.$trace("lsw-bars-graph.methods.getColor");
      const polaridad = this.negativeKeys.indexOf(propId) === -1;
      if(polaridad) {
        if (value <= 20) {
          return "red" ;
        } else if (value <= 40) {
          return "violet" ;
        } else if (value <= 60) {
          return "white";
        } else if (value <= 80) {
          return "yellow" ;
        } else {
          return "lime" ;
        }
      } else {
        if (value <= 20) {
          return "lime" ;
        } else if (value <= 40) {
          return "yellow" ;
        } else if (value <= 60) {
          return "white" ;
        } else if (value <= 80) {
          return "violet";
        } else {
          return "red" ;
        }
      }
    }
  },
  mounted() {
    this.$trace("lsw-bars-graph.mounted");

  },
  unmount() {
    this.$trace("lsw-bars-graph.unmounted");
  }
});
// @code.end: LswBarsGraph API