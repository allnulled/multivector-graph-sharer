// @code.start: LswFastDateControl API | @$section: Módulo org.allnulled.lsw-conductometria » Vue.js (v2) Components » LswFastDateControl API » LswFastDateControl component
Vue.component("LswFastDateControl", {
  template: $template,
  props: {
    initialValue: {
      type: [Date, String],
      default: () => new Date(),
    },
    onChangeDate: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    this.$trace("lsw-fast-date-control.data");
    return {
      value: typeof this.initialValue instanceof Date ? LswTimer.utils.fromDateToDatestring(this.initialValue, true) : this.initialValue,
      isEditable: false,
    };
  },
  methods: {
    getValue() {
      this.$trace("lsw-fast-date-control.methods.getValue");
      return this.value;
    },
    toggleEditable() {
      this.$trace("lsw-fast-date-control.methods.toggleEditable");
      this.isEditable = !this.isEditable;
    },
    showEditable() {
      this.$trace("lsw-fast-date-control.methods.showEditable");
      this.isEditable = true;
    },
    hideEditable() {
      this.$trace("lsw-fast-date-control.methods.hideEditable");
      this.isEditable = false;
    },
    setValue(v) {
      this.$trace("lsw-fast-date-control.methods.propagateValue");
      const adaptedValue = v instanceof Date ? LswTimer.utils.fromDateToDatestring(v, true) : v;
      this.value = adaptedValue;
      this.onChangeDate(this.value, this);
      this.hideEditable();
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-fast-date-control.mounted");
      // 
    } catch(error) {
      console.log(error);
    }
  }
});
// @code.end: LswFastDateControl API