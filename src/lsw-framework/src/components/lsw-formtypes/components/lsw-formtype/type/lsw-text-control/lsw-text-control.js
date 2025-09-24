// @code.start: LswTextControl API | @$section: Vue.js (v2) Components » Lsw Formtypes API » LswTextControl component
Vue.component("LswTextControl", {
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
    this.$trace("lsw-text-control.data");
    this.validateSettings();
    const value = this.settings?.initialValue || this.settings?.column?.hasDefaultValue || "";
    return {
      uuid: LswRandomizer.getRandomString(5),
      value,
      isEditable: true,
      submitError: false,
      validateError: false,
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
  computed: {
    getSettingsInputEvents() {
      const base0 = this.settings.input?.events || false;
      if(typeof base0 === "object") {
        return base0;
      }
      return {};
    },
    getSettingsInputProps() {
      const base0 = this.settings.input?.props || false;
      if(typeof base0 === "object") {
        return base0;
      }
      return {};
    }
  },
  mounted() {
    try {
      this.$trace("lsw-text-control.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswTextControl API