// @code.start: LswSourceCodeControl API | @$section: Vue.js (v2) Components » Lsw Formtypes API » LswSourceCodeControl component
Vue.component("LswSourceCodeControl", {
  template: $template,
  props: {
    settings: {
      type: Object,
      default: () => ({})
    },
    skipLabel: {
      type: Boolean,
      default: () => false,
    }
  },
  data() {
    this.$trace("lsw-source-code-control.data");
    this.validateSettings();
    const value = this.settings?.initialValue || this.settings?.column.hasDefaultValue || "";
    return {
      uuid: LswRandomizer.getRandomString(5),
      value,
      isEditable: true,
      currentFontsize: 10,
      currentFontfamily: "monospace",
    };
  },
  methods: {
    increaseFontsize(points = 1) {
      this.$trace("lsw-source-code-control.methods.increaseFontsize");
      this.currentFontsize += points;
    },
    alternateFontfamily() {
      this.$trace("lsw-source-code-control.methods.alternateFontfamily");
      if(this.currentFontfamily === 'monospace') {
        this.currentFontfamily = 'Arial';
      } else {
        this.currentFontfamily = 'monospace';
      }
    },
    async submit() {
      this.$trace("lsw-source-code-control.methods.submit");
      return LswFormtypes.utils.submitControl.call(this);
      
    },
    validate() {
      this.$trace("lsw-source-code-control.methods.validateSettings");
      return LswFormtypes.utils.validateControl.call(this);
    },
    validateSettings() {
      this.$trace("lsw-source-code-control.methods.validateSettings");
      return LswFormtypes.utils.validateSettings.call(this);
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-source-code-control.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswSourceCodeControl API