// @code.start: LswEventTracker API | @$section: Vue.js (v2) Components » LswEventTracker component
Vue.component("LswEventTracker", {
  template: $template,
  props: {
    
  },
  data() {
    this.$trace("lsw-event-tracker.data");
    return {
      isLoaded: false,
      isSearching: true,
      allTrackables: [],
      trackables: false,
      searchText: "",
      digestTimeout: 1000,
      digestTimeoutId: undefined,
    };
  },
  methods: {
    async loadTrackables() {
      this.$trace("lsw-event-tracker.methods.loadTrackables");
      this.isLoaded = false;
      try {
        let trackableIds = undefined;
        Get_trackables: {
          trackableIds = await this.$lsw.fs.evaluateAsDotenvListFileOrReturn("/kernel/settings/trackables.env", []);
        }
        let trackedData = {};
        Count_trackables: {
          const accionesTrackeadas = await this.$lsw.database.selectMany("Accion", it => {
            return trackableIds.indexOf(it.en_concepto) !== -1;
          });
          for(let indexTrackables=0; indexTrackables<trackableIds.length; indexTrackables++) {
            const trackableId = trackableIds[indexTrackables];
            trackedData[trackableId] = [];
            for(let indexTrackeadas=0; indexTrackeadas<accionesTrackeadas.length; indexTrackeadas++) {
              const accion = accionesTrackeadas[indexTrackeadas];
              if(accion.en_concepto === trackableId) {
                trackedData[trackableId].push(accion);
              }
            }
          }
        }
        this.allTrackables = trackedData;
        this.digestOutput();
      } catch (error) {
        this.$lsw.toasts.sendError(error);
      }
    },
    digestDelayed() {
      this.$trace("lsw-event-tracker.methods.digestDelayed");
      clearTimeout(this.digestTimeoutId);
      setTimeout(() => {
        this.digestOutput();
      }, this.digestTimeout);
    },
    digestOutput() {
      this.$trace("lsw-event-tracker.methods.digestOutput");
      clearTimeout(this.digestTimeoutId);
      this.isSearching = true;
      setTimeout(() => {
        if(this.searchText.trim() === "") {
          this.trackables = this.allTrackables;
        } else {
          this.trackables = LswUtils.filterObject(this.allTrackables, (key, val) => {
            return key.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1;
          });
        }
        this.isLoaded = true;
        this.isSearching = false;
      }, 0);
    },
    editTrackables() {
      this.$trace("lsw-event-tracker.methods.editTrackables");
      this.$lsw.dialogs.open({
        title: "Editar trackeables",
        template: `
          <lsw-filesystem-explorer
            opened-by="/kernel/settings/trackables.env"
            :absolute-layout="true"
          />
        `,
      });
    },
    async deleteTrackable(trackableId) {
      this.$trace("lsw-event-tracker.methods.deleteTrackable");
      const eventos = await this.$lsw.database.selectMany("Accion", it => {
        return (it.tiene_estado === "trackeada") && (it.en_concepto === trackableId);
      });
      const eventosOrdenados = eventos.sort((e1, e2) => {
        return e1.tiene_inicio > e2.tiene_inicio ? -1 : 1;
      });
      const evento = eventosOrdenados[0] || false;
      if(!evento) {
        return;
      }
      const respuesta = await this.$lsw.dialogs.open({
        title: "Eliminar último evento trackeada",
        template: `
          <div class="pad_1">
            <div>¿Seguro que quieres eliminar el evento trackeada?</div>
            <pre class="codeblock">{{ evento }}</pre>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini danger_button"
                  v-on:click="() => accept(true)">Eliminar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini"
                  v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: { data: { evento } }
      });
      if(respuesta !== true) {
        console.log(respuesta);
        return;
      }
      await this.$lsw.database.delete("Accion", evento.id);
      this.$lsw.toasts.send({
        title: "Evento eliminado correctamente",
        text: "El último evento asociado fue eliminado",
      });
      this.loadTrackables();
    },
    async addTrackableWithComment(trackableId) {
      this.$trace("lsw-event-tracker.methods.addTrackableWithComment");
      const comentario = await this.$lsw.dialogs.open({
        title: "Comentario adjunto a evento",
        template: `
          <div class="pad_1">
            <div class="pad_bottom_1">
              Comentario a adjuntar en el evento:
            </div>
            <div class="pad_bottom_1">
              <textarea class="width_100" v-model="value" spellcheck="false" />
            </div>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="accept">Añadir trackeo</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `
      });
      if(typeof comentario !== "string") return;
      await this.$lsw.database.insert("Accion", {
        en_concepto: trackableId,
        tiene_estado: "trackeada",
        tiene_inicio: LswTimer.utils.fromDateToDatestring(new Date()),
        tiene_duracion: "1min",
        tiene_parametros: "",
        tiene_resultados: "",
        tiene_comentarios: comentario,
      });
      this.$lsw.toasts.send({
        title: "Evento añadido correctamente",
        text: "Con comentario adjunto",
      });
      this.loadTrackables();
    },
    async addTrackable(trackableId) {
      this.$trace("lsw-event-tracker.methods.addTrackable");
      await this.$lsw.database.insert("Accion", {
        en_concepto: trackableId,
        tiene_estado: "trackeada",
        tiene_inicio: LswTimer.utils.fromDateToDatestring(new Date()),
        tiene_duracion: "1min",
        tiene_parametros: "",
        tiene_resultados: "",
        tiene_comentarios: "",
      });
      this.loadTrackables();
      this.$lsw.toasts.send({
        title: "Evento añadido correctamente",
        text: "Sin comentario adjunto",
      });
    },
    async insertTrackable() {
      this.$trace("lsw-event-tracker.methods.insertTrackable");
      const trackableId = this.searchText;
      if(trackableId.trim() === "") {
        return;
      }
      const trackableIds = await this.$lsw.fs.evaluateAsDotenvListFileOrReturn("/kernel/settings/trackables.env", []);
      const pos = trackableIds.indexOf(trackableId);
      if(pos !== -1) {
        this.$lsw.toasts.send({
          title: "Este trackable ya existe",
          text: "No se insertó porque ya existe.",
        });
      } else {
        const previousContent = await this.$lsw.fs.read_file("/kernel/settings/trackables.env");
        const lastContent = previousContent.trim() + "\n" + trackableId;
        await this.$lsw.fs.write_file("/kernel/settings/trackables.env", lastContent);
        this.$lsw.toasts.send({
          title: "Trackable insertado correctamente",
          text: "",
        });
        this.loadTrackables();
      }
    },
    clearSearchText() {
      this.$trace("lsw-event-tracker.watch.clearSearchText");
      this.searchText = "";
      this.digestOutput();
    }
  },
  watch: {
    searchText() {
      this.$trace("lsw-event-tracker.watch.searchText");
      this.digestDelayed();
    }
  },
  mounted() {
    this.$trace("lsw-event-tracker.mounted");
    this.loadTrackables();
  },
  unmounted() {
    this.$trace("lsw-event-tracker.unmounted");
    
  }
});
// @code.end: LswEventTracker API