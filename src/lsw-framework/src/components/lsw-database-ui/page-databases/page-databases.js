// @code.start: LswPageDatabases API | @$section: Vue.js (v2) Components » LswPageDatabases API » LswPageDatabases API
Vue.component("LswPageDatabases", {
  template: $template,
  props: {
    databaseExplorer: {
      type: Object,
      required: true
    },
    args: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      databases: [],
      databasesForTable: false,
      breadcrumb: [{
        page: "LswPageDatabases",
        name: "Databases",
        args: {},
        current: true
      }],
    }
  },
  methods: {
    openDatabase(name) {
      this.databaseExplorer.selectPage("LswPageTables", { database: name });
    }
  },
  watch: {
    databases(value) {
      AdaptingForTable: {
        const databasesForTable = [];
        if (typeof value !== "object") {
          break AdaptingForTable;
        }
        const databaseIds = Object.keys(value);
        for(let indexDatabase=0; indexDatabase<databaseIds.length; indexDatabase++) {
          const databaseId = databaseIds[indexDatabase];
          const databaseObject = value[databaseId];
        }
        this.databasesForTable = databasesForTable;
      }
    }
  },
  async mounted() {
    this.databases = await LswDatabaseAdapter.listDatabases();
    Filter_by_entity_schema_matched_db_names: {
      $lswSchema
    }
  },
  unmounted() {

  }
});
// @code.end: LswPageDatabases API