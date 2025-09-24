// @code.start: LswWindowsMainTab API | @$section: Vue.js (v2) Components » Lsw Windows API » LswWindowsMainTab component
// Change this component at your convenience:
Vue.component("LswWindowsMainTab", {
  template: $template,
  props: {
    viewer: {
      type: Object,
      required: true
    }
  },
  data() {
    this.$trace("lsw-windows-main-tab.data");
    return {
      isShowingApps: false,
    };
  },
  methods: {
    async showConsole() {
      this.$trace("lsw-windows-main-tab.methods.showConsole");
      this.$consoleHooker.toggleConsole();
    },
    getRandomString(len = 10) {
      this.$trace("lsw-windows-main-tab.methods.getRandomString");
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      let out = "";
      while(out.length < len) {
        out += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      return out;
    },
    openRest() {
      this.$trace("lsw-windows-main-tab.methods.openRest");
      this.viewer.hide();
      this.$dialogs.open({
        id: "database-explorer-" + this.getRandomString(5),
        title: "Database explorer",
        template: `<div class="pad_1"><lsw-database-explorer /></div>`,
      });
    },
    openFilesystem() {
      this.$trace("lsw-windows-main-tab.methods.openFilesystem");
      this.viewer.hide();
      this.$dialogs.open({
        id: "filesystem-explorer-" + this.getRandomString(5),
        title: "Filesystem explorer",
        template: `<lsw-filesystem-explorer  :absolute-layout="true" />`,
      });
    },
    openWiki() {
      this.$trace("lsw-windows-main-tab.methods.openWiki");
      this.viewer.hide();
      this.$dialogs.open({
        id: "wiki-explorer-" + this.getRandomString(5),
        title: "Wiki explorer",
        template: `<div class="pad_1"><lsw-wiki /></div>`,
      });
    },
    openAgenda() {
      this.$trace("lsw-windows-main-tab.methods.openAgenda");
      this.viewer.hide();
      this.$dialogs.open({
        id: "agenda-viewer-" + this.getRandomString(5),
        title: "Agenda viewer",
        template: `<div class="pad_horizontal_1"><lsw-agenda /></div>`,
      });
    },
    openAutomessages() {
      this.$trace("lsw-windows-main-tab.methods.openAutomessages");
      this.viewer.hide();
    },
    openNoteUploader() {
      this.$trace("lsw-windows-main-tab.methods.openNoteUploader");
      this.viewer.hide();
      this.$dialogs.open({
        id: "notas-" + this.getRandomString(5),
        title: "Notas",
        template: `<div class="pad_1"><lsw-spontaneous-table-nota /></div>`,
      });
    },
    openConfigurationsPage() {
      this.$trace("lsw-windows-main-tab.methods.openConfigurationsPage");
      this.viewer.hide();
      this.$dialogs.open({
        id: "configurations-page-" + this.getRandomString(5),
        title: "Configuraciones",
        template: `<div class="pad_1"><lsw-configurations-page /></div>`,
      });
    },
    closeProcess(dialog) {
      this.$trace("lsw-windows-main-tab.methods.closeProcess");
      this.$lsw.dialogs.close(dialog.id);
    },
    toggleApps() {
      this.$trace("lsw-windows-main-tab.methods.toggleApps");
      this.isShowingApps = !this.isShowingApps;
    },
    openApp() {
      
    }
  },
  mounted() {
    this.$lsw.windowsMainTab = this;
  }
});
// @code.end: LswWindowsMainTab API