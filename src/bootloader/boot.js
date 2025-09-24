try {
  Step_1_organize_api: {
    Vue.prototype.$noop = () => { };
    Vue.prototype.$window = window;
    Vue.prototype.$console = console;
    Vue.prototype.$vue = Vue;
    Vue.prototype.$lsw = Vue.prototype.$lsw || {};
    Inject_global_api: {
      Vue.prototype.$lsw.fs = new LswFilesystem();
      Vue.prototype.$lsw.fs.init().then(() => {
        console.log("[*] LswFilesystem instance was loaded successfully.");
      });
      Vue.prototype.$lsw.importer = importer;
      Vue.prototype.$lsw.logger = Superlogger.create("lsw");
      Vue.prototype.$trace = (...args) => Vue.prototype.$lsw.logger.trace(...args);
      Vue.prototype.$lsw.utils = LswUtils;
      Vue.prototype.$lsw.timer = LswTimer;
      Vue.prototype.$lsw.backuper = LswBackuper.create();
      Vue.prototype.$lsw.intruder = LswIntruder.create();
      Vue.prototype.$lsw.windows = null;
      Vue.prototype.$lsw.dialogs = null;
      Vue.prototype.$lsw.toasts = null;
      Vue.prototype.$lsw.lazyLoader = LswLazyLoader.global;
      Vue.prototype.$lsw.lazyLoads = LswLazyLoads;
      Vue.prototype.$lsw.proxifier = $proxifier;
      Vue.prototype.$lsw.wiki = null;
      Vue.prototype.$lsw.debugger = null;
      Vue.prototype.$lsw.agenda = null;
      // GLOBALLY AVAILABLE PARSERS:
      Vue.prototype.$lsw.parsers = {
        timer: LswTimer.parser,
        proto: ProtolangParser,
        tripi: TripilangParser,
        dotenv: {
          parse: Vue.prototype.$lsw.fs.evaluateAsDotenvText.bind(Vue.prototype.$lsw.fs)
        }
      }
      // WE DO NOT INJECT DATABASE FROM HERE.
    }
    Vue.prototype.$lsw.classes = {};
    Inject_classes_api: {
      Vue.prototype.$lsw.classes.Logger = Superlogger;
      Vue.prototype.$lsw.classes.Proxifier = LswProxifier;
      Vue.prototype.$lsw.classes.Ensurer = LswEnsurer;
      Vue.prototype.$lsw.classes.Randomizer = LswRandomizer;
      Vue.prototype.$lsw.classes.Proxifier = LswProxifier;
      Vue.prototype.$lsw.classes.DatabaseMigration = LswDatabaseMigration;
      Vue.prototype.$lsw.classes.Database = LswDatabase;
      Vue.prototype.$lsw.classes.Cycler = LswCycler;
      Vue.prototype.$lsw.classes.Compromiser = LswCompromiser;
      Vue.prototype.$lsw.classes.Utils = LswUtils;
      Vue.prototype.$lsw.classes.Formtypes = LswFormtypes;
      Vue.prototype.$lsw.classes.Schema = LswSchema;
      Vue.prototype.$lsw.classes.Lifecycle = LswLifecycle;
      Vue.prototype.$lsw.classes.LazyLoader = LswLazyLoader;
      Vue.prototype.$lsw.classes.LazyLoads = LswLazyLoads;
      Vue.prototype.$lsw.classes.DatabaseVirtualizer = LswDatabaseVirtualizer;
      // Vue.prototype.$lsw.classes.DatabaseAdapter = LswDatabaseAdapter;
      Vue.prototype.$lsw.classes.Timer = LswTimer;
      Vue.prototype.$lsw.classes.Depender = LswDepender;
      Vue.prototype.$lsw.classes.Filesystem = LswFilesystem;
      Vue.prototype.$lsw.classes.ConsoleHooker = ConsoleHooker;
      Vue.prototype.$lsw.classes.ClassRegister = LswClassRegister;
      Vue.prototype.$lsw.classes.Backuper = LswBackuper;
      Vue.prototype.$lsw.classes.Intruder = LswIntruder;
      Vue.prototype.$lsw.classes.LswDebugger = LswDebugger;
      // Vue.prototype.$lsw.classes.Dialogs = LswDialogs;
      // Vue.prototype.$lsw.classes.Windows = LswWindows;
      // Vue.prototype.$lsw.classes.Toasts = LswToasts;
    }
    window.lsw = Vue.prototype.$lsw;
  }
  Step_2_remove_intersitial: {
    importer.$removeIntersitial();
  }
  
} catch (error) {
  console.error(error);
  console.log("[!] Boot failed");
}