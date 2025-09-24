// @code.start: LswSimpleChart API | @$section: Vue.js (v2) Components » LswSimpleChart component
Vue.component("LswSimpleChart", {
  template: $template,
  props: {
    initialData: {
      type: Array,
      default: () => [],
    },
    initialProperty: {
      type: String,
      default: () => "prop",
    },
    initialSource: {
      type: String,
      default: () => `return Plot.plot({
  x: { grid: true, label: "índice" },
  y: { grid: true },
  marks: [
    Plot.barY(this.rows, {
      x: (it, index) => index,
      y: this.property,
      fill: "steelblue",
      channels: this.rows.reduce((output, row) => {
        for(let prop in row) {
          if(!(prop in output)) {
            output[prop] = prop;
          }
        }
        return output;
      }, {}),
      opacity: 0.6,
      tip: true,
    })
  ],
});`
    }
  },
  data() {
    this.$trace("lsw-simple-chart.data");
    return {
      property: this.initialProperty,
      rows: this.initialData,
      source: this.initialSource,
      error: false,
    };
  },
  methods: {
    async loadLibraries() {
      this.$trace("lsw-simple-chart.methods.loadLibraries");
      await LswLazyLoads.loadD3js();
      await LswLazyLoads.loadObservablePlot();
    },
    async render() {
      this.$trace("lsw-simple-chart.methods.render");
      try {
        const chartElement = await LswUtils.createAsyncFunction(this.source).call(this);
        this.$refs.chartHolder.appendChild(chartElement);
        this.error = false;
      } catch (error) {
        this.error = error;
        this.$lsw.toasts.showError(error);
      }
    }
  },
  async mounted() {
    this.$trace("lsw-simple-chart.mounted");
    await this.loadLibraries();
    await this.render();
  },
  unmount() {
    this.$trace("lsw-simple-chart.unmounted");
  }
});
// @code.end: LswSimpleChart API