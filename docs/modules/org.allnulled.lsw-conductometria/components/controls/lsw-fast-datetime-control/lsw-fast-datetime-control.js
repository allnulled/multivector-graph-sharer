// @code.start: LswFastDateControl API | @$section: Módulo org.allnulled.lsw-conductometria » Vue.js (v2) Components » LswFastDateControl API » LswFastDateControl component
Vue.component("LswFastDatetimeControl", {
  template: $template,
  props: {
    mode: {
      type: String,
      default: () => "datetime", // can also be: "date"
    },
    initialValue: {
      type: [Date, String],
      default: null,
    },
    onChangeDate: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    this.$trace("lsw-fast-datetime-control.data");
    return {
      value: this.adaptDate(this.initialValue || new Date()),
      isEditable: false,
    };
  },
  methods: {
    adaptDate(dateInput) {
      this.$trace("lsw-fast-date-control.methods.adaptDate");
      if(dateInput instanceof Date) {
        return LswTimer.utils.fromDateToDatestring(dateInput, this.mode === "date");
      }
      return dateInput;
    },
    getValue() {
      this.$trace("lsw-fast-date-control.methods.getValue");
      return this.value;
    },
    toggleEditable() {
      this.$trace("lsw-fast-datetime-control.methods.toggleEditable");
      this.isEditable = !this.isEditable;
    },
    showEditable() {
      this.$trace("lsw-fast-datetime-control.methods.showEditable");
      this.isEditable = true;
    },
    hideEditable() {
      this.$trace("lsw-fast-datetime-control.methods.hideEditable");
      this.isEditable = false;
    },
    setValue(v) {
      this.$trace("lsw-fast-datetime-control.methods.propagateValue");
      this.value = this.adaptDate(v);
      this.onChangeDate(this.value, this);
      this.hideEditable();
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-fast-datetime-control.mounted");
      // 
    } catch(error) {
      console.log(error);
    }
  }
});
// @code.end: LswFastDateControl API