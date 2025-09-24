(() => {
  let isFirstTime = true;
  const initialCode = `
inc /wherever/you/choose.proto

def correr {
  "definicion": @definicion "Correr es tal"
}

add 2025/01/01
  00:00 correr * 1h
  00:00 saltar * 5min
  00:00 comer * @alimentos [["leche","0.3L"],["cacao","2g"]]

fun yo.correr {
  // Nolose, aquí JS.
}

rel correr
  > cardio * 2
  >> yo.correr

`.trim();
  // Change this component at your convenience:
  Vue.component("App", {
    template: $template,
    props: {
      uuid: {
        type: String,
        default: () => {
          return Vue.prototype.$lsw.utils.getRandomString(10);
        }
      }
    },
    data() {
      return {
        isMounted: false,
        formScope: {},
        userScope: {},
        conductometria: [],
        conductometria_minified_days: [],
        initialContents: initialCode
      };
    },
    methods: {
      goToDocs() {
        this.$trace("App.methods.goToDocs");
        const confirmation = this.$window.confirm("Saldrás de la aplicación con una pestaña nueva, y es un poco incómodo. ¿Estás seguro?");
        if(!confirmation) return;
        this.$window.open("reference/index.html");
      },
      async resetDatabase() {
        this.$trace("App.methods.resetDatabase");
        const confirmacion = this.$window.confirm("Estás seguro que quieres resetear la base de datos?");
        if(!confirmacion) return;
        const reconfirmacion = this.$window.confirm("Seguro, eh?");
        if(!reconfirmacion) return;
        try {
          await this.$lsw.database.close();
        } catch (error) {
          console.log(error);
        }
        try {
          await LswDatabase.deleteDatabase("lsw_default_database");
        } catch (error) {
          console.log(error);
        }
        try {
          this.$lsw.database = await LswDatabase.open("lsw_default_database");
        } catch (error) {
          console.log(error);
        }
      },
      minimizeDialogs() {
        this.$trace("App.methods.minimizeDialogs");
        this.$lsw.dialogs.minimizeAll();
      },
      goToAddNota() {
        this.$trace("App.methods.goToAddNota");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("nueva nota");
      },
      goToAddArticulo() {
        this.$trace("App.methods.goToAddArticulo");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("nuevo articulo");
      },
      goToAddRecordatorio() {
        this.$trace("App.methods.goToAddRecordatorio");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("nuevo recordatorio");
      },
      goToAddAccion() {
        this.$trace("App.methods.goToAddAccion");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("nueva accion");
      },
      goToCalendario() {
        this.$trace("App.methods.goToCalendario");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("calendario");
      },
      goToDesktop() {
        this.$trace("App.methods.goToDesktop");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("none");
      },
      goToNotas() {
        this.$trace("App.methods.goToNotas");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("notas");
      },
      goToEnciclopedia() {
        this.$trace("App.methods.goToEnciclopedia");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("enciclopedia");
      },
      clickPicas() {
        this.$trace("App.methods.clickPicas");
        this.minimizeDialogs();
        document.querySelector("#the_picas_button").click();
      },
      goToBinaries() {
        this.$trace("App.methods.goToBinaries");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("binarios");
      },
      goToHomepage() {
        this.$trace("App.methods.goToHomepage");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("homepage");
      },
      goToFilesystem() {
        this.$trace("App.methods.goToFilesystem");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("sistema de ficheros");
      },
      goToEventTracker() {
        this.$trace("App.methods.goToEventTracker");
        this.minimizeDialogs();
        this.$refs.desktop.selectApplication("event-tracker");
      },
      goToVolatileDatabaseUi() {
        this.$refs.desktop.selectApplication("volatile-db");
      },
      async initializeFilesystemForLsw() {
        this.$trace("lsw-filesystem-explorer.methods.initializeFilesystemForLsw");
        await this.$lsw.fs.ensureFile("/kernel/settings/rutiner.md", LswConstants.global.pick("rutiner.md"));
        await this.$lsw.fs.ensureFile("/kernel/settings/rutiner.config.env", LswConstants.global.pick("/kernel/settings/rutiner.config.env"));
        await this.$lsw.fs.ensureFile("/kernel/settings/randomizables.env", LswConstants.global.pick("randomizables.env"));
        await this.$lsw.fs.ensureFile("/kernel/settings/backgrounds.env", LswConstants.global.pick("backgrounds.env"));
        await this.$lsw.fs.ensureFile("/kernel/settings/automessages.env", LswConstants.global.pick("automessages.env"));
        await this.$lsw.fs.ensureFile("/kernel/settings/user.env", LswConstants.global.pick("user.env"));
        await this.$lsw.fs.ensureFile("/kernel/settings/trackables.env", LswConstants.global.pick("/kernel/settings/trackables.env"));
        await this.$lsw.fs.ensureDirectory("/kernel/wiki/libros");
        await this.$lsw.fs.ensureFile("/kernel/wiki/categorias.tri", LswConstants.global.pick("categorias.tri"));
        await this.$lsw.fs.ensureFile("/kernel/agenda/report/inicio.js", LswConstants.global.pick("report/inicio.js"));
        await this.$lsw.fs.ensureFile("/kernel/agenda/proto/boot.proto", LswConstants.global.pick("boot.proto"));
        await this.$lsw.fs.ensureDirectory("/kernel/agenda/proto/concepto");
        await this.$lsw.fs.ensureDirectory("/kernel/agenda/proto/funcion");
        await this.$lsw.fs.ensureDirectory("/kernel/agenda/proto/relacion");
        await this.$lsw.fs.ensureFile("/kernel/agenda/proto/funcion/multiplicador.js", LswConstants.global.pick("multiplicador.js"));
        await this.$lsw.fs.ensureDirectory("/kernel/settings/table/storage");
        await this.$lsw.fs.ensureDirectory("/kernel/goals/records");
        await this.$lsw.fs.ensureDirectory("/kernel/goals/todos");
        await this.$lsw.fs.ensureDirectory("/kernel/bin");
        await this.$lsw.fs.ensureFile("/kernel/apps/example/load.js", LswConstants.global.pick("/kernel/apps/example/load.js"));
        await this.$lsw.fs.ensureFile("/kernel/android/boot.js", LswConstants.global.pick("/kernel/android/boot.js"));
        await this.$lsw.fs.ensureFile("/kernel/android/api/load.js", LswConstants.global.pick("/kernel/android/api/load.js"));
        await this.$lsw.fs.ensureFile("/kernel/android/api/tts.js", LswConstants.global.pick("/kernel/android/api/tts.js"));
        await this.$lsw.fs.ensureFile("/kernel/android/api/reflection.js", LswConstants.global.pick("/kernel/android/api/reflection.js"));
        await this.$lsw.fs.ensureFile("/kernel/android/api/fs.js", LswConstants.global.pick("/kernel/android/api/fs.js"));
        await this.$lsw.fs.ensureFile("/kernel/android/api/debug.js", LswConstants.global.pick("/kernel/android/api/debug.js"));
        await this.$lsw.fs.ensureFile("/kernel/android/api/bindings.js", LswConstants.global.pick("/kernel/android/api/bindings.js"));
        await this.$lsw.fs.ensureFile("/kernel/goals/goals.week", LswConstants.global.pick("/kernel/goals/goals.week"));
        await this.$lsw.fs.ensureDirectory("/kernel/components");
        await this.$lsw.fs.ensureDirectory("/kernel/natyscript/data");
        await this.$lsw.fs.ensureFile("/kernel/boot.js", LswConstants.global.pick("boot.js"));
      },
    },
    async mounted() {
      console.log("[💛] Application mounted.");
      this.isMounted = true;
      if (isFirstTime) {
        Vue.prototype.$app = this;
        isFirstTime = false;
        window.dispatchEvent(new CustomEvent("lsw_app_mounted", {
          applicationUuid: this.uuid,
          $lsw: this.$lsw,
          appComponent: this,
        }));
        await this.initializeFilesystemForLsw();
        await LswLifecycle.onApplicationMounted();
      }
    }
  });
})(); 