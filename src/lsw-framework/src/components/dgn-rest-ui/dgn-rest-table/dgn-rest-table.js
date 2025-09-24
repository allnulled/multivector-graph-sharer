// @code.start: DgnRestTable API | @$section: Vue.js (v2) Components » Lsw Rest UI API » DgnRestTable component
Vue.component("DgnRestTable", {
  template: $template,
  props: {
    homepage: {
      type: Object,
      required: true,
    },
  },
  data() {
    this.$trace("dgn-rest-table.data");
    return {
      tableId: this.homepage.selectedTable,
      tableButtons: [{
        text: "⬅️",
        event: () => {
          this.homepage.goToSchema();
        }
      }, {
        text: "➕",
        event: () => {
          this.addRow();
        }
      }, {
        text: "🛜",
        event: () => {
          this.loadRows();
        }
      }],
      buttonsPerRow: [{
        text: "↗️",
        event: (row) => {
          this.updateRow(row.id, row);
        },
      }, {
        text: "❌",
        event: (row) => {
          this.deleteRow(row.id, row);
        },
      }],
      rows: false,
      newItem: {},
    };
  },
  methods: {
    async loadRows() {
      this.$trace("dgn-rest-table.methods.loadRows");
      this.rows = false;
      const response = await DgnFetch.fetch("/api/v1/data/select?from=" + this.homepage.selectedTable);
      this.$nextTick(() => {
        this.rows = response.data.output;
      });
    },
    async deleteRow(rowId, rowData) {
      this.$trace("dgn-rest-table.methods.deleteRow");
      const that = this;
      const confirmacion = await this.$lsw.dialogs.open({
        title: "Eliminar fila",
        template: `
          <div class="pad_horizontal_1">
            <div class="">¿Seguro que quieres eliminar esta fila?</div>
            <pre>{{ rowData }}</pre>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            rowData,
          }
        }
      });
      if(confirmacion === -1) return;
      await DgnFetch.fetch("/api/v1/data/delete", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          from: this.homepage.selectedTable,
          where: [[ "id", "=", rowId ]],
        })
      });
      await this.loadRows();
    },
    async updateRow(rowId, rowData) {
      this.$trace("dgn-rest-table.methods.updateRow");
      const that = this;
      const fila = await this.$lsw.dialogs.open({
        title: "Actualizar fila",
        template: `
          <div class="pad_horizontal_1">
            <dgn-rest-row
              ref="rowForm"
              :homepage="homepage"
              :table="tableId"
              :row="rowId"
            />
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="returnRow">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            tableId: that.tableId,
            rowId: rowId,
            homepage: that.homepage,
          },
          methods: {
            returnRow: function() {
              this.accept(this.$refs.rowForm.rowData);
            }
          }
        }
      });
      if(typeof fila !== "object") return;
      delete fila.id;
      const response = await DgnFetch.fetch("/api/v1/data/update", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          from: this.homepage.selectedTable,
          set: fila,
          where: [[ "id", "=", rowId ]],
        })
      });
      console.log(response);
      this.loadRows();
    },
    async addRow() {
      this.$trace("dgn-rest-table.methods.addRow");
      const that = this;
      const fila = await this.$lsw.dialogs.open({
        title: "Añadir fila",
        template: `
          <div class="pad_horizontal_1">
            <dgn-rest-row
              ref="rowForm"
              :homepage="homepage"
              :table="tableId"
              :row="-1"
            />
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="returnRow">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            tableId: that.tableId,
            homepage: that.homepage,
          },
          methods: {
            returnRow: function() {
              this.accept(this.$refs.rowForm.rowData);
            }
          }
        }
      });
      if(typeof fila !== "object") return;
      delete fila.id;
      const response = await DgnFetch.fetch("/api/v1/data/insert", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          into: this.homepage.selectedTable,
          values: fila
        })
      });
      console.log(response);
      this.loadRows();
    }
  },
  watch: {},
  async mounted() {
    this.$trace("dgn-rest-table.mounted");
    await this.loadRows();
  },
});
// @code.end: DgnRestTable API