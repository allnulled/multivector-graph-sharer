// @code.start: LswRefObjectByLabelControl API | @$section: Vue.js (v2) Components » Lsw Formtypes API » LswRefObjectByLabelControl component
Vue.component("LswRefObjectByLabelControl", {
  template: $template,
  props: {
    settings: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    this.$trace("lsw-ref-object-by-label-control.data");
    this.validateSettings();
    return {
      uuid: LswRandomizer.getRandomString(5),
      value: this.settings.initialValue || [],
      isLoaded: false,
      isValueLoaded: false,
      isEditable: true,
      isShownSelector: true,
      isShownInfo: false,
      rows: []
    };
  },
  methods: {
    toggleSelector() {
      this.$trace("lsw-ref-object-by-label-control.methods.toggleSelector");
      this.isShownSelector = !this.isShownSelector;
    },
    toggleInfo() {
      this.$trace("lsw-ref-object-by-label-control.methods.toggleInfo");
      this.isShownInfo = !this.isShownInfo;
    },
    async submit() {
      this.$trace("lsw-ref-object-by-label-control.methods.submit");
      return LswFormtypes.utils.submitControl.call(this);
      
    },
    validate() {
      this.$trace("lsw-ref-object-by-label-control.methods.validateSettings");
      return LswFormtypes.utils.validateControl.call(this);
    },
    validateSettings() {
      this.$trace("lsw-ref-object-by-label-control.methods.validateSettings");
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
      this.$trace("lsw-ref-object-by-label-control.methods.loadValue");
      const selection = await this.$lsw.database.select(this.settings.tableId, it => true);
    },
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-ref-object-by-label-control.mounted");
      await this.loadRows();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswRefObjectByLabelControl API