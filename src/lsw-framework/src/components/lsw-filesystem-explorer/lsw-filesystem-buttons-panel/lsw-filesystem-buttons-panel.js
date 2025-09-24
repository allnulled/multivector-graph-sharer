// @code.start: LswFilesystemButtonsPanel API | @$section: Vue.js (v2) Components » Lsw Filesystem Explorer API » LswFilesystemButtonsPanel component
Vue.component("LswFilesystemButtonsPanel", {
  name: "LswFilesystemButtonsPanel",
  template: $template,
  props: {
    explorer: {
      type: Object,
      required: true
    },
    orientation: {
      type: String,
      default: () => "row" // could be "column" too
    }
  },
  data() {
    return {
      buttons: []
    };
  },
  watch: {

  },
  methods: {
    setButtons(...buttons) {
      this.$trace("lsw-filesystem-buttons-panel.methods.prependButtons");
      this.buttons = buttons;
    },
    prependButtons(...buttons) {
      this.$trace("lsw-filesystem-buttons-panel.methods.prependButtons");
      this.buttons = buttons.concat(this.buttons);
    },
    appendButtons(...buttons) {
      this.$trace("lsw-filesystem-buttons-panel.methods.appendButtons");
      this.buttons = this.buttons.concat(buttons);
    },
  },
  mounted() {

  }
});
// @code.end: LswFilesystemButtonsPanel API