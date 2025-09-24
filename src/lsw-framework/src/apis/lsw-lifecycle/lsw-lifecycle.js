(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswLifecycle'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswLifecycle'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswLifecycle class | @section: Lsw LswLifecycle API » LswLifecycle class

  const cycle = LswCycler.from({

    steps: [
      "onStarted",
      "onInitialize",
      "onInitialized",
      "onBoot",
      "onBooted",
      "onLoadSchema",
      "onSchemaLoaded",
      "onLoadDatabase",
      "onDatabaseLoaded",
      "onLoadComponents",
      "onComponentsLoaded",
      "onLoadCordovaSupport",
      "onCordovaSupportLoaded",
      "onLoadModules",
      "onModulesLoaded",
      "onInstallModules",
      "onModulesInstalled",
      "onLoadApplication",
      "onApplicationLoaded",
      "onAllLoaded",
      "onRunApplication",
      "onApplicationDeployed",
      "onFinished",
    ],

    hooks: TriggersClass.create(),

    $trace: function(method, args) {
      if(Vue.prototype.$trace) {
        Vue.prototype.$trace("lsw-app-lifecycle." + method, args);
      }
    },

    onStarted: function () {
      this.$trace("onStarted", []);
      return this.hooks.emit("app:started");
    },

    onInitialize: function () {
      this.$trace("onInitialize", []);
      return this.hooks.emit("app:initialize");
    },

    onInitialized: function () {
      this.$trace("onInitialized", []);
      return this.hooks.emit("app:initialized");
    },

    onBoot: function () {
      this.$trace("onBoot", []);
      return this.hooks.emit("app:boot");
    },

    onBooted: function () {
      this.$trace("onBooted", []);
      return this.hooks.emit("app:booted");
    },

    onLoadModules: function () {
      this.$trace("onLoadModules", []);
      if (!Vue.options.components.App) {
        throw new Error("Required Vue.js (v2) component «App» to be defined on «LswLifecycle.onRunApplication» for hook «app:run_application»");
      }
      return this.hooks.emit("app:load_modules");
    },

    onModulesLoaded: function () {
      this.$trace("onModulesLoaded", []);
      return this.hooks.emit("app:modules_loaded");
    },
    onInstallModules: function () {
      this.$trace("onInstallModules", []);
      return this.hooks.emit("app:install_modules");
    },
    onModulesInstalled: function () {
      this.$trace("onModulesInstalled", []);
      return this.hooks.emit("app:modules_installed");
    },
    onLoadSchema: async function () {
      this.$trace("onLoadSchema", []);
      let hasNeededTables = false;
      Check_if_has_needed_tables: {
        try {
          const currentSchema = await LswDatabase.getSchema("lsw_default_database");
          const neededTables = [
            "Accion",
            "Automensaje",
            "Categoria_de_concepto",
            "Concepto",
            "Impresion_de_concepto",
            "Limitador",
            "Nota",
            "Propagador_de_concepto",
            "Propagador_prototipo",
            "Lista",
            "Recordatorio",
          ];
          Iterating_needed_tables: {
            const currentTables = Object.keys(currentSchema);
            for(let index=0; index<neededTables.length; index++) {
              const neededTable = neededTables[index];
              const containsTable = currentTables.indexOf(neededTable) !== -1;
              if(!containsTable) {
                hasNeededTables = false;
                break Iterating_needed_tables;
              }
            }
            Confirm_it_contains_tables: {
              hasNeededTables = true;
            }
          }
        } catch (error) {
          // @OK
          console.log("Error:", error);
        }
      }
      if (!hasNeededTables) {
        await LswDatabase.deleteDatabase("lsw_default_database");
      }
      $lswSchema.loadSchemaByProxies("SchemaEntity");
      const databaseSchema = await $lswSchema.getDatabaseSchemaForLsw();
      console.log("[*] Creating database from schema by proxies:", "\n - " + Object.keys(databaseSchema).join("\n - "));
      await LswDatabase.createDatabase("lsw_default_database", databaseSchema);
      return await this.hooks.emit("app:load_schema");
    },
    onSchemaLoaded: function () {
      this.$trace("onSchemaLoaded", []);
      return this.hooks.emit("app:schema_loaded");
    },
    onSeedDatabase: async function () {
      this.$trace("onSeedDatabase", []);
      Fill_with_your_own_requirements: {
        // @TOFILLIFNEEDED:
      }
      return await this.hooks.emit("app:seed_database");
    },
    onDatabaseSeeded: async function () {
      this.$trace("onDatabaseSeeded", []);
      Fill_with_your_own_requirements: {
        // @TOFILLIFNEEDED:
      }
      return await this.hooks.emit("app:database_seeded");
    },
    onLoadDatabase: async function () {
      this.$trace("onLoadDatabase", []);
      Load_database_connection: {
        Vue.prototype.$lsw.database = await LswDatabase.open("lsw_default_database");
        Vue.prototype.$lsw.database.setInnerSchema($lswSchema);
      }
      let hasNeededRows = false;
      if(!hasNeededRows) {
        await this.onSeedDatabase();
        await this.onDatabaseSeeded();
      }
      return await this.hooks.emit("app:load_database");
    },
    onDatabaseLoaded: function () {
      this.$trace("onDatabaseLoaded", []);
      return this.hooks.emit("app:database_loaded");
    },
    onLoadComponents: async function () {
      this.$trace("onLoadComponents", []);
      Load_components: {
        const allComponents = await Vue.prototype.$lsw.fs.read_directory("/kernel/components");
        const errores = [];
        for(let componentId in allComponents) {
          try {
            await Vue.prototype.$lsw.fs.import_as_component(`/kernel/components/${componentId}/${componentId}`);
          } catch (error) {
            errores.push(error);
          }
        }
        if(errores.length) {
          console.log("[!] Errores en onLoadComponents:");
          console.log(errores);
        }
      }
      return this.hooks.emit("app:load_components");
    },
    onComponentsLoaded: function () {
      this.$trace("onComponentsLoaded", []);
      return this.hooks.emit("app:components_loaded");
    },
    onLoadCordovaSupport: async function() {
      this.$trace("onLoadCordovaSupport", []);
      Try_to_download_cordova: {
        await importer.scriptSrc("cordova.js").then(() => {
          console.log("[*] Cordova support loaded");
          this.hooks.register("app:application_mounted", "cordova_loaded:org.allnulled.lsw.mobile", function() {
            try {
              Vue.prototype.$lsw.toasts.send({
                title: "Cordova was enabled",
                text: "You can access Cordova APIs"
              });
            } catch (error) {
              console.error(error);
            }
          });
          return true;
        }).catch(error => {
          console.error(error);
          console.log("[!] Support for Cordova was dismissed");
          this.hooks.register("app:application_mounted", "cordova_loaded:org.allnulled.lsw.mobile", function() {
            try {
              Vue.prototype.$lsw.toasts.send({
                title: "Cordova was not enabled",
                text: "Cordova APIs are not accessible"
              });
            } catch (error) {
              console.error(error);
            }
          });
          return false;
        });
      }
      return await this.hooks.emit("app:load_cordova_support");
    },
    onCordovaSupportLoaded: async function() {
      this.$trace("onCordovaSupportLoaded", []);
      return await this.hooks.emit("app:cordova_support_loaded");
    },
    onLoadApplication: function () {
      this.$trace("onLoadApplication", []);
      return this.hooks.emit("app:load_application");
    },
    onApplicationLoaded: function () {
      this.$trace("onApplicationLoaded", []);
      return this.hooks.emit("app:application_loaded");
    },
    onAllLoaded: function () {
      this.$trace("onAllLoaded", []);
      return this.hooks.emit("app:all_loaded");
    },
    onRunApplication: function() {
      this.$trace("onRunApplication", []);
      if(!Vue.options.components.App) {
        throw new Error("Required Vue.js (v2) component «App» to be defined on «LswLifecycle.onRunApplication» for hook «app:run_application»");
      }
      const vueInstance = new Vue({
        render: h => h(Vue.options.components.App),
      }).$mount("#app");
      return this.hooks.emit("app:run_application");
    },
    onApplicationDeployed: function () {
      this.$trace("onApplicationDeployed", []);
      return this.hooks.emit("app:application_deployed");
    },
    onFinished: function () {
      this.$trace("onFinished", []);
      return this.hooks.emit("app:finished");
    },

    loadModule: function (moduleId) {
      this.$trace("loadModule", []);
      return Vue.prototype.$lsw.importer.scriptAsync(`modules/${moduleId}/load.js`);
    },

    loadSubmodule: function (moduleId, subpath) {
      this.$trace("loadSubmodule", []);
      return Vue.prototype.$lsw.importer.scriptAsync(`modules/${moduleId}/${subpath}`);
    },

    onApplicationMounted: function() {
      this.$trace("onApplicationMounted", []);
      return this.hooks.emit("app:application_mounted");
    },

    start: function () { 
      this.$trace("start", []);
      return this.run(this.steps);
    },

  }, "*");

  return cycle;
  
  // @code.end: LswLifecycle class

});