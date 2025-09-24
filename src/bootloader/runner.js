(function() {

  const runner = async output => {
  
    console.log("[*] App lifecycle ended.");
  
    Logger_activation: {
      if(window.location.href.startsWith("https://")) {
        Vue.prototype.$lsw.logger.deactivate();
      } else {
        Vue.prototype.$lsw.logger.activate();
        Vue.prototype.$lsw.logger.deactivate();
      }
    }
  
    Work_relocation: {
      try {
        Inject_kernel_bootjs: {
          // await Vue.prototype.$lsw.fs.evaluateAsJavascriptFile("/kernel/boot.js");
        }
        Inject_kernel_android_bootjs: {
          if(typeof cordova === "undefined") {
            break Inject_kernel_android_bootjs;
          }
        }
        Start_most_concurred_toolkits: {
          
        }
        Inject_development_point: {
          // await LswDomIrruptor.abrirHomepage();
          if(window.location.href.startsWith("http://")) {
            // return;
            // @DONE: en desarrollo:
            // await LswDomIrruptor.abrirBinarios();
            // await LswDomIrruptor.abrirTareasPosterioresDeNavegacionRapida();
            // await LswDomIrruptor.abrirRecords();
            // await LswDomIrruptor.abrirAcciones();
            // await LswDomIrruptor.abrirFicheros();
            // await LswDomIrruptor.abrirJsInspector();
            // await LswDomIrruptor.abrirHomepage();
            // await LswDomIrruptor.abrirConfiguraciones();
            // await LswDomIrruptor.abrirBaseDeDatos();
            // await LswDomIrruptor.abrirBaseDeDatosPorTabla("Accion");
            // await LswDomIrruptor.abrirBaseDeDatosPorNuevoDatoDeTabla("Accion");
            // await LswDomIrruptor.abrirWeekPlanner();
            // await LswDomIrruptor.arrancarTestsDeAplicacion();
            // await LswDomIrruptor.abrirNuevaFeature();
          }
        }
      } catch (error) {
        Vue.prototype.$lsw.toasts.send({
          title: "Errores en el boot",
          text: "El boot lanzó un error: (" + error.name + ") " + error.message,
        });
      }
      return;
    }
  
  };

  LswLifecycle.start().then(runner).catch(console.error);

})();