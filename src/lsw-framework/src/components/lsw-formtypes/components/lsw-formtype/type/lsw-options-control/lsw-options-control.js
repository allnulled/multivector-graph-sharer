// @code.start: LswOptionsControl API | @$section: Vue.js (v2) Components » Lsw Formtypes API » LswOptionsControl component
Vue.component("LswOptionsControl", {
  template: $template,
  props: {
    settings: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    this.$trace("lsw-options-control.data");
    this.validateSettings();
    const value = this.settings?.initialValue || this.settings?.column?.hasInitialValue?.call() || "";
    return {
      uuid: LswRandomizer.getRandomString(5),
      value,
      isEditable: true,
      parameters: this.settings?.hasFormtypeParameters || {}
    };
  },
  methods: {
    async submit() {
      this.$trace("lsw-text-control.methods.submit");
      return LswFormtypes.utils.submitControl.call(this);
    },
    validate() {
      this.$trace("lsw-text-control.methods.validateSettings");
      return LswFormtypes.utils.validateControl.call(this);
    },
    validateSettings() {
      this.$trace("lsw-text-control.methods.validateSettings");
      return LswFormtypes.utils.validateSettings.call(this);
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-options-control.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswOptionsControl API