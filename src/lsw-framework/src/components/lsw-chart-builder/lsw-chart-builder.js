// @code.start: LswChartBuilder API | @$section: Vue.js (v2) Components » LswChartBuilder component
Vue.component("LswChartBuilder", {
  template: $template,
  props: {
    
  },
  data() {
    this.$trace("lsw-chart-builder.data");
    return {
      selectedPage: "editor", // also: "editor", "grafica"
      placeholder: `const data = [{ altura: 10, peso: 20 },{ altura: 12, peso: 30 },{ altura: 14, peso: 40 }];
const marks = [];
marks.push(Plot.barY(data, { x: (it, i) => i, y: "altura", fill: "steelblue", opacity: 0.6 }));
marks.push(Plot.barY(data, { x: (it, i) => i, y: "peso", fill: "orange", opacity: 0.6 }));
return Plot.plot({ marks });`,
      source: ``,
      error: false,
    };
  },
  methods: {
    goToEditor() {
      this.$trace("lsw-chart-builder.methods.goToEditor");
      this.selectedPage = "editor";
    },
    goToChart() {
      this.$trace("lsw-chart-builder.methods.goToChart");
      this.selectedPage = "grafica";
      this.render();
    },
    async loadLibraries() {
      this.$trace("lsw-chart-builder.methods.loadLibraries");
      await LswLazyLoads.loadD3js();
      await LswLazyLoads.loadObservablePlot();
    },
    async render() {
      this.$trace("lsw-chart-builder.methods.render");
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
    this.$trace("lsw-chart-builder.mounted");
    await this.loadLibraries();
  },
  unmount() {
    this.$trace("lsw-chart-builder.unmounted");
  }
});
// @code.end: LswChartBuilder API