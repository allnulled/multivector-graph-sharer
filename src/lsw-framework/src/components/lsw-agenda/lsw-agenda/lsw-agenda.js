// @code.start: LswAgenda API | @$section: Vue.js (v2) Components » LswAgenda API » LswAgenda API » LswAgenda component
Vue.component("LswAgenda", {
  name: "LswAgenda",
  template: $template,
  props: {
    context: {
      type: String,
      default: "agenda"
    }
  },
  data() {
    this.$trace("lsw-agenda.data");
    let allAgendaButtons = [];
    if (typeof this.$window.cordova !== "undefined") {
      allAgendaButtons = allAgendaButtons.concat([{
        text: '🔔',
        event: () => this.synchronizeAlarms(),
      }, {
        text: '🔕',
        event: () => this.unsynchronizeAlarms(),
      }]);
    }
    return {
      counter: 0,
      isLoading: false,
      hasPsicodelia: true,
      selectedHiddenMenu: "none",
      selectedContext: "agenda",
      selectedAction: 'calendario',
      selectedDate: undefined,
      selectedDateTasks: undefined,
      selectedDateTasksSorted: undefined,
      selectedDateTasksFormattedPerHour: undefined,
      selectedForm: undefined,
      hiddenDateHours: [],
      shownAcciones: [],
      agendaButtons: allAgendaButtons,
      possibleNotifiers: [
        accion => `🔷 ¡Vamos con «${accion.en_concepto}» por «${accion.tiene_duracion}»!`,
        accion => `🔶 Parece que se te requiere en «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🕥 Ahora tocaría «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🔶 ¿Qué tal un poco de «${accion.en_concepto}» por «${accion.tiene_duracion}»?`,
        accion => `🕥 ¿Sabes que tendrías ahora que «${accion.en_concepto}» por «${accion.tiene_duracion}»?`,
        accion => `🔶 ¿Te acuerdas que ahora viene «${accion.en_concepto}» por «${accion.tiene_duracion}»?`,
        accion => `🕥 ¿Cómo lo llevas? Porque se viene «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🔶 ¿Te apetece un poco de «${accion.en_concepto}» por «${accion.tiene_duracion}»?`,
        accion => `🕥 Bueno, y ahora «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🔶 ¿Estás bien? Porque vamos con «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🕥 ¿Y ahora? Ahora «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🔶 Tendríamos que «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🕥 Sin ponerse grave, habría que «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🔶 No sé si tienes algo, aparte de «${accion.en_concepto}» ahora por «${accion.tiene_duracion}»`,
        accion => `🕥 Por «${accion.tiene_duracion}» tocaría «${accion.en_concepto}»`,
        accion => `🔶 Durante «${accion.tiene_duracion}» vendría «${accion.en_concepto}»`,
        accion => `🔷 Sin más dilación, «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🔷 ¡Vamos ahí ese «${accion.en_concepto}» por «${accion.tiene_duracion}»!`,
        accion => `🕥 Estaríamos con «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🔷 Tiempo para «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
        accion => `🔷 ¡Atensiong! Viene «${accion.en_concepto}» por «${accion.tiene_duracion}»`,
      ]
    };
  },
  methods: {
    toggleShowAccion(accionId) {
      this.$trace("lsw-agenda.methods.toggleShowAccion");
      const pos = this.shownAcciones.indexOf(accionId);
      if (pos === -1) {
        this.shownAcciones.push(accionId);
      } else {
        this.shownAcciones.splice(pos, 1);
      }
    },
    selectHiddenMenu(menuId) {
      this.$trace("lsw-agenda.methods.selectHiddenMenu");
      this.selectedHiddenMenu = menuId;
    },
    selectAction(accionId, contextId = false) {
      this.$trace("lsw-agenda.methods.selectAction");
      if (contextId) {
        this.selectContext(contextId);
      }
      this.selectedAction = accionId;
    },
    selectContext(id, parameters = {}) {
      this.$trace("lsw-agenda.methods.selectContext");
      this.selectedHiddenMenu = "none";
      this.selectedContextParameters = parameters;
      this.selectedContext = id;
    },
    toggleCalendario() {
      this.$trace("lsw-agenda.methods.toggleCalendario");
      const finalState = (this.selectedAction === "calendario") ? "none" : "calendario";
      if (this.selectedContext !== "agenda") {
        this.selectContext("agenda");
        this.selectAction("calendario");
        return;
      }
      this.selectAction(finalState);
    },
    selectCalendario() {
      this.$trace("lsw-agenda.methods.selectCalendario");
      this.selectContext("agenda");
      this.selectAction("calendario");
    },
    selectConductometria() {
      this.$trace("lsw-agenda.methods.selectCondutometria");
      this.selectContext("conductometria");
      // this.selectAction("calendario");
    },
    togglePsicodelia() {
      this.$trace("lsw-agenda.methods.togglePsicodelia");
      this.hasPsicodelia = !this.hasPsicodelia;
    },
    toggleHour(hourInt) {
      this.$trace("lsw-agenda.methods.toggleHour");
      const pos = this.hiddenDateHours.indexOf(hourInt);
      if (pos === -1) {
        this.hiddenDateHours.push(hourInt);
      } else {
        this.hiddenDateHours.splice(pos, 1);
      }
    },
    reloadDateTasks() {
      this.$trace("lsw-agenda.methods.reloadDateTasks");
      return this.loadDateTasks(this.selectedDate);
    },
    async loadDateTasks(dateInput, calendario, isOnMounted = false) {
      this.$trace("lsw-agenda.methods.loadDateTasks");
      // this.isLoading = true;
      const newDate = dateInput || this.selectedDate || new Date();
      console.log("[*] Loading date tasks of: " + LswTimer.utils.fromDateToDatestring(newDate));
      try {
        this.selectedDate = newDate;
        const selectedDate = this.selectedDate;
        const selectedDateTasks = await this.$lsw.database.selectMany("Accion", valueBrute => {
          try {
            const valueList = LswTimer.parser.parse(valueBrute.tiene_inicio);
            const value = valueList[0];
            const isSameYear = value.anio === selectedDate.getFullYear();
            const isSameMonth = value.mes === (selectedDate.getMonth() + 1);
            const isSameDay = value.dia === selectedDate.getDate();
            const isAccepted = isSameYear && isSameMonth && isSameDay;
            return isAccepted;
          } catch (error) {
            return true;
          }
        });
        this.selectedDateTasks = selectedDateTasks;
        this.selectedDateTasksSorted = selectedDateTasks.sort((accion1, accion2) => {
          let inicio1 = undefined;
          let inicio2 = undefined;
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
          if (inicio1 < inicio2) {
            return -1;
          } else if (inicio1 > inicio2) {
            return 1;
          } else {
            return -1;
          }
        });
        if (isOnMounted) {
          const noTasksFound = (!this.selectedDateTasks) || (!this.selectedDateTasks.length);
          if (noTasksFound) {
            this.isCalendarioSelected = true;
          }
        }
        this.propagateDateTasks();
      } catch (error) {
        console.log("Error loading date taskes:", error);
      } finally {
        setTimeout(() => { this.isLoading = false }, 100);
      }
      await this.reloadCalendarioMarks(calendario);
      this.refreshTasks();
    },
    async reloadCalendarioMarks(calendario) {
      if (calendario) {
        const selectedDate = this.selectedDate;
        const tasksOfMonth = await this.$lsw.database.selectMany("Accion", valueBrute => {
          const valueList = LswTimer.parser.parse(valueBrute.tiene_inicio);
          const value = valueList[0];
          const isSameYear = value.anio === selectedDate.getFullYear();
          const isSameMonth = value.mes === (selectedDate.getMonth() + 1);
          const isAccepted = isSameYear && isSameMonth;
          return isAccepted;
        });
        const tasksOfMonthByDay = tasksOfMonth.reduce((out, item) => {
          const valueList = LswTimer.parser.parse(item.tiene_inicio);
          const value = valueList[0];
          const day = value.dia;
          if (!(day in out)) {
            out[day] = [];
          }
          out[day].push(item);
          return out;
        }, {});
        calendario.establecer_marcadores_del_mes(tasksOfMonthByDay);
      }
    },
    groupTasksByHour(tareas = this.selectedDateTasks) {
      this.$trace("lsw-agenda.methods.groupTasksByHour");
      const mapaHoras = {};
      Agrupacion_inicial:
      for (let i = 0; i < tareas.length; i++) {
        const tarea = tareas[i];
        const { tiene_inicio } = tarea;
        const [inicioObject] = LswTimer.parser.parse(tiene_inicio);
        const { hora, minuto } = inicioObject;
        if (typeof hora !== "number") {
          continue Agrupacion_inicial;
        }
        if (!(hora in mapaHoras)) {
          mapaHoras[hora] = [];
        }
        mapaHoras[hora].push(tarea);
      }
      //return mapaHoras;
      const segunHoras = [];
      Formateo_final:
      for (let hora in mapaHoras) {
        const lista = mapaHoras[hora];
        segunHoras.push({
          hora,
          tareas: lista,
        });
      }
      return segunHoras;
    },
    propagateDateTasks() {
      this.$trace("lsw-agenda.methods.propagateDateTasks");
      this.selectedDateTasksFormattedPerHour = this.groupTasksByHour();
    },
    async openInsertTaskDialog() {
      this.$trace("lsw-agenda.methods.openInsertTaskDialog");
      // *@TODO: 
    },
    async openDeleteTaskDialog(tarea, e) {
      this.$trace("lsw-agenda.methods.openDeleteTaskDialog");
      const confirmed = await Vue.prototype.$dialogs.open({
        title: "Eliminar registro",
        template: `
          <div>
            <div class="pad_2">¿Seguro que quieres eliminar el registro?</div>
            <hr class="margin_0" />
            <div class="pad_2 text_align_right">
              <button class="supermini danger_button" v-on:click="() => accept(true)">Eliminar</button>
              <button class="supermini " v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        `,
      });
      if (!confirmed) return false;
      await this.$lsw.database.delete("Accion", tarea.id);
      this.selectedForm = undefined;
      this.refreshTasks();
    },
    selectHour(hora) {
      this.$trace("lsw-agenda.methods.selectHour");
      if (this.selectedForm === hora) {
        this.selectedForm = undefined;
      } else {
        this.selectedForm = hora;
      }
    },
    async refreshTasks() {
      this.$trace("lsw-agenda.methods.refreshTasks");
      if (this.$refs.calendario) {
        this.$refs.calendario.changeDate(new Date(this.selectedDate));
      }
    },
    async synchronizeAlarms() {
      this.$trace("lsw-agenda.methods.synchronizeAlarms");
      Cordova_injection: {
        if (typeof this.$window.cordova !== "undefined") {
          // LswUtils.debug(1);
          const dateToday = new Date();
          // LswUtils.debug(2);
          const allAlarms = await this.$lsw.database.selectMany("Accion", accion => {
            const dateAccion = LswTimer.utils.fromDatestringToDate(accion.tiene_inicio);
            return LswTimer.utils.areSameDayDates(dateToday, dateAccion);
          });
          // LswUtils.debug(3);
          const soundFile = LswRandomizer.getRandomItem([
            "file://assets/sounds/alarm.busca.wav",
            "file://assets/sounds/alarm.clock-light.wav",
            "file://assets/sounds/alarm.facility-breach.wav",
            "file://assets/sounds/alarm.heavy.wav",
            "file://assets/sounds/alarm.submarine.wav",
          ]);
          // LswUtils.debug(4);
          try {
            // LswUtils.debug(5);
            // LswUtils.debug(allAlarms);
            for (let index = 0; index < allAlarms.length; index++) {
              // LswUtils.debug(6 + ":" + index);
              const accion = allAlarms[index];
              // LswUtils.debug(7 + ":" + index);
              const id = index + 1;
              const notificationCallback = LswRandomizer.getRandomItem(this.possibleNotifiers);
              // LswUtils.debug(8 + ":" + index);
              const text = notificationCallback(accion);
              // LswUtils.debug(9 + ":" + index);
              await this.$window.cordova.plugins.notification.local.cancel(id);
              // LswUtils.debug(10 + ":" + index);
              await this.$window.cordova.plugins.notification.local.schedule({
                id,
                title: `${accion.en_concepto} * ${accion.tiene_inicio} @${accion.tiene_inicio}`,
                text: text,
                trigger: {
                  at: LswTimer.utils.fromDatestringToDate(accion.tiene_inicio)
                },
                vibrate: [1000, 1000, 1000, 1000],
                wakeUp: true,
                lockscreen: true,
                sound: soundFile
              });
              // LswUtils.debug(11 + ":" + index);
            }
            this.$lsw.toasts.send({
              title: "Alarmas sincronizadas",
              text: `Unas ${allAlarms.length} alarmas fueron sincronizadas con el dispositivo`
            });
          } catch (error) {
            // LswUtils.debug(100);
            this.$lsw.toasts.showError(error);
          }
        }
      }
    },
    unsynchronizeAlarms() {
      this.$trace("lsw-agenda.methods.unsynchronizeAlarms");
      Cordova_injection: {
        if (typeof this.$window.cordova !== "undefined") {
          try {
            this.$window.cordova.plugins.notification.local.cancelAll(() => {
              this.$lsw.toasts.send({
                title: "Alarmas desincronizadas",
                text: "Las alarmas se eliminaron del dispositivo"
              });
            })
          } catch (error) {
            this.$lsw.toasts.showError(error);
          }
        }
      }
    },
  },
  watch: {
  },
  computed: {
    isCalendarioSelected() {
      return this.selectedAction === "calendario";
    }
  },
  async mounted() {
    try {
      this.$trace("lsw-agenda.mounted");
      const selectedDate = this.$refs.calendario.getValue();
      await this.loadDateTasks(selectedDate, undefined, true);
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswAgenda API
