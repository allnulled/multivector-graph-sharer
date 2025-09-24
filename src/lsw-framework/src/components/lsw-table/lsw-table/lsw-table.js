// @code.start: LswTable API | @$section: Vue.js (v2) Components » Lsw Table API » LswTable component
Vue.component("LswTable", {
  template: $template,
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
      default: () => { }
    },
    choosableId: {
      type: String,
      default: () => "id"
    },
    initialChoosenValue: {
      type: [],
      default: () => []
    },
    storageId: {
      type: [String, Boolean],
      default: () => false
    },
    storageStrategy: {
      type: String,
      default: () => "ufs/lsw", // No otras de momento.
    }
  },
  data() {
    this.$trace("lsw-table.data");
    const input = [].concat(this.initialInput);
    return {
      input,
      self: this,
      title: this.initialSettings?.title || "",
      isShowingMenu: this.initialSettings?.isShowingMenu || false,
      isShowingSubpanel: this.initialSettings?.isShowingSubpanel || "Todo", // "Buscador", ...
      selectedRows: [],
      choosenRows: this.initialChoosenValue || [],
      searcher: this.initialSettings?.searcher || "",
      extender: this.initialSettings?.extender || "",
      filter: this.initialSettings?.filter || "",
      sorter: this.initialSettings?.sorter || "",
      autosorter: [],
      itemsPerPageOnForm: this.initialSettings?.itemsPerPage || 10,
      itemsPerPage: this.initialSettings?.itemsPerPage || 10,
      currentPage: this.initialSettings?.currentPage || 0,
      currentPageOnForm: (this.initialSettings?.currentPage + 1) || 1,
      columnsAsList: this.initialSettings?.columnsAsList || [],
      columnsOrder: this.initialSettings?.columnsOrder || [],
      columnsOrderInput: (this.initialSettings?.columnsOrder || []).join(", "),
      output: [],
      paginatedOutput: [],
      headers: [],
      attachedHeaders: this._adaptRowButtonsToHeaders(this.rowButtons),
      attachedColumns: this._adaptRowButtonsToColumns(this.rowButtons),
      attachedTopButtons: this._adaptRowButtonsToColumns(this.tableButtons),
      placeholderForExtensor: "data.map(function(it, i) {\n  return Object.assign({}, it, /* you start here */ || {});\n});",
      placeholderForOrdenador: "data.sort(function(a, b) {\n  return /* you start here */;\n});",
      placeholderForFiltro: "data.filter(function(it, i) {\n  return /* you start here */;\n});",
      placeholderForBuscador: "Búsqueda de texto rápida",
      placeholderForPaginador: "Ítems por página. Por defecto: 10"
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
      if (this.selectable === 'many') {
        const pos = this.choosenRows.indexOf(rowId);
        if (pos === -1) {
          this.choosenRows.push(rowId);
        } else {
          this.choosenRows.splice(pos, 1);
        }
      } else if (this.selectable === 'one') {
        const isSame = this.choosenRows === rowId;
        if (isSame) {
          this.choosenRows = undefined;
        } else {
          this.choosenRows = rowId;
        }
      }
    },
    toggleRow(rowIndex) {
      this.$trace("lsw-table.methods.toggleRow");
      if (typeof rowIndex === "undefined") {
        return this.$lsw.toasts.send({
          title: "La row no se desplegará",
          text: "Añade «id» para que se puedan seleccionar las rows"
        })
      }
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
    reloadInput(input) {
      this.$trace("lsw-table.methods.reloadInput");
      this.input = input;
      this.digestOutput();
    },
    nextSortStateFor(header) {
      this.$trace("lsw-table.methods.nextSortStateFor");
      const posIncrease = this.autosorter.indexOf(header);
      const posDecrease = this.autosorter.indexOf("!" + header);
      if (posIncrease !== -1) {
        this.autosorter.splice(posIncrease, 1, "!" + header);
      } else if (posDecrease !== -1) {
        this.autosorter.splice(posDecrease, 1);
      } else {
        this.autosorter.push(header);
      }
      this.digestOutput();
    },
    getAutoSorterCallback() {
      this.$trace("lsw-table.methods.getAutoSorterCallback");
      return (a, b) => {
        for(let indexRow=0; indexRow<this.autosorter.length; indexRow++) {
          const header = this.autosorter[indexRow];
          const isReversed = header.startsWith("!");
          const field = isReversed ? header.substr(1) : header.substr(0);
          const va = a[field];
          const vb = b[field];
          if(typeof vb === "undefined") {
            return isReversed ? 1 : -1;
          } else if(typeof va === "undefined") {
            return isReversed ? -1 : 1;
          }
          const van = LswUtils.toFloatOr(va, va);
          const vbn = LswUtils.toFloatOr(vb, vb);
          if(van < vbn) {
            return isReversed ? 1 : -1;
          } else if(van > vbn) {
            return isReversed ? -1 : 1;
          }
        }
        return 0;
      };
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
      Iterating_rows:
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
        let isValidFinally = true;
        Apply_searcher: {
          if (this.searcher.trim() !== "") {
            const hasMatch = JSON.stringify(extendedRow).toLowerCase().indexOf(this.searcher.toLowerCase()) !== -1;
            if (!hasMatch) {
              isValidFinally = isValidFinally && false;
            }
          }
        }
        Apply_filter: {
          try {
            const filterProduct = filterFunction(extendedRow, index);
            if (filterProduct !== true) {
              isValidFinally = isValidFinally && false;
            }
          } catch (error) {
            // @OK.
          }
        }
        Extract_row: {
          if (isValidFinally) {
            temp.push(extendedRow);
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
          if(this.autosorter.length) {
            const autosorter = this.getAutoSorterCallback();
            temp = temp.sort(autosorter);
          } else {
            temp = temp.sort(sorterFunction);
          }
        } catch (error) {
          // @OK.
        }
        Also_to_headers: {
          if (Array.isArray(this.columnsOrder) && this.columnsOrder.length) {
            tempHeaders = [...tempHeaders].sort((h1, h2) => {
              const pos1 = this.columnsOrder.indexOf(h1);
              const pos2 = this.columnsOrder.indexOf(h2);
              if (pos1 === -1 && pos2 === -1) {
                return -1;
              } else if (pos1 === -1) {
                return 1;
              } else if (pos2 === -1) {
                return -1;
              } else if (pos1 > pos2) {
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
      const page = this.currentPageOnForm - 1;
      Inject_form_state_of_items_per_page_here: {
        this.itemsPerPage = this.itemsPerPageOnForm;
      }
      const items = this.itemsPerPage;
      const firstPosition = items * (page);
      this.selectedRows = [];
      this.paginatedOutput = [].concat(this.output).splice(firstPosition, items);
    },
    saveCurrentTransformer() {
      this.$trace("lsw-table.methods.saveCurrentTransformer");
    },
    _adaptRowButtonsToHeaders(rowButtons) {
      const attachedHeaders = [];
      for (let index = 0; index < rowButtons.length; index++) {
        const attachedButton = rowButtons[index];
        attachedHeaders.push({
          text: attachedButton.header || ""
        });
      }
      return attachedHeaders;
    },
    _adaptRowButtonsToColumns(rowButtons) {
      const attachedColumns = [];
      for (let index = 0; index < rowButtons.length; index++) {
        const attachedButton = rowButtons[index];
        attachedColumns.push({
          text: attachedButton.text || "",
          event: attachedButton.event || this.$noop,
        });
      }
      return attachedColumns;
    },
    updateColumnsOrderFromInput() {
      this.$trace("lsw-table.methods.updateColumnsOrderFromInput");
      this.columnsOrder = this.columnsOrderInput.split(",").map(it => it.trim());
      this.digestOutput();
    },
    increaseItemsPerPage() {
      this.$trace("lsw-table.methods.increaseItemsPerPage");
      this.itemsPerPageOnForm++;
    },
    decreaseItemsPerPage() {
      this.$trace("lsw-table.methods.decreaseItemsPerPage");
      this.itemsPerPageOnForm--;
    },
    getStoragePathFor(id) {
      this.$trace("lsw-table.methods.getStoragePathFor");
      return this.$lsw.fs.resolve_path("/kernel/settings/table/storage/", id);
    },
    async loadState() {
      this.$trace("lsw-table.methods.loadState");
      Check_strategy_and_validation: {
        if (this.storageStrategy !== "ufs/lsw") {
          console.log(`[*] Could not load state on lsw-table because of: UnknownStorageStrategy (=${this.storageStrategy})`);
          return -1;
        }
        if (!this.storageId) {
          // console.log(`[*] Could not load state on lsw-table because of: NoStorageId (=${this.storageId})`);
          return -2;
        }
      }
      const storagePath = this.getStoragePathFor(this.storageId);
      const storageJson = await (() => {
        try {
          return this.$lsw.fs.read_file(storagePath);
        } catch (error) {
          console.log(`[*] Could not load state on lsw-table because of: BadStoragePath (=${this.storagePath})`);
          return undefined;
        }
      })();
      if (typeof storageJson !== "string") {
        console.log(`[*] Could not load state on lsw-table because of: JsonStorageNotString (=${typeof storageJson})`);
        return -3;
      }
      let storageData = undefined;
      try {
        storageData = JSON.parse(storageJson);
      } catch (error) {
        console.log(`[*] Could not load state on lsw-table because of: JsonStorageNotParseable (${error.name}=${error.message})`);
        return -4;
      }
      Cargar_estado: {
        if (typeof storageData !== "object") {
          console.log(`[*] Could not load state on lsw-table because of: StorageDataNotObject (${typeof storageData})`);
          return -5;
        }
        console.log("[*] Loading lsw-table state from: ", storageData);
        Object.assign(this, storageData);
      }
    },
    saveState() {
      this.$trace("lsw-table.methods.saveState");
      Check_strategy_and_validation: {
        if (this.storageStrategy !== "ufs/lsw") {
          console.log(`[*] Could not save state on lsw-table because of: UnknownStorageStrategy (=${this.storageStrategy})`);
          return -1;
        }
        if (!this.storageId) {
          // console.log(`[*] Could not save state on lsw-table because of: NoStorageId (=${this.storageId})`);
          return -2;
        }
      }
      const storagePath = this.getStoragePathFor(this.storageId);
      const storageState = this.extractState();
      const storageJson = JSON.stringify(storageState, null, 2);
      Guardar_estado: {
        console.log("[*] Saving lsw-table state as: ", storageState);
        this.$lsw.fs.write_file(storagePath, storageJson);
        this.$lsw.toasts.send({
          title: "Estado de tabla guardado",
          text: "Con identificador: " + this.storageId,
        });
      }
      return true;
    },
    extractState() {
      this.$trace("lsw-table.methods.extractState");
      return LswUtils.extractPropertiesFrom(this, [
        // "input",
        "title",
        "isShowingMenu",
        "isShowingSubpanel",
        "selectedRows",
        "choosenRows",
        "searcher",
        "extender",
        "filter",
        "sorter",
        "itemsPerPageOnForm",
        "itemsPerPage",
        "currentPage",
        "currentPageOnForm",
        "columnsAsList",
        "columnsOrder",
        "columnsOrderInput",
        // "output",
        // "paginatedOutput",
        "headers",
        // "attachedHeaders",
        // "attachedColumns",
        // "attachedTopButtons",
        // "placeholderForExtensor",
        // "placeholderForOrdenador",
        // "placeholderForFiltro",
        // "placeholderForBuscador",
        // "placeholderForPaginador",
      ], [
        "input",
        "output",
        "paginatedOutput",
        "attachedHeaders",
        "attachedColumns",
        "attachedTopButtons",
        "placeholderForExtensor",
        "placeholderForOrdenador",
        "placeholderForFiltro",
        "placeholderForBuscador",
        "placeholderForPaginador",
      ], {
        isShowingMenu: false,
        isShowingSubpanel: "Todo",
      });
    },
  },
  watch: {
    itemsPerPage(value) {
      this.$trace("lsw-table.watch.itemsPerPage");
      /// this.digestPagination();
    },
    currentPage(value) {
      this.$trace("lsw-table.watch.currentPage");
      this.currentPageOnForm = value + 1;
      this.digestPagination();
    },
    choosenRows(v) {
      this.$trace("lsw-table.watch.value");
      this.onChooseRow(v, this);
    }
  },
  computed: {
    hasFiltersApplying() {
      // @BUGGY: estos logs causan recursividad en el console-hooker
      // this.$trace("lsw-table.computed.hasFiltersApplying");
      if (this.autosorter.length) {
        return true;
      }
      if (this.extender.length) {
        return true;
      }
      if (this.filter.length) {
        return true;
      }
      if (this.sorter.length) {
        return true;
      };
      if (this.searcher.length) {
        return true;
      }
      if (this.currentPage !== 0) {
        return true;
      }
      if ((this.currentPage + 1) !== this.currentPageOnForm) {
        return true;
      }
      if (this.itemsPerPage < 10) {
        return true;
      }
      if (this.itemsPerPageOnForm !== this.itemsPerPage) {
        return true;
      }
      if (["id", ""].indexOf(this.columnsOrderInput) === -1) {
        return true;
      }
      if ([0, 1].indexOf(this.columnsOrder.length) === 1) {
        return true;
      }
      return false;
    },
    totalOfPages() {
      // @BUGGY: estos logs causan recursividad en el console-hooker
      // this.$trace("lsw-table.computed.totalOfPages");
      return Math.ceil(this.output.length / this.itemsPerPage) || 1;
    },
    currentLastPage() {
      this.$trace("lsw-table.computed.currentLastPage");
      return Math.floor(this.output.length / this.itemsPerPage) || 1;
    }
  },
  mounted() {
    this.$trace("lsw-table.mounted");
    this.loadState();
    this.digestOutput();
  }
});
// @code.end: LswTable API