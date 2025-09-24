// @code.start: LswRefObjectControl API | @$section: Vue.js (v2) Components » Lsw Formtypes API » LswRefObjectControl component
Vue.component("LswRefObjectControl", {
  template: $template,
  props: {
    settings: {
      type: Object,
      default: () => ({})
    },
    labelField: {
      type: String,
      required: true,
    }
  },
  data() {
    this.$trace("lsw-ref-object-control.data");
    this.validateSettings();
    return {
      uuid: LswRandomizer.getRandomString(5),
      value: this.settings.initialValue || [],
      isLoaded: false,
      isValueLoaded: false,
      isEditable: true,
      isShownSelector: true,
      isShownInfo: false,
      rows: [],
    };
  },
  methods: {
    toggleSelector() {
      this.$trace("lsw-ref-object-control.methods.toggleSelector");
      this.isShownSelector = !this.isShownSelector;
    },
    toggleInfo() {
      this.$trace("lsw-ref-object-control.methods.toggleInfo");
      this.isShownInfo = !this.isShownInfo;
    },
    async submit() {
      this.$trace("lsw-ref-object-control.methods.submit");
      return LswFormtypes.utils.submitControl.call(this);
      
    },
    validate() {
      this.$trace("lsw-ref-object-control.methods.validateSettings");
      return LswFormtypes.utils.validateControl.call(this);
    },
    validateSettings() {
      this.$trace("lsw-ref-object-control.methods.validateSettings");
      return LswFormtypes.utils.validateSettings.call(this);
    },
    async loadRows() {
      this.$trace("lsw-page-rows.methods.loadRows", arguments);
      const selection = await this.$lsw.database.select(this.settings.column.refersTo.table, it => true);
      this.rows = selection;
      this.isLoaded = true;
      return selection;
    },
    async loadValue() {
      this.$trace("lsw-ref-object-control.methods.loadValue");
      const selection = await this.$lsw.database.select(this.settings.tableId, it => true);
    },
    selectRow(row) {
      this.$trace("lsw-ref-object-control.methods.selectRow");
      this.value = row;
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-ref-object-control.mounted");
      await this.loadRows();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswRefObjectControl API