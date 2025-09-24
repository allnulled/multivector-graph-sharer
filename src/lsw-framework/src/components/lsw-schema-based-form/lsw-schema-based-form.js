// @code.start: LswSchemaBasedForm API | @$section: Vue.js (v2) Components » Lsw SchemaBasedForm API » LswSchemaBasedForm component
Vue.component("LswSchemaBasedForm", {
  template: $template,
  props: {
    model: {
      type: Object,
      required: true,
    },
    onSubmit: {
      type: Function,
      default: () => this.$noop,
    },
    onValidate: {
      type: Function,
      default: () => this.$noop,
    },
    onDeleteRow: {
      type: Function,
      default: () => this.$noop,
    },
    overridenValues: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.$trace("lsw-schema-based-form.data");
    this.validateModel(this.model);
    const isOperation = (this.model.row && this.model.row.id) || (this.model.rowId && (this.model.rowId !== -1)) ? "update" : "insert";
    return {
      own: this,
      validFormtypes: [
        "text",
        "long-text",
        "options",
        "boolean",
        "date",
        "duration",
        "ref-object",
        "ref-object-by-label",
        "ref-list",
        "ref-relation",
        "source-code",
      ],
      section: 'campos propios', // 'campos reflejos'
      isShowingFormInfo: false,
      isLoaded: false,
      tableDefinition: false,
      columnDefinitions: false,
      value: this.model.row ?? false,
      editableFields: [],
      minimizedFields: [],
      isOperation,
      isUpdateOperation: isOperation === "update",
      isInsertOperation: isOperation === "insert",
    };
  },
  methods: {
    selectSection(section) {
      this.section = section;
    },
    toggleMinimizedField(field) {
      this.$trace("lsw-schema-based-form.methods.toggleMinimizedField");
      const fieldPos = this.minimizedFields.indexOf(field);
      if (fieldPos === -1) {
        this.minimizedFields.push(field);
      } else {
        this.minimizedFields.splice(fieldPos, 1);
      }
      this.$forceUpdate(true);
    },
    hideMinimizedField(field) {
      this.$trace("lsw-schema-based-form.methods.hideMinimizedField");
      const fieldPos = this.minimizedFields.indexOf(field);
      if (fieldPos === -1) {
        this.minimizedFields.push(field);
      }
      this.$forceUpdate(true);
    },
    showMinimizedField(field) {
      this.$trace("lsw-schema-based-form.methods.showMinimizedField");
      const fieldPos = this.minimizedFields.indexOf(field);
      if (fieldPos !== -1) {
        this.minimizedFields.splice(fieldPos, 1);
      }
      this.$forceUpdate(true);
    },
    toggleEditableField(field) {
      this.$trace("lsw-schema-based-form.methods.toggleEditableField");
      const fieldPos = this.editableFields.indexOf(field);
      if (fieldPos === -1) {
        this.editableFields.push(field);
      } else {
        this.editableFields.splice(fieldPos, 1);
      }
    },
    saveField(field, value) {
      this.$trace("lsw-schema-based-form.methods.saveField");
      console.log("Should save field:", field, value);
      // *@TODO: use $lsw.database.overwrite to send the field only

    },
    validateModel(model) {
      this.$trace("lsw-schema-based-form.methods.validateModel");
      try {
        const ensureModel = $ensure({ model }, 1);
        const checkModel = $check(model);
        Basic_type_and_signature: {
          ensureModel.type("object");
          ensureModel.to.have.uniquelyKeys(["connection", "databaseId", "tableId", "rowId", "row", "databaseExplorer"]);
          ensureModel.to.have.keys(["databaseId", "tableId"]);
          const correctOption = $ensure.$or({
            "has connection and rowId (set -1 for new instances)": () => ensureModel.to.have.key("rowId"),
            "has row": () => ensureModel.to.have.key("row"),
          });
          if (!checkModel.to.have.key("rowId")) {
            ensureModel.to.have.key("row");
          }
        }
        Component_types_and_signatures: {
          if (checkModel.to.have.key("connection")) {
            ensureModel.its("connection").type("object");
          }
          if (checkModel.to.have.key("databaseId")) {
            ensureModel.its("databaseId").type("string");
          }
          if (checkModel.to.have.key("tableId")) {
            ensureModel.its("tableId").type("string");
          }
          if (checkModel.to.have.key("rowId")) {
            ensureModel.its("rowId").type("number");
          }
          if (checkModel.to.have.key("row")) {
            $ensure.$or({
              "row is object": () => ensureModel.its("row").type("object"),
              "row is false": () => ensureModel.its("row").type("boolean").is(false),
            });
          }
          if(checkModel.to.have.key("databaseExplorer")) {
            ensureModel.its("databaseExplorer").type("object");
          }
        }
      } catch (error) {
        console.error("Failed validating «model» property on «lsw-schema-based-form.validateModel»");
        console.error(error);
      }
    },
    async loadValue() {
      this.$trace("lsw-schema-based-form.methods.loadValue");
      if (this.model.rowId) {
        const originalValues = await LswDatabase.pickRow(this.model.databaseId, this.model.tableId, this.model.rowId);
        this.value = Object.assign({}, originalValues, this.overridenValues);
      }
    },
    onlyKnownTypes(formtype) {
      if(this.validFormtypes.indexOf(formtype) !== -1) {
        return formtype;
      }
      return "long-text";
    },
    async loadSchema() {
      this.$trace("lsw-schema-based-form.methods.loadSchema");
      const columnIds = Object.keys($lswSchema.$schema.hasTables[this.model.tableId].hasColumns);
      for(let columnId of columnIds) {
        const columnData = $lswSchema.$schema.hasTables[this.model.tableId].hasColumns[columnId];
        Object.assign(columnData, {
          belongsToDatabase: this.model.databaseId,
          belongsToTable: this.model.tableId,
          hasFormtypeSettings: {
            id: 'lsw-' + this.onlyKnownTypes(columnData.isFormType) + '-control',
            name: columnId,
            input: {
              props: {
                placeholder: columnData.hasPlaceholder,
              },
              events: {
                
              }
            },
          }
        })
      }
      this.tableDefinition = $lswSchema.$schema.hasTables[this.model.tableId];
      this.columnDefinitions = this.tableDefinition.hasColumns;
    },
    toggleFormInfo() {
      this.$trace("lsw-schema-based-form.methods.toggleFormInfo");
      this.isShowingFormInfo = !this.isShowingFormInfo;
    },
    closeEditables() {
      this.$trace("lsw-schema-based-form.methods.closeEditables");
      const uneditables = this.$el.querySelectorAll(".lsw_form_control .lsw_control_label .button_to_uneditable");
      for(let index=0; index<uneditables.length; index++) {
        const uneditable = uneditables[index];
        uneditable.click();
      }
    },
    openEditables() {
      this.$trace("lsw-schema-based-form.methods.openEditables");
      const editables = this.$el.querySelectorAll(".lsw_form_control .lsw_control_label .button_to_editable");
      for(let index=0; index<editables.length; index++) {
        const editable = editables[index];
        editable.click();
      }
    },
    validateForm() {
      this.$trace("lsw-schema-based-form.methods.validateForm");
      return this.$refs.schemaForm0.$xform.validate();
    },
    async submitForm(v) {
      this.$trace("lsw-schema-based-form.methods.submitForm");
      return await this.$refs.schemaForm0.$xform.submit();
    },
    passToPrinter() {
      this.$trace("lsw-schema-based-form.methods.passToPrinter");
      const value = this.$refs.schemaForm0.$xform.getValue();
      this.$lsw.dialogs.open({
        title: "Impresión de estado de formulario",
        template: `
          <lsw-data-printer-report :input="input" />
        `,
        factory: { data: { input: value } },
      });
    },
    async deleteRow() {
      this.$trace("lsw-schema-based-form.methods.deleteRow");
      const confirmed = await this.$lsw.dialogs.open({
        id: `eliminar-registro-${this.model.tableId}-${this.model.rowId || this.model.row.id}-${LswRandomizer.getRandomString(5)}`,
        title: "Eliminar registro",
        template: `
          <div>
            <div class="pad_2 font_weight_bold">ATENCIÓN: </div>
            <div class="pad_2">¿Seguro que quieres eliminar el registro <b>{{ model.tableId }}</b> cuyo <b>id</b>#<b>{{ model.rowId || model.row.id }}</b>?</div>
            <div class="pad_2">
              <pre class="pad_2 codeblock">{{ JSON.stringify(model.row || rowValue, null, 2) }}</pre>
            </div>
            <hr class="margin_0" />
            <div class="pad_2 text_align_right">
              <button class="supermini danger_button" v-on:click="() => accept(true)">Eliminar</button>
              <button class="supermini " v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        `,
        factory: {
          data: {
            model: this.model,
            rowValue: this.value
          }
        }
      });
      if(!confirmed) return false;
      const rowIdentifier = this.model.rowId || this.model.row.id;
      await this.$lsw.database.delete(this.model.tableId, rowIdentifier);
      if(this.onDeleteRow) {
        const result = this.onDeleteRow(this.model.rowId, this.model.tableId, true);
        // INTERCEPT REDIRECTION RETURNING FALSE FROM onDeleteRow PARAMETRIC CALLBACK
        if(result === false) return;
      }
      if(this.model.databaseExplorer) {
        if(this.model.databaseExplorer.showBreadcrumb) {
          this.model.databaseExplorer.selectPage("LswPageRows", {
            database: this.model.databaseId,
            table: this.model.tableId,
          });
        } else {
          
        }
      }
    }
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-schema-based-form.mounted");
      await this.loadSchema();
      await this.loadValue();
      this.isLoaded = true;
      this.$nextTick(() => {
        window.sf0 = this.$refs.schemaForm0;
      });
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswSchemaBasedForm API