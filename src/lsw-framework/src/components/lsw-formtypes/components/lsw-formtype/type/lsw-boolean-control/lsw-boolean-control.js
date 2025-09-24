// @code.start: LswBooleanControl API | @$section: Vue.js (v2) Components » Lsw Formtypes API » LswBooleanControl component
Vue.component("LswBooleanControl", {
  template: $template,
  props: {
    configurations: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.$trace("lsw-boolean-control.data");
    return {};
  },
  methods: {},
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-boolean-control.mounted");
    } catch(error) {
      console.log(error);
    }
  }
});
// @code.end: LswBooleanControl API