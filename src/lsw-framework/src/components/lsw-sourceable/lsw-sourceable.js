// @code.start: LswSourceable API | @$section: Vue.js (v2) Components » LswSourceable component
Vue.component("LswSourceable", {
  template: $template,
  props: {
    fixedId: {
      type: [String, Boolean],
      default: () => false,
    },
    source: {
      type: [String, Boolean],
      default: () => false,
    },
    composition: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.$trace("lsw-sourceable.data");
    const reflectedId = this.fixedId || LswRandomizer.getRandomString(10);
    return {
      isLoaded: false,
      componentId: "lsw-sourceable-" + reflectedId,
    };
  },
  methods: {
    loadReflection() {
      this.$trace("lsw-sourceable.methods.loadReflection");
      const that = this;
      const source = this.source || this.$slots.default;
      Vue.component(this.componentId, {
        template: "<div>" + source + "</div>",
        ...this.composition,
      });
      this.isLoaded = true;
    },
    unloadReflection() {
      this.$trace("lsw-sourceable.methods.loadReflection");
      delete Vue.options.components[this.componentId];
    }
  },
  watch: {},
  mounted() {
    this.$trace("lsw-sourceable.mounted");
    this.loadReflection();
  },
  unmounted() {
    this.$trace("lsw-sourceable.unmounted");
    this.unloadReflection();
  }
});
// @code.end: LswSourceable API