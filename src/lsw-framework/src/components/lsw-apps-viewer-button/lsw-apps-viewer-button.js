// @code.start: LswAppsViewerButton API | @$section: Módulo org.allnulled.lsw-conductometria » Vue.js (v2) Components » LswAppsViewerButton API » LswAppsViewerButton component
Vue.component("LswAppsViewerButton", {
  template: $template,
  props: {
    viewer: {
      type: Object,
      required: true,
    }
  },
  data() {
    this.$trace("lsw-apps-viewer-button.data");
    return {
      isOpened: false,
    };
  },
  methods: {
    toggleOpen() {
      this.$trace("lsw-apps-viewer-button.methods.toggleOpen");
      this.isOpened = !this.isOpened;
    },
    open() {
      this.$trace("lsw-apps-viewer-button.methods.open");
      this.isOpened = true;
    },
    close() {
      this.$trace("lsw-apps-viewer-button.methods.close");
      this.isOpened = false;
    },
    selectApplication(application) {
      this.$trace("lsw-apps-viewer-button.methods.selectApplication");
      // console.log(this.viewer);
      const isSame = this.viewer.selectedApplication === application;
      if(!isSame) {
        this.viewer.selectApplication(application);
      } else {
        // @NOTHING.
      }
      this.close();
    },
    openHomepage() {
      this.selectApplication("homepage");
    },
    openEventTracker() {
      this.selectApplication("event-tracker");
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-apps-viewer-button.mounted");
    } catch (error) {
      console.log(error);
    }
  },
});
// @code.end: LswAppsViewerButton API