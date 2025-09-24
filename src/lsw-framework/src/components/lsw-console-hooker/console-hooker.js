// @code.start: LswConsoleHooker API | @$section: Vue.js (v2) Components » LswConsoleHooker API » LswConsoleHooker component
Vue.component("LswConsoleHooker", {
  template: $template,
  props: {},
  data() {
    return {

    }
  },
  methods: {

    async loadEruda() {
      this.$trace("console-hooker.methods.loadEruda");
      await LswLazyLoads.loadEruda();
    },

    async toggleConsole() {
      this.$trace("console-hooker.methods.toggleConsole");
      if (typeof eruda === "undefined") {
        await this.loadEruda();
        eruda.init({
          container: this.$refs.console_hooker_box,
        });
        eruda.show();
      } else {
        const isShowing = eruda._$el.find(".eruda-dev-tools").css("display") === "block";
        if (isShowing) {
          eruda.hide();
        } else {
          eruda.show();
        }
      }
    },

  },
  mounted() {
    this.$trace("console-hooker.mounted");
    Exportar_consola: {
      Vue.prototype.$consoleHooker = this;
      this.$window.LswConsoleHooker = this;
    }
  },
  unmounted() {

  }
});
// @code.end: LswConsoleHooker API