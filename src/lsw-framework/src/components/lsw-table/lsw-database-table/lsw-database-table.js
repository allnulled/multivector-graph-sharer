Vue.component("LswDatabaseTable", {
  template: $template,
  props: {
    databaseId: {
      type: String,
      required: true
    },
    tableId: {
      type: String,
      required: true
    },
    initialValue: {
      type: [Array],
      default: () => []
    },
    selectable: {
      type: String,
      default: () => "none", // Possible values: "one", "many", "none"
    }
  },
  data() {
    return {};
  },
  methods: {
    goToFirstPage() {},
    decreasePage() {},
    increasePage() {},
    goToLastPage() {},
  },
  watch: {
    
  },
  computed: {
    
  },
  mounted() {

  }
});