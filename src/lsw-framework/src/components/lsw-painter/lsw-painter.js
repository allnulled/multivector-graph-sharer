// @code.start: LswPainter API | @$section: Vue.js (v2) Components » LswPainter component
Vue.component("LswPainter", {
  template: $template,
  props: {

  },
  data() {
    this.$trace("lsw-painter.data");
    return {
      selectedPage: "editor", // also: "editor", "canvas"
      source: "",
      error: false,
      placeholder: `const { Assets, Sprite } = PIXI;
await app.init({ background: '#1099bb', });
const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
const bunny = new Sprite(texture);
bunny.anchor.set(0.5);
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
app.stage.addChild(bunny);
app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
});`
    };
  },
  methods: {
    async loadLibraries() {
      this.$trace("lsw-painter.methods.loadLibraries");
      LswLazyLoads.loadPixijs();
    },
    goToCanvas() {
      this.$trace("lsw-painter.methods.goToCanvas");
      this.selectedPage = "canvas";
      this.render();
    },
    goToEditor() {
      this.$trace("lsw-painter.methods.goToEditor");
      this.selectedPage = "editor";
    },
    async render() {
      try {
        let js = "";
        js += "const app = new PIXI.Application();\n";
        js += this.source;
        js += "\nreturn app;";
        const app = await LswUtils.createAsyncFunction(js).call(this);
        this.$refs.paintHolder.innerHTML = "";
        this.$refs.paintHolder.appendChild(app.canvas);
        this.error = false;
      } catch (error) {
        this.error = error;
        this.$lsw.toasts.showError(error);
      }
    }
  },
  watch: {},
  mounted() {
    this.$trace("lsw-painter.mounted");
    this.loadLibraries();
  },
  unmounted() {
    this.$trace("lsw-painter.unmounted");

  }
});
// @code.end: LswPainter API