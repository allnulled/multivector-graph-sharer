// @code.start: DgnRestSchema API | @$section: Vue.js (v2) Components » Lsw Rest UI API » DgnRestSchema component
Vue.component("DgnRestSchema", {
  template: $template,
  props: {
    homepage: {
      type: Object,
      required: true,
    },
  },
  data() {
    this.$trace("dgn-rest-schema.data");
    return {
      schemaButtons: [{
        text: "➕",
        event: () => {
          this.openAddTableDialog();
        }
      }, {
        text: "🛜",
        event: () => this.loadSchema(),
      }],
      schema: false,
      isAddTableDialogOpen: false,
      selectedTables: [],
      newTable: {
        name: "",
        code: "",
      }
    };
  },
  methods: {
    async addNewTable(table, content) {
      this.$trace("dgn-rest-schema.methods.addNewTable");
      const response = await DgnFetch.fetch("http://127.0.0.1:9090/api/v1/data/createTable", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            token: DgnLoginManager.global.getToken(), // This has to match with provided cmd token
            table,
            content,
        })
      });
      await this.loadSchema();
    },
    selectTable(tableId) {
      this.$trace("dgn-rest-schema.methods.selectTable");
      const pos = this.selectedTables.indexOf(tableId);
      if(pos === -1) {
        this.selectedTables.push(tableId);
      } else {
        this.selectedTables.splice(pos, 1);
      }
    },
    async loadSchema() {
      this.$trace("dgn-rest-schema.methods.loadSchema");
      const response = await DgnFetch.fetch("/api/v1/data/schema");
      this.schema = response.data.output;
      this.homepage.schema = response.data.output;
    },
    async openAddTableDialog() {
      this.$trace("dgn-rest-schema.methods.openAddTableDialog");
      const formulario = await this.$lsw.dialogs.open({
        title: "Añadir tabla",
        template: `
        <div class="pad_horizontal_1">
          <div class="">
              <div class="pad_vertical_1">Nombre de la tabla:</div>
              <input type="text" class="supermini width_100" placeholder="" v-model="value.table" />
          </div>
          <div class="">
              <div class="pad_vertical_1">Código SQL de la tabla (de las columnas internas):</div>
              <textarea class="supermini" placeholder="" v-model="value.content" spellcheck="false"></textarea>
          </div>
          <hr />
          <div class="flex_row centered">
            <div class="flex_100"></div>
            <div class="flex_1">
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
            value: {
              table: "",
              content: "",
            }
          }
        }
      });
      if(typeof formulario !== "object") return;
      await this.addNewTable(formulario.table, formulario.content);
    },
    async deleteTable(tableId) {
      this.$trace("dgn-rest-schema.methods.deleteTable");
      const confirmacion = await this.$lsw.dialogs.open({
        title: "Eliminar tabla",
        template: `
          <div class="pad_horizontal_1">
            <div class="pad_vertical_1">¿Seguro que quieres eliminar esta tabla?</div>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="() => accept(true)">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `
      });
      if(confirmacion !== true) return;
      await DgnFetch.fetch("/api/v1/data/removeTable", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          table: tableId,
        })
      });
      this.loadSchema();
    },
    async deleteColumn(tableId, columnId) {
      this.$trace("dgn-rest-schema.methods.deleteColumn");
      const confirmacion = await this.$lsw.dialogs.open({
        title: "Eliminar columna",
        template: `
          <div class="pad_horizontal_1">
            <div class="pad_vertical_1">¿Seguro que quieres eliminar esta columna?</div>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="() => accept(true)">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `
      });
      if(confirmacion !== true) return;
      await DgnFetch.fetch("/api/v1/data/removeColumn", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          table: tableId,
          column: columnId,
        })
      });
      this.loadSchema();
    },
    async addColumn(tableId) {
      this.$trace("dgn-rest-schema.methods.addColumn");
      const confirmacion = await this.$lsw.dialogs.open({
        title: "Añadir columna",
        template: `
          <div class="pad_horizontal_1">
            <div class="pad_vertical_1">¿Qué código SQL quieres para la nueva columna?</div>
            <textarea spellcheck="false" v-model="value" placeholder="Ej: nombre VARCHAR(255) NOT NULL, ..." />
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
            value: "",
          }
        }
      });
      if(typeof confirmacion !== "string") return;
      const [token1, token2] = LswUtils.splitStringOnce(confirmacion, " ");
      const columnId = token1 ? token1 : token2;
      const content = token2 ? token2 : "";
      await DgnFetch.fetch("/api/v1/data/createColumn", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          table: tableId,
          column: columnId,
          content: content,
        })
      });
      this.loadSchema();
    }
  },
  watch: {},
  async mounted() {
    this.$trace("dgn-rest-schema.mounted");
    await this.loadSchema();
  },
});
// @code.end: DgnRestSchema API