// @code.start: NewCanvasExperiment1 API | @$section: Vue.js (v2) Components » NewCanvasExperiment1 component
(function () {

  const Cc = {};
  Cc.width = 250;
  Cc.height = 250;
  Cc.fuga = {
    x: 125,
    y: 125,
  };

  Vue.component("NewCanvasExperiment1", {
    template: $template,
    props: {},
    data() {
      return {

      };
    },
    methods: {
      load() {
        const canvas = this.$refs.canvas1;
        const context = canvas.getContext("2d");
        // context.fillRect(Cc.fuga.x, Cc.fuga.y, 1, 1);
        console.log(canvas.width / 2);
        console.log(canvas.height / 2);
        context.fillRect(canvas.width / 2, canvas.height / 2, 1, 1);
      }
    },
    watch: {},
    mounted() {
      this.load();
    }
  });

})();
// @code.end: NewCanvasExperiment1 API