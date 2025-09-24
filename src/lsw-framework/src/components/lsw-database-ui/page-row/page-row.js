// @code.start: LswPageRow API | @$section: Vue.js (v2) Components » LswPageRow API » LswPageRow API
Vue.component("LswPageRow", {
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
    this.$trace("lsw-page-row.data", arguments);
    $ensure(this.args.database).type("string");
    $ensure(this.args.table).type("string");
    $ensure(this.args.rowId).type("number");
    return {
      isLoaded: false,
      breadcrumb: [{
        page: "LswPageTables",
        name: this.args.database,
        args: {
          database: this.args.database
        }
      }, {
        page: "LswPageRows",
        name: this.args.table,
        args: {
          database: this.args.database,
          table: this.args.table
        },
      }, {
        page: "LswPageRow",
        name: (this.args.rowId === -1) ? '#new' : ("#" + this.args.rowId),
        args: {
          database: this.args.database,
          table: this.args.table,
          rowId: this.args.rowId
        },
        current: true
      }],
      database: this.args.database,
      table: this.args.table,
      rowId: this.args.rowId,
      connection: undefined,
      row: false,
    }
  },
  methods: {
    goBack() {
      this.$trace("lsw-page-row.methods.goBack", arguments);
      return this.databaseExplorer.selectPage("LswPageRows", {
        database: this.database,
        table: this.table
      });
    },
    async loadRow() {
      this.$trace("lsw-page-row.methods.loadRow", arguments);
      try {
        if (this.rowId === -1) {
          return false;
        }
        this.connection = this.connection ?? new LswDatabaseAdapter(this.database);
        await this.connection.open();
        const matches = await this.connection.select(this.table, it => it.id === this.rowId);
        this.row = matches[0];
      } catch (error) {
        console.log("Error loading row:", error);
        this.$lsw.toasts.showError(error);
        throw error;
      } finally {
        this.row = false;
      }
    },
    async upsertRow(value) {
      this.$trace("lsw-page-row.methods.upsertRow", arguments);
      try {
        const existsRow = this.rowId || ((typeof (this.row) === "object") && (typeof (this.row.id) === "number") && (this.row.id !== -1));
        let id = this.rowId || this.row.id;
        const operation = (existsRow && (id !== -1)) ? "update" : "insert";
        if (operation === "insert") {
          id = await this.$lsw.database.insert(this.table, value);
        } else {
          await this.$lsw.database.update(this.table, id, value);
        }
        this.$lsw.toasts.send({
          title: `Nueva ${operation === 'insert' ? 'inserción' : 'actualización'}`,
          text: `El registro #${id} de «${this.table}» fue ${operation === 'insert' ? 'insertado' : 'actualizado'} correctamente.`
        });
        if (operation === "insert") {
          this.databaseExplorer.selectPage("LswPageRow", {
            database: this.database,
            table: this.table,
            rowId: id
          });
        } else {
          // @OK.
        }
      } catch (error) {
        console.log(error);
        this.$lsw.toasts.showError(error);
      }
    }
  },
  async mounted() {
    this.$trace("lsw-page-row.mounted", arguments);
    try {
      await this.loadRow();
    } catch (error) {
      console.log("Error loading row:", error);
      throw error;
    } finally {
      this.isLoaded = true;
    }
  },
  unmounted() {
    this.$trace("lsw-page-row.unmounted", arguments);
    this.connection.close();
  }
});
// @code.end: LswPageRow API