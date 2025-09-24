// @code.start: LswVolatileUi API | @$section: Vue.js (v2) Components » LswVolatileUi component
Vue.component("LswVolatileUi", {
  template: $template,
  props: {
    
  },
  data() {
    this.$trace("lsw-volatile-ui.data");
    return {
      // BUTTONS:
      tablePageButtons: [
        { text: '⬅️ Atrás', event: () => this.selectPage('tables'), },
        { text: 'Fila ➕', event: this.openCreateRowDialog, }
      ],
      tablesPageButtons: [
        { text: 'Tabla ➕', event: this.openCreateTableDialog }
      ],
      // STATE:
      currentPage: "tables",
      currentTable: false,
      isMetadataLoaded: false,
      isDataLoaded: false,
      isExpandedRow: {},
      // METADATA:
      allTables: false,
      // DATA:
      allRows: false,
    };
  },
  methods: {
    expandValue(table, rowId) {
      this.$trace("lsw-volatile-ui.methods.expandValue");
      this.isExpandedRow[table + "::" + rowId] = true;
      this.$forceUpdate(true);
    },
    unexpandValue(table, rowId) {
      this.$trace("lsw-volatile-ui.methods.unexpandValue");
      this.isExpandedRow[table + "::" + rowId] = false;
      this.$forceUpdate(true);
    },
    loadData() {
      this.$trace("lsw-volatile-ui.methods.loadData");
      this.isDataLoaded = false;
      this.allRows = LswVolatileDB.global.data[this.currentTable].selectAll();
      this.$nextTick(() => {
        this.isDataLoaded = true;
      });
    },
    loadMetadata() {
      this.$trace("lsw-volatile-ui.methods.loadMetadata");
      this.isMetadataLoaded = false;
      this.allTables = LswVolatileDB.global.getSchema({ sorted: true });
      this.$nextTick(() => {
        this.isMetadataLoaded = true;
      });
    },
    selectPage() {
      this.$trace("lsw-volatile-ui.methods.selectPage");
      this.currentPage = "tables";
      this.currentTable = undefined;
    },
    selectTable(tableId) {
      this.$trace("lsw-volatile-ui.methods.selectTable");
      this.currentTable = tableId;
      this.currentPage = "table";
      this.loadData();
    },
    async openCreateTableDialog() {
      this.$trace("lsw-volatile-ui.methods.openCreateTableDialog");
      const tableId = await this.$lsw.dialogs.open({
        title: "Crear tabla volátil",
        template: `
          <div class="pad_1">
            <div>Especifica el nombre de la tabla:</div>
            <input class="width_100" type="text" v-model="value" v-on:keypress.enter="accept" v-focus />
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `
      });
      if(typeof tableId !== 'string') return;
      if(tableId.trim() === '') return;
      LswVolatileDB.global.createTable(tableId);
      this.loadMetadata();
    },
    async openCreateRowDialog() {
      this.$trace("lsw-volatile-ui.methods.openCreateRowDialog");
      const rowData = await this.$lsw.dialogs.open({
        title: "Crear fila volátil",
        template: `
          <div class="pad_1">
            <div class="flex_row centered">
              <div class="flex_100">Propiedades:</div>
              <div class="flex_1 pad_left_1">
                <button class="supermini width_100" v-on:click="increasePropiedades">➕ Nueva propiedad</button>
              </div>
            </div>
            <div class="propiedades_list">
              <div class="propiedad_item"
                v-for="propiedad, propIndex in propiedades"
                v-bind:key="'propiedad_' + propIndex">
                <div class="flex_row centered">
                  <div class="flex_100">Propiedad:</div>
                  <div class="flex_1 pad_left_1">
                    <button class="supermini" v-on:click="deletePropiedad(propIndex)">❌</button>
                  </div>
                </div>
                <div class="pad_vertical_1">
                  <input class="supermini width_100" type="text" v-model="propiedades[propIndex].nombre" />
                </div>
                <div>Valor:</div>
                <textarea class="width_100" v-model="propiedades[propIndex].valor" spellcheck="false" />
              </div>
            </div>
            <div class="flex_row centered pad_top_1" v-if="Object.keys(propiedades).length">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini width_100" v-on:click="increasePropiedades">➕ Nueva propiedad</button>
              </div>
            </div>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button v-on:click="() => accept(propiedades)">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            propiedades: []
          },
          methods: {
            deletePropiedad(propIndex) {
              this.$trace("lsw-volatile-ui.methods.openCreateRowDialog.Dialog.methods.deletePropiedad");
              this.propiedades.splice(propIndex, 1);
            },
            increasePropiedades() {
              this.$trace("lsw-volatile-ui.methods.openCreateRowDialog.Dialog.methods.increasePropiedades");
              this.propiedades.push({
                nombre: "",
                valor: "",
              });
            }
          }
        }
      });
      if(!Array.isArray(rowData)) {
        return; 
      }
      const dataObject = this.fromArrayToObject(rowData, "nombre", "valor");
      LswVolatileDB.global.data[this.currentTable].insert(dataObject);
      this.loadData();
    },
    fromArrayToObject(rowData, propId, valId) {
      this.$trace("lsw-volatile-ui.methods.fromArrayToObject");
      const output = {};
      for(let index=0; index<rowData.length; index++) {
        const rowDataItem = rowData[index];
        const nombre = rowDataItem[propId];
        const valor = rowDataItem[valId];
        output[nombre] = valor;
      }
      return output;
    },
    deleteRow(table, rowId) {
      this.$trace("lsw-volatile-ui.methods.deleteRow");
      LswVolatileDB.global.data[table].delete(rowId);
      this.loadData();
    },
    async deleteTable(tableId) {
      this.$trace("lsw-volatile-ui.methods.deleteTable");
      const confirmation = await this.$lsw.dialogs.open({
        title: `Eliminando tabla`,
        template: `
          <div>
            <div class="pad_1">
              <div class="pad_vertical_1">¿Seguro que quieres eliminar tabla «{{ tableId }}»?</div>
              <div class="pad_vertical_1">Tiene «{{ rowsLength }}» filas dentro.</div>
            </div>
            <hr/>
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button class="danger_button" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            tableId,
            rowsLength: Object.keys(LswVolatileDB.global.data[tableId].data).length,
            value: true,
          }
        }
      });
      if(confirmation !== true) {
        return;
      }
      delete LswVolatileDB.global.data[tableId];
      LswVolatileDB.global.persist();
      this.loadMetadata();
    },
    async openEditRowPropertyDialog(tableId, rowId, propertyId, currentValue) {
      this.$trace("lsw-volatile-ui.methods.openEditRowPropertyDialog");
      const newValue = await this.$lsw.dialogs.open({
        title: `Editando propiedad «${propertyId}» de ${tableId} #${rowId}`,
        template: `
          <div class="pad_1">
            <div class="pad_vertical_1">{{ tableId }}#{{ rowId }}/{{ propertyId }}</div>
            <div class="pad_vertical_1">Valor anterior:</div>
            <div class="pad_vertical_1 cursor_pointer" v-on:click="expandValue" v-if="isNotExpanded">
              <b>{{ LswUtils.subtextualize(currentValue, 30) }}</b>
            </div>
            <div class="pad_vertical_1" v-on:click="expandValue" v-else>
              <pre><b>{{ currentValue }}</b></pre>
            </div>
            <div class="pad_vertical_1">
              <div class="">Valor nuevo:</div>
            </div>
            <div class="pad_vertical_1">
              <div class="">
                <textarea v-model="value" v-focus spellcheck="false" />
              </div>
            </div>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            isNotExpanded: true,
            tableId,
            rowId,
            propertyId,
            currentValue,
            value: currentValue,
          },
          methods: {
            expandValue() {
              this.isNotExpanded = false;
            }
          }
        }
      });
      if(typeof newValue !== "string") {
        return;
      }
      LswVolatileDB.global.data[tableId].update(rowId, { [propertyId]: newValue });
      this.loadData();
    }
  },
  mounted() {
    this.$trace("lsw-volatile-ui.mounted");
    this.loadMetadata();
  },
  unmount() {
    this.$trace("lsw-volatile-ui.unmounted");
  }
});
// @code.end: LswVolatileUi API