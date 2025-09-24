// @code.start: LswLoadingBar API | @$section: Vue.js (v2) Components » LswLoadingBar component
Vue.component("LswLoadingBar", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-loading-bar.data");
    return {
      loadedPercentage: 100
    };
  },
  methods: {
    setLoadedPercentage(percentage) {
      this.loadedPercentage = percentage;
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-loading-bar.mounted");
      
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswLoadingBar API