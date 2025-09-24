// @code.start: LswAppsViewerPanel API | @$section: Módulo org.allnulled.lsw-conductometria » Vue.js (v2) Components » LswAppsViewer API » LswAppsViewerPanel component
Vue.component("LswAppsViewerPanel", {
  template: $template,
  props: {

  },
  data() {
    this.$trace("lsw-apps-viewer-panel.data");
    return {
      isOpened: false,
      selectedApplication: 'despues', // 'antes', 'despues'
      accionesAntes: false,
      accionesDespues: false,
      horaActual: LswTimer.utils.fromDateToHour(new Date()),
    };
  },
  methods: {
    selectApplication(section) {
      this.$trace("lsw-apps-viewer-panel.methods.selectApplication");
      this.selectedApplication = section;
      Cargas_segun_aplicacion: {
        if (["antes", "despues"].indexOf(section) !== -1) {
          this.loadAcciones();
        } else {
          this.$forceUpdate(true);
        }
      }
    },
    getSimboloEstadoAccion(estado) {
      return (estado === "completada") ? "💚" :
        (estado === "pendiente") ? "❓" :
          (estado === "fallida") ? "🔥" : "";
    },
    async loadAcciones() {
      this.$trace("lsw-apps-viewer-panel.methods.loadAcciones");
      const output = await this.$lsw.database.selectMany("Accion");
      const estaHora = (() => {
        const d = new Date();
        d.setMinutes(0);
        return d;
      })();
      const accionesAntes = [];
      const accionesDespues = [];
      output.forEach(accion => {
        try {
          const dateAccion = LswTimer.utils.fromDatestringToDate(accion.tiene_inicio);
          const areSameDay = LswTimer.utils.areSameDayDates(dateAccion, estaHora);
          if (!areSameDay) return;
          if (dateAccion >= estaHora) {
            accionesDespues.push(accion);
          } else {
            accionesAntes.push(accion);
          }
        } catch (error) {
          console.log(error);
        }
      });
      this.accionesAntes = accionesAntes.sort(this.getSorterOfAccionesAntes());
      this.accionesDespues = accionesDespues.sort(this.getSorterOfAccionesDespues());
      this.$forceUpdate(true);
    },
    getSorterOfAccionesAntes() {
      this.$trace("lsw-apps-viewer-panel.methods.getSorterOfAccionesAntes");
      return function (accion1, accion2) {
        let inicio1, inicio2;
        try {
          inicio1 = LswTimer.utils.fromDatestringToDate(accion1.tiene_inicio);
        } catch (error) {
          return 1;
        }
        try {
          inicio2 = LswTimer.utils.fromDatestringToDate(accion2.tiene_inicio);
        } catch (error) {
          return -1;
        }
        const firstIsLower = inicio1 < inicio2;
        return firstIsLower ? 1 : -1;
      };
    },
    getSorterOfAccionesDespues() {
      this.$trace("lsw-apps-viewer-panel.methods.getSorterOfAccionesDespues");
      return function (accion1, accion2) {
        let inicio1, inicio2;
        try {
          inicio1 = LswTimer.utils.fromDatestringToDate(accion1.tiene_inicio);
        } catch (error) {
          return 1;
        }
        try {
          inicio2 = LswTimer.utils.fromDatestringToDate(accion2.tiene_inicio);
        } catch (error) {
          return -1;
        }
        const firstIsLower = inicio1 <= inicio2;
        return firstIsLower ? -1 : 1;
      };
    },
    async alternarEstado(accion) {
      this.$trace("lsw-apps-viewer-panel.methods.alternarEstado");
      const nextEstado = accion.tiene_estado === "pendiente" ? "completada" :
        accion.tiene_estado === "completada" ? "fallida" : "pendiente";
      await this.$lsw.database.update("Accion", accion.id, {
        ...accion,
        tiene_estado: nextEstado
      });
      await this.loadAcciones();
    },
    async reloadPanel() {
      this.$trace("lsw-apps-viewer-panel.methods.reloadPanel");
      await this.loadAcciones();
    },
    async openNotaUploader() {
      this.$trace("lsw-apps-viewer-panel.methods.openNotaUploader", arguments);
      const response = await LswUtils.openAddNoteDialog();
      if (typeof response !== "object") {
        return;
      }
      await this.$lsw.database.insert("Nota", response);
    },
    openWikiExplorer() {
      this.$trace("lsw-windows-main-tab.methods.openWikiExplorer", arguments);
      this.$dialogs.open({
        id: "wiki-explorer-" + LswRandomizer.getRandomString(5),
        title: "Wiki explorer",
        template: `<div class="pad_2"><lsw-wiki /></div>`,
      });
    },
    async openArticuloUploader() {
      this.$trace("lsw-windows-main-tab.methods.openArticuloUploader", arguments);
      const response = await LswUtils.openAddArticuloDialog();
      if (typeof response !== "object") {
        return;
      }
      await this.$lsw.database.insert("Articulo", response);
    },
    updateHoraActual() {
      this.$trace("lsw-windows-main-tab.methods.updateHoraActual", arguments);
      this.horaActual = LswTimer.utils.fromDateToHour(new Date());
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-apps-viewer-panel.mounted");
      await this.loadAcciones();
    } catch (error) {
      console.log(error);
    }
  },
});
// @code.end: LswAppsViewerPanel API