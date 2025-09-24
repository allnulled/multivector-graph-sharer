(function(factory) {
  const mod = factory();
  if(typeof window !== 'undefined') {
    window["Lsw_form_controls_components"] = mod;
  }
  if(typeof global !== 'undefined') {
    global["Lsw_form_controls_components"] = mod;
  }
  if(typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function() {
Vue.component("LswTable", {
  template: `<div class="lsw_table"
    style="padding-top: 4px;">
    <div>
        <div class="lsw_table_top_panel">
            <div class="flex_row centered">
                <div class="flex_1">
                    <button class="cursor_pointer"
                        v-on:click="digestOutput">🛜</button>
                </div>
                <div class="flex_100 title_box">{{ title }}</div>
                <div class="flex_1 lsw_table_top_button" v-for="topButton, topButtonIndex in attachedTopButtons" v-bind:key="'table-button-' + topButtonIndex">
                    <button class="" v-on:click="topButton.event">
                        {{ topButton.text }}
                    </button>
                </div>
                <div class="flex_1">
                    <button class="table_menu_div width_100"
                        v-on:click="toggleMenu"
                        :class="{activated: isShowingMenu === true}">
                        <span v-if="hasFiltersApplying">🟠</span>
                        <span v-else>▫️</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="isShowingMenu">
            <div class="">
                <div class="table_navigation_menu_cell"
                    colspan="1000">
                    <div class="table_navigation_menu">
                        <div class="flex_row centered">
                            <div class="flex_1 nowrap">Estás en: </div>
                            <div class="flex_100 left_padded_1">
                                <select class="width_100 text_align_left"
                                    v-model="isShowingSubpanel">
                                    <option value="Extensor">Extensor ({{ extender.length }})</option>
                                    <option value="Filtro">Filtro ({{ filter.length }})</option>
                                    <option value="Ordenador">Ordenador ({{ sorter.length }})</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="isShowingSubpanel === 'Extensor'">
                            <textarea spellcheck="false"
                                v-model="extender"
                                :placeholder="placeholderForExtensor"></textarea>
                        </div>
                        <div v-if="isShowingSubpanel === 'Filtro'">
                            <textarea spellcheck="false"
                                v-model="filter"
                                :placeholder="placeholderForFiltro"></textarea>
                        </div>
                        <div v-if="isShowingSubpanel === 'Ordenador'">
                            <textarea spellcheck="false"
                                v-model="sorter"
                                :placeholder="placeholderForOrdenador"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="paginator_widget this_code_is_duplicated_always">
        <div>
            <div>
                <div class="flex_row centered">
                    <div class="flex_1 pagination_button_box first_box">
                        <div class="pagination_button first_button"
                            v-on:click="goToFirstPage">⏪</div>
                    </div>
                    <div class="flex_1 pagination_button_box">
                        <div class="pagination_button"
                            v-on:click="decreasePage">◀️</div>
                    </div>
                    <div class="flex_100 text_align_center">{{ currentPage+1 }}</div>
                    <div class="flex_1 pagination_button_box">
                        <div class="pagination_button"
                            v-on:click="increasePage">▶️</div>
                    </div>
                    <div class="flex_1 pagination_button_box last_box">
                        <div class="pagination_button last_button"
                            v-on:click="goToLastPage">⏩</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="lsw_table_viewer">
        <table class="collapsed_table lsw_table_itself">
            <thead v-if="paginatedOutput && headers">
                <tr class="">
                    <!--Id cell:-->
                    <th>nº</th>
                    <!--Selectable buttons headers:-->
                    <th v-if="selectable === 'one'"></th>
                    <th v-else-if="selectable === 'many'"></th>
                    <!--Row buttons headers:-->
                    <th class="button_header"
                        v-for="attachedHeader, attachedHeaderIndex in attachedHeaders"
                        v-bind:key="'attached-header-' + attachedHeaderIndex">{{ attachedHeader.text }}</th>
                    <!--Object properties headers:-->
                    <th v-for="header, headerIndex in headers"
                        v-bind:key="'header-' + headerIndex">{{ header }}</th>
                    <th>*size</th>
                </tr>
            </thead>
            <template v-if="paginatedOutput && headers">
                <tbody v-if="!paginatedOutput.length">
                    <tr>
                        <td colspan="1000"
                            v-descriptor="'lsw_table.no_data_provided_message'">
                            No data provided.
                        </td>
                    </tr>
                </tbody>
                <template v-else>
                    <tbody>
                        <template v-for="row, rowIndex in paginatedOutput">
                            <tr class="row_for_table"
                                :class="{ odd: rowIndex === 0 ? true : (rowIndex % 2 === 0) ? true : false }"
                                v-bind:key="'row-for-table-' + rowIndex">
                                <!--Id cell:-->
                                <td class="index_cell">
                                    <button v-on:click="() => toggleRow(row.id)"
                                        :class="{activated: selectedRows.indexOf(row.id) !== -1}">
                                        {{ rowIndex + (currentPage * itemsPerPage) }}
                                    </button>
                                </td>
                                <!--Selectable cell:-->
                                <td class="index_cell" v-if="selectable === 'one'">
                                    <span v-on:click="() => toggleChoosenRow(row[choosableId])">
                                        <button class="activated" v-if="choosenRows === row[choosableId]">
                                            <!--input type="radio" :checked="true" /-->
                                            ☑️
                                        </button>
                                        <button v-else>
                                            🔘
                                            <!--input type="radio" :checked="false" /-->
                                        </button>
                                    </span>
                                </td>
                                <td class="index_cell" v-else-if="selectable === 'many'">
                                    <label>
                                        <input type="checkbox" v-model="choosenRows" :value="row[choosableId]" />
                                    </label>
                                </td>
                                <!--Row buttons cells:-->
                                <td class="button_cell" v-for="attachedColumn, attachedColumnIndex in attachedColumns"
                                    v-bind:key="'attached-column-' + attachedColumnIndex">
                                    <button v-on:click="() => rowButtons[attachedColumnIndex].event(row, rowIndex, attachedColumn)">{{ attachedColumn.text }}</button>
                                </td>
                                <!--Object properties cells:-->
                                <td class="data_cell" v-for="columnKey, columnIndex in headers"
                                    v-bind:key="'column-' + columnIndex"
                                    :title="JSON.stringify(row[columnKey])">
                                    <template v-if="columnsAsList.indexOf(columnKey) !== -1 && Array.isArray(row[columnKey])">
                                        <ul>
                                            <li v-for="item, itemIndex in row[columnKey]" v-bind:key="'column-' + columnIndex + '-item-' + itemIndex">
                                                {{ itemIndex + 1 }}. {{ item }}
                                            </li>
                                        </ul>
                                    </template>
                                    <template v-else>
                                        {{ row[columnKey] ?? "-" }}
                                    </template>
                                </td>
                                <td class="data_cell metadata_cell">
                                    {{ JSON.stringify(row).length }} bytes
                                </td>
                            </tr>
                            <tr class="row_for_details"
                                v-show="selectedRows.indexOf(row.id) !== -1"
                                v-bind:key="'row-for-cell-' + rowIndex">
                                <td class="data_cell details_cell"
                                    colspan="1000">
                                    <pre class="">{{ JSON.stringify(row, null, 2) }}</pre>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </template>
            </template>
            <tbody v-else>
                <tr>
                    <td colspan="1000">
                        Un momento, por favor, la tabla está cargando...
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="paginator_widget this_code_is_duplicated_always">
        <div>
            <div>
                <div class="flex_row centered">
                    <div class="flex_1 pagination_button_box first_box">
                        <div class="pagination_button first_button"
                            v-on:click="goToFirstPage">⏪</div>
                    </div>
                    <div class="flex_1 pagination_button_box">
                        <div class="pagination_button"
                            v-on:click="decreasePage">◀️</div>
                    </div>
                    <div class="flex_100 text_align_center">{{ currentPage+1 }}</div>
                    <div class="flex_1 pagination_button_box">
                        <div class="pagination_button"
                            v-on:click="increasePage">▶️</div>
                    </div>
                    <div class="flex_1 pagination_button_box last_box">
                        <div class="pagination_button last_button"
                            v-on:click="goToLastPage">⏩</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
  props: {
    initialInput: {
      type: Array,
      default: () => []
    },
    initialSettings: {
      type: Object,
      default: () => ({})
    },
    rowButtons: {
      type: Array,
      default: () => []
    },
    tableButtons: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: String,
      default: () => "none"
    },
    onChooseRow: {
      type: Function,
      default: () => {}
    },
    choosableId: {
      type: String,
      default: () => "id"
    },
    initialChoosenValue: {
      type: [],
      default: () => []
    }
  },
  data() {
    this.$trace("lsw-table.data");
    const input = [].concat(this.initialInput);
    return {
      input,
      title: this.initialSettings?.title || "",
      isShowingMenu: this.initialSettings?.isShowingMenu || false,
      isShowingSubpanel: this.initialSettings?.isShowingSubpanel || "Extensor",
      selectedRows: [],
      choosenRows: this.initialChoosenValue || [],
      extender: this.initialSettings?.extender || "",
      filter: this.initialSettings?.filter || "",
      sorter: this.initialSettings?.sorter || "",
      itemsPerPage: this.initialSettings?.itemsPerPage || 10,
      currentPage: this.initialSettings?.currentPage || 0,
      columnsAsList: this.initialSettings?.columnsAsList || [],
      columnsOrder: this.initialSettings?.columnsOrder || [],
      output: [],
      paginatedOutput: [],
      headers: [],
      attachedHeaders: this._adaptRowButtonsToHeaders(this.rowButtons),
      attachedColumns: this._adaptRowButtonsToColumns(this.rowButtons),
      attachedTopButtons: this._adaptRowButtonsToColumns(this.tableButtons),
      placeholderForExtensor: "data.map(function(it, i) {\n  return /* you start here */ || {};\n});",
      placeholderForOrdenador: "data.sort(function(a, b) {\n  return /* you start here */;\n});",
      placeholderForFiltro: "data.filter(function(it, i) {\n  return /* you start here */;\n});",
    };
  },
  methods: {
    goToFirstPage() {
      this.$trace("lsw-table.methods.goToFirstPage");
      this.currentPage = 0;
    },
    decreasePage() {
      this.$trace("lsw-table.methods.decreasePage");
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    increasePage() {
      this.$trace("lsw-table.methods.increasePage");
      const lastPage = Math.floor(this.output.length / this.itemsPerPage);
      if (this.currentPage < lastPage) {
        this.currentPage++;
      }
    },
    goToLastPage() {
      this.$trace("lsw-table.methods.goToLastPage");
      const lastPage = Math.floor(this.output.length / this.itemsPerPage);
      if (this.currentPage !== lastPage) {
        this.currentPage = lastPage;
      }
    },
    toggleChoosenRow(rowId) {
      this.$trace("lsw-table.methods.toggleChoosenRow");
      if(this.selectable === 'many') {
        const pos = this.choosenRows.indexOf(rowId);
        if (pos === -1) {
          this.choosenRows.push(rowId);
        } else {
          this.choosenRows.splice(pos, 1);
        }
      } else if(this.selectable === 'one') {
        const isSame = this.choosenRows === rowId;
        if(isSame) {
          this.choosenRows = undefined;
        } else {
          this.choosenRows = rowId;
        }
      }
    },
    toggleRow(rowIndex) {
      this.$trace("lsw-table.methods.toggleRow");
      const pos = this.selectedRows.indexOf(rowIndex);
      if (pos === -1) {
        this.selectedRows.push(rowIndex);
      } else {
        this.selectedRows.splice(pos, 1);
      }
    },
    toggleMenu() {
      this.$trace("lsw-table.methods.toggleMenu");
      this.isShowingMenu = !this.isShowingMenu;
    },
    digestOutput() {
      this.$trace("lsw-table.methods.digestOutput");
      const input = this.input;
      let temp = [];
      const extenderExpression = this.extender.trim() || "{}";
      const extenderFunction = new Function("it", "i", `return ${extenderExpression}`);
      const filterExpression = this.filter.trim() || "true";
      const filterFunction = new Function("it", "i", `return ${filterExpression}`);
      const sorterExpression = this.sorter.trim() || "0";
      const sorterFunction = new Function("a", "b", `return ${sorterExpression}`);
      let tempHeaders = new Set();
      for (let index = 0; index < input.length; index++) {
        const row = input[index];
        let extendedRow = undefined;
        Apply_extender: {
          try {
            const extenderProduct = extenderFunction(row, index) || {};
            extendedRow = Object.assign({}, row, extenderProduct);
          } catch (error) {
            extendedRow = Object.assign({}, row);
          }
        }
        Apply_filter: {
          try {
            const filterProduct = filterFunction(extendedRow, index);
            if (filterProduct === true) {
              temp.push(extendedRow);
            }
          } catch (error) {
            // @OK.
          }
        }
        Extract_headers: {
          try {
            Object.keys(extendedRow).forEach(key => {
              tempHeaders.add(key);
            });
          } catch (error) {
            // @OK.
          }
        }
      }
      Apply_sorter: {
        try {
          temp = temp.sort(sorterFunction);
        } catch (error) {
          // @OK.
        }
        Also_to_headers: {
          if(Array.isArray(this.columnsOrder) && this.columnsOrder.length) {
            tempHeaders = [...tempHeaders].sort((h1, h2) => {
              const pos1 = this.columnsOrder.indexOf(h1);
              const pos2 = this.columnsOrder.indexOf(h2);
              if(pos1 === -1 && pos2 === -1) {
                return -1;
              } else if(pos1 === -1) {
                return 1;
              } else if(pos2 === -1) {
                return -1;
              } else if(pos1 > pos2) {
                return 1;
              }
              return -1;
            });
          }
        }
      }
      this.headers = tempHeaders;
      this.output = temp;
      this.digestPagination();
    },
    digestPagination() {
      this.$trace("lsw-table.methods.digestPagination");
      console.log(1);
      const page = this.currentPage;
      console.log(2);
      const items = this.itemsPerPage;
      console.log(3);
      const firstPosition = items * (page);
      this.selectedRows = [];
      console.log(4);
      this.paginatedOutput = [].concat(this.output).splice(firstPosition, items);
      console.log(5);
    },
    saveCurrentTransformer() {
      this.$trace("lsw-table.methods.saveCurrentTransformer");
    },
    _adaptRowButtonsToHeaders(rowButtons) {
      const attachedHeaders = [];
      for(let index=0; index<rowButtons.length; index++) {
        const attachedButton = rowButtons[index];
        attachedHeaders.push({
          text: attachedButton.header || ""
        });
      }
      return attachedHeaders;
    },
    _adaptRowButtonsToColumns(rowButtons) {
      const attachedColumns = [];
      for(let index=0; index<rowButtons.length; index++) {
        const attachedButton = rowButtons[index];
        attachedColumns.push({
          text: attachedButton.text || "",
          event: attachedButton.event || this.$noop,
        });
      }
      return attachedColumns;
    }
  },
  watch: {
    itemsPerPage(value) {
      this.$trace("lsw-table.watch.itemsPerPage");
      this.digestPagination();
    },
    currentPage(value) {
      this.$trace("lsw-table.watch.currentPage");
      this.digestPagination();
    },
    choosenRows(v) {
      this.$trace("lsw-table.watch.value");
      this.onChooseRow(v, this);
    }
  },
  computed: {
    hasFiltersApplying() {
      this.$trace("lsw-table.computed.hasFiltersApplying");
      if (this.extender.length) {
        return true;
      }
      if (this.filter.length) {
        return true;
      }
      if (this.sorter.length) {
        return true;
      };
      return false;
    }
  },
  mounted() {
    this.$trace("lsw-table.mounted");
    this.digestOutput();
  }
});
});
