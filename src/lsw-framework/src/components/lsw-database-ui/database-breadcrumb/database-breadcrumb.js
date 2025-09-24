// @code.start: LswDatabaseBreadcrumb API | @$section: Vue.js (v2) Components » LswDatabaseBreadcrumb API » LswDatabaseBreadcrumb API
Vue.component("LswDatabaseBreadcrumb", {
  template: $template,
  props: {
    databaseExplorer: {
      type: Object,
      required: true
    },
    breadcrumb: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    selectPage(page, args = {}) {
      return this.databaseExplorer.selectPage(page, args);
    }
  },
  async mounted() {
    
  },
  unmounted() {

  }
});
// @code.end: LswDatabaseBreadcrumb API