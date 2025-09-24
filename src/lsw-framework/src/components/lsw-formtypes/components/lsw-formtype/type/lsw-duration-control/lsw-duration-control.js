// @code.start: LswDurationControl API | @$section: Vue.js (v2) Components » Lsw Formtypes API » LswDurationControl component
Vue.component("LswDurationControl", {
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
    this.$trace("lsw-duration-control.data");
    this.validateSettings();
    const value = this.settings?.initialValue || this.settings?.column?.hasDefaultValue || "";
    return {
      uuid: LswRandomizer.getRandomString(5),
      value,
      isEditable: true,
      isShowingDetails: true,
      submitError: false,
      validateError: false,
    };
  },
  methods: {
    async submit() {
      this.$trace("lsw-text-control.methods.submit");
      try {
        return LswFormtypes.utils.submitControl.call(this);
      } catch (error) {
        this.submitError = error;
        throw error;
      }
    },
    validate() {
      this.$trace("lsw-text-control.methods.validateSettings");
      try {
        return LswFormtypes.utils.validateControl.call(this);
      } catch (error) {
        this.validateError = error;
        throw error;
      }
    },
    validateSettings() {
      this.$trace("lsw-text-control.methods.validateSettings");
      return LswFormtypes.utils.validateSettings.call(this);
    },
    toggleDetails() {
      this.$trace("lsw-duration-control.methods.toggleDetails");
      this.isShowingDetails = !this.isShowingDetails;
    },
    setValue(v) {
      this.$trace("lsw-duration-control.methods.setValue");
      this.value = v;
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-duration-control.mounted");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswDurationControl API