LswLifecycle.hooks.register("app:application_deployed", "startJobs:org.allnulled.lsw-conductometria", async function () {
  Setup_intruder_jobs: {
    // RUTINER A LOS 2:20-3 MINUTOS DE ENTRAR, MENSAJE:
    let duracionDeIntervalos = undefined;
    try {
      const durationstring = await LswDomIrruptor.getRutinerTimeout();
      duracionDeIntervalos = LswTimer.utils.fromDurationstringToMilliseconds(durationstring);
    } catch (error) {
      Vue.prototype.$lsw.toasts.showError(error);
      duracionDeIntervalos = LswTimer.utils.fromDurationstringToMilliseconds("2min");
    }
    Vue.prototype.$lsw.intruder.addJob({
      id: "Job para memorizar Rutiner",
      timeout: duracionDeIntervalos,
      dialog: {
        id: "rutiner-basico",
        title: "¿Recuerdas el Rutiner?",
        template: `
          <div class="position_relative">
            <div class="position_absolute" style="top: 8px; right: 8px;">
              <div class="flex_row">
                <div class="flex_100 centered"></div>
                <div class="flex_1 pad_left_1">
                  <button class="supermini" v-on:click="editRutinasTimeout">🕓↗️</button>
                </div>
                <div class="flex_1 pad_left_1">
                  <button class="supermini" v-on:click="editRutinas">📃↗️</button>
                </div>
              </div>
            </div>
            <div class="pad_1">
              <div class="" v-if="rutinerText">
                <div class="rutiner_box pad_2" v-html="rutinerText"></div>
              </div>
            </div>
            <div class="text_align_right pad_right_1">
              <button v-on:click="accept" class="margin_left_1">Aceptar</button>
            </div>
          </div>
        `,
        factory() {
          return {
            data() {
              return {
                rutinerText: false,
              }
            },
            methods: {
              async loadRutinas() {
                const markdownText = await this.$lsw.fs.read_file("/kernel/settings/rutiner.md");
                this.rutinerText = LswMarkdown.global.parse(markdownText);
              },
              editRutinas() {
                this.$lsw.dialogs.open({
                  title: "Editar rutiner.md",
                  template: `
                    <lsw-filesystem-explorer opened-by="/kernel/settings/rutiner.md" :absolute-layout="true" />
                  `
                });
              },
              editRutinasTimeout() {
                LswDomIrruptor.configurarRutinerTimeout();
              }
            },
            mounted() {
              this.loadRutinas();
            }
          }
        }
      }
    });
  }
  Setup_custom_background_images: {
    
  }
});