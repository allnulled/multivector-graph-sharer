// @code.start: LswDataPrinterButton API | @$section: Vue.js (v2) Components » LswDataPrinterButton component
Vue.component("LswDataPrinterButton", {
  template: $template,
  props: {
    input: {
      type: [Object, String, Boolean, Number, Function],
      default: () => false,
    },
  },
  data() {
    this.$trace("lsw-data-printer-button.data");
    return {
      inputType: typeof(this.input),
      formatType: undefined,
    };
  },
  methods: {
    async openViewer() {
      this.$trace("lsw-data-printer-button.methods.openViewer");
      let input = this.input;
      if(this.inputType === "function") {
        input = await this.input();
      }
      this.formatType = typeof input;
      this.$lsw.dialogs.open({
        title: "Impresión de «" + this.formatType + "»",
        template: `
          <lsw-data-printer-report :input="input" />
        `,
        factory: { data: { input } },
      });
    }
  },
  watch: {},
  mounted() {
    this.$trace("lsw-data-printer-button.mounted");
    
  },
  unmounted() {
    this.$trace("lsw-data-printer-button.unmounted");
    
  }
});
// @code.end: LswDataPrinterButton API