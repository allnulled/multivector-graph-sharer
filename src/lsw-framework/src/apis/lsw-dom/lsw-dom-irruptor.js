(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswDomIrruptor'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswDomIrruptor'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswDomIrruptor class | @section: Lsw Dom Irruptor API » LswDomIrruptor class
  const LswDomIrruptor = class {

    static async aniadirNota() {
      LswDom.querySelectorFirst(".home_bottom_panel > button", "+ 💬").click();
    }
    static async verNotas() {
      LswDom.querySelectorFirst(".home_mobile_bottom_panel > .mobile_bottom_panel_cell", "💬").click();
    }
    static async abrirHomepage() {
      LswDom.querySelectorFirst(".main_topbar_button", "📟️").click();
    }
    static async calendario() {
      LswDom.querySelectorFirst(".home_mobile_bottom_panel > .mobile_bottom_panel_cell", "📅").click();
    }
    static async abrirCalendario() {
      LswDom.querySelectorFirst(".main_topbar_button", "📆").click();
    }
    static async reportesDeCalendario() {
      LswDom.querySelectorFirst(".home_mobile_bottom_panel > .mobile_bottom_panel_cell", "📅").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("button.nowrap", "📊").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("button", "🔮 Iniciar conductometría").click();
      
    }
    static async abrirNavegacionRapida() {
      LswDom.querySelectorFirst(".main_topbar_button", "📟").click();
    }
    static async abrirBinarios() {
      LswDom.querySelectorFirst(".main_topbar_button", "📟").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst(".lista_apps div", "💣 Binarios").click();
    }
    static async abrirBaseDeDatos() {
      LswDom.querySelectorFirst(".main_topbar_button", "📟").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("div", "📦 Base de datos").click();
    }
    static async abrirBaseDeDatosPorTabla(tabla) {
      LswDom.querySelectorFirst(".main_topbar_button", "📟").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("div", "📦 Base de datos").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("span.table_name", tabla).click();
    }
    static async abrirBaseDeDatosPorNuevoDatoDeTabla(tabla) {
      this.abrirBaseDeDatosPorTabla(tabla);
      await LswDom.waitForMilliseconds(500);
      LswDom.querySelectorFirst("button", "➕").click();
    }
    static async abrirAccionesVirtuales() {
      await this.abrirBaseDeDatos();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("button", "Accion_virtual").click();
    }
    static async abrirTareasPosterioresDeNavegacionRapida() {
      LswDom.querySelectorFirst(".lista_apps button", "🕓 Tareas posteriores").click();
    }
    static async abrirRecords() {
      this.abrirTareasPosterioresDeNavegacionRapida();
      await LswDom.waitForMilliseconds(500);
      LswDom.querySelectorFirst("button", "📷📊").click();
    }
    static async configuraciones() {
      LswDom.querySelectorFirst("#windows_pivot_button", "🔵").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("button.main_tab_topbar_button", "🔧").click();
    }
    static async abrirConfiguraciones() {
      LswDom.querySelectorFirst("#windows_pivot_button", "🔵").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("button.main_tab_topbar_button", "🔧").click();
    }
    static async abrirFicheros() {
      LswDom.querySelectorFirst("#windows_pivot_button", "🔵").click();
      await LswDom.waitForMilliseconds(200);
      LswDom.querySelectorFirst("button.main_tab_topbar_button", "📂").click();
    }
    static async abrirWiki() {
      LswDom.querySelectorFirst(".mobile_bottom_panel_cell", "🔬").click();
    }
    static async abrirWikiArticulos() {
      await this.abrirWiki();
      await LswDom.waitForMilliseconds();
      Abrir_articulos: {
        await LswDom.waitForMilliseconds(200);
        LswDom.querySelectorFirst(".lsw_wiki button.supermini", "🔬").click();
        return;
      }
    }
    static async abrirWikiLibros() {
      await this.abrirWiki();
      await LswDom.waitForMilliseconds();
      Abrir_libros: {
        await LswDom.waitForMilliseconds(200);
        LswDom.querySelectorFirst(".lsw_wiki button.supermini", "📚").click();
      }
    }
    static async abrirWeekPlanner() {
      await this.abrirCalendario();
      Abrir_planificador: {
        await LswDom.waitForMilliseconds(1000);
        LswDom.querySelectorFirst("button", "7️⃣").click();
      }
    }
    static async abrirAcciones() {
      await this.abrirBaseDeDatos();
      Abrir_planificador: {
        await LswDom.waitForMilliseconds(1000);
        LswDom.querySelectorFirst("button", "7️⃣").click();
      }
    }
    
    static async abrirNuevaFeature() {
      await this.abrirHomepage();
      Abrir_planificador: {
        await LswDom.waitForMilliseconds(1000);
        LswDom.querySelectorFirst("div", "✨ Nueva feature").click();
      }
    }

    static async abrirJsInspector() {
      await this.abrirHomepage();
      Abrir_inspector: {
        await LswDom.waitForMilliseconds(1000);
        LswDom.querySelectorFirst("div", "🪲 Inspector de JS").click();
      }
    }

    static async abrirTestsDeAplicacion() {
      await this.abrirHomepage();
      Abrir_tests: {
        await LswDom.waitForMilliseconds(200);
        LswDom.querySelectorFirst("div", "✅ Tests de aplicación").click();
      }
    }

    static async arrancarTestsDeAplicacion() {
      await this.abrirTestsDeAplicacion();
      Abrir_tests: {
        await LswDomIrruptor.abrirTestsDeAplicacion();
        await LswUtils.waitForMilliseconds(1000);
        await LswDom.querySelectorFirst("button", "🧪 ↗️").click();
        await LswUtils.waitForMilliseconds(1000);
        await LswDom.querySelectorFirst("button", "▶️ Iniciar tests").click();
      }
    }

    static async getRutinerTimeout() {
      const rutinerConfig = await Vue.prototype.$lsw.fs.evaluateAsDotenvFileOrReturn("/kernel/settings/rutiner.config.env", []);
      LswTimer.utils.fromDurationstringToMilliseconds(rutinerConfig.timeout);
      return rutinerConfig.timeout;
    }

    static async setRutinerTimeout(durationstring) {
      LswTimer.utils.fromDurationstringToMilliseconds(durationstring);
      await Vue.prototype.$lsw.fs.write_file("/kernel/settings/rutiner.config.env", "timeout=" + durationstring);
    }

    static async configurarRutinerTimeout() {
      const currentTimeout = await LswDomIrruptor.getRutinerTimeout();
      const duracion = await Vue.prototype.$lsw.dialogs.open({
        title: "Configurar frecuencia de mensaje rutinario",
        template: `
          <div class="pad_1" v-xform.form="{ onSubmit }" ref="formulario">
            <div class="pad_bottom_1">Especifica la duración preferida:</div>
            <lsw-duration-control :settings="{name:'duracion',initialValue}" />
            <hr/>
            <div class="flex_row centered pad_1">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="submitForm">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            initialValue: currentTimeout,
          },
          methods: {
            onSubmit(formdata) {
              return this.accept(formdata.duracion);
            },
            async submitForm() {
              this.$trace("Dialogs.configurar-frecuencia-rutiner.methods.submitForm");
              return await this.$refs.formulario.$xform.submit();
            }
          },
        }
      });
      if(duracion === -1) {
        return;
      }
      if(typeof duracion !== "string") {
        console.log("duracion", duracion);
      }
      const milliseconds = LswTimer.utils.fromDurationstringToMilliseconds(duracion);
      return await LswDomIrruptor.setRutinerTimeout(duracion);
    }

  }

  return LswDomIrruptor;
  // @code.end: LswDomIrruptor class

});