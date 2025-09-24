// @code.start: LswWikiRevistas API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswWikiRevistas component
Vue.component("LswWikiRevistas", {
  name: "LswWikiRevistas",
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-wiki-revistas.data");
    return {
      revistas: false,
    };
  },
  methods: {
    async loadRevistas() {
      this.$trace("lsw-wiki.methods.loadRevistas");
      this.revistas = await LswWikiUtils.getRevistas();
    },
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki-revistas.mounted");
      await this.loadRevistas();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswWikiRevistas API