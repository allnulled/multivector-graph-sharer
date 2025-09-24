// @code.start: LswGoalsViewer API | @$section: Vue.js (v2) Components » LswGoalsViewer component
Vue.component("LswGoalsViewer", {
  template: $template,
  props: {
    onClose: {
      type: [Function, Boolean],
      default: false,
    },
    onRefresh: {
      type: [Function, Boolean],
      default: false,
    },
    dayToAnalize: {
      type: [Boolean, Date],
      default: () => new Date(),
    }
  },
  data() {
    this.$trace("lsw-goals-viewer.data");
    const solverSymbols = ['👍', '✔️', '😃']
    const penderSymbols = ['🌵', '❌', '🥶'];
    const randomIndex = LswRandomizer.getRandomIntegerBetween(0, penderSymbols.length-1);
    return {
      isLoaded: false,
      isLoadingGoals: false,
      isFiltering: "none",
      isClicking: false,
      specifiedGoals: {},
      interestingFields: {
        "colorMeaning": "Estado actual",
        "filled": "Completado",
        "missing": "Faltante",
        "solved": "Resuelto",
        // "originalConcept": "Concepto",
        // "originalCondition": "Condición",
        // "originalUrgency": "Urgencia",
        "type": "Tipo",
        "expectedAs": "Formato",
        "expectedDuration": "Duración esperada",
        // "expectedAsAbbr": "Formato abreviado",
        "currentDuration": "Duración actual",
        "missingDuration": "Duración faltante",
        "expectedTimes": "Veces esperadas",
        "currentTimes": "Veces actuales",
        "missingTimes": "Veces faltantes",
        // "currentDurationInms": "Duración en ms actual",
        // "expectedDurationInms": "Duración esperada en ms",
        // "filledAsint": "Llenado como número",
        // "missingDurationInms": "Duración faltante en ms",
        // "missingAsint": "Faltante como número",
        // "solvable": "Resolvible",
        // "color": "color",
        // "urgency": "Urgencia"
        "originalLine": "Origen",
      },
      symbolForSolved: solverSymbols[randomIndex],
      symbolForPending: penderSymbols[randomIndex],
      selectedGoal: false,
      report: [],
      summary: false,
    };
  },
  methods: {
    async selectGoal(goal) {
      this.$trace("lsw-goals-viewer.methods.selectGoal");
      if(this.selectedGoal === goal) {
        this.selectedGoal = undefined;
      } else {
        this.selectedGoal = goal;
      }
      await this.loadGoalSpecification(goal);
    },
    selectFilter(id) {
      this.$trace("lsw-goals-viewer.methods.selectFilter");
      this.isFiltering = id;
    },
    async loadGoalSpecification(goal) {
      this.$trace("lsw-goals-viewer.methods.loadGoalSpecification");
      try {
        this.isLoadingGoals = true;
        const filepath = "/kernel/goals/todos/" + goal.concept + ".md";
        const filecontent = await this.$lsw.fs.read_file(filepath);
        const parsedContent = LswMarkdown.global.parse(filecontent);
        this.specifiedGoals[goal.concept] = `<div class="markdown_texto">${parsedContent}</div>`;
        return parsedContent;
      } catch (error) {
        return false;
      } finally {
        this.isLoadingGoals = false;
      }
    },
    passesFilter(goal) {
      this.$trace("lsw-goals-viewer.methods.passesFilter");
      if(this.isFiltering === "none") {
        return true;
      } else if(this.isFiltering === "completed") {
        return goal.solved === true;
      } else {
        return goal.solved === false;
      }
    },
    async loadGoals() {
      this.$trace("lsw-goals-viewer.methods.loadGoals");
      this.isLoaded = false;
      this.report = await LswGoals.getGoalsReport(this.dayToAnalize);
      let resolved = 0;
      let failed = 0;

      for(let index=0; index<this.report.goals.length; index++) {
        const goal = this.report.goals[index];
        if(goal.solved) {
          resolved++;
        } else {
          failed++;
        }
      }
      this.summary = {
        total: this.report.goals.length,
        resolved,
        failed,
      };
      this.isLoaded = true;
    },
    openGoalsFile() {
      this.$trace("lsw-goals-viewer.methods.openGoalsFile");
      this.$dialogs.open({
        title: "Editar objetivos",
        template: `
          <div>
            <lsw-filesystem-explorer opened-by="/kernel/goals/goals.week" :absolute-layout="true" />
          </div>
        `
      });
    },
    openRecordsDirectory() {
      this.$trace("lsw-goals-viewer.methods.saveMoment");
      this.$dialogs.open({
        title: "Ver récords anteriores",
        template: `
          <div>
            <lsw-filesystem-explorer opened-by="/kernel/goals/records" :absolute-layout="true" />
          </div>
        `
      });
    },
    openRecordsViewer() {
      this.$trace("lsw-goals-viewer.methods.openRecordsViewer");
      this.$dialogs.open({
        title: "Visualizar récords",
        template: `
          <div class="pad_1">
            <lsw-goals-records-viewer />
          </div>
        `
      });
    },
    openWeekPlanner() {
      this.$trace("lsw-goals-viewer.methods.openWeekPlanner");
      this.$dialogs.open({
        title: "Planificador de semana",
        template: `
          <div class="pad_1">
            <lsw-week-planner />
          </div>
        `
      });
    },
    async saveMoment() {
      this.$trace("lsw-goals-viewer.methods.saveMoment");
      const dayUid = LswTimer.utils.fromDateToDatestring(new Date(), false, false, true).replace(/\/|\:/g, "-").replace(/ .*$/g, "");
      const filepath = "/kernel/goals/records/" + dayUid + ".json";
      const reportSnapshot = Object.assign({
        date: LswTimer.utils.fromDateToDatestring(this.dayToAnalize || new Date()),
      }, this.report, {});
      const filecontents = JSON.stringify(reportSnapshot, null, 2);
      await this.$lsw.fs.write_file(filepath, filecontents);
      this.$lsw.toasts.send({
        title: "Estadísticas del día guardadas",
        text: `En: ${filepath}`
      });
    },
    getAbbrvWord(id) {
      return id === "min" ? "🔺" : "🔻";
      return id === "min" ? "mínimo" : "máximo";
    },
    async editTodoOfGoal(goal) {
      this.$trace("lsw-goals-viewer.methods.editTodoOfGoal");
      const goalFilepath = `/kernel/goals/todos/${goal.concept}.md`;
      const exists = await this.$lsw.fs.exists(goalFilepath);
      if(!exists) {
        await this.$lsw.fs.write_file(goalFilepath, "");
      }
      this.$lsw.dialogs.open({
        title: "Detallando objetivo",
        template: `<lsw-filesystem-explorer :opened-by="goalFilepath" :absolute-layout="true" />`,
        factory: {
          data: { goal, goalFilepath },
          methods: { }
        }
      });
    },
    async importGoalsToDay() {
      this.$trace("lsw-goals-viewer.methods.importGoalsToDay");
      const originalGoals = await Vue.prototype.$lsw.fs.evaluateAsWeekFileOrReturn("/kernel/goals/goals.week", []);
      const dayString = LswTimer.utils.fromDateToDatestring(this.dayToAnalize, true);
      const weekdayString = LswGoals.fromDateToWeekday(this.dayToAnalize);
      const goalsMatched = originalGoals.filter(goal => {
        if(goal.type !== "SET") {
          return false;
        }
        Filtro_de_goal_segun_dia: {
          const {
            from: goalBegin,
            to: goalEnd,
            type: goalType,
            concept: goalConcept,
            duration: goalDuration,
            hour: goalHour,
            minute: goalMinute,
            weekday: goalWeekday,
          } = goal;
          // No excede el «desde fecha».
          if(goalBegin !== "*") {
            if(dayString < goalBegin) {
              return false;
            }
          }
          // No excede el «hasta fecha»
          if(goalEnd !== "*") {
            if(dayString > goalEnd) {
              return false;
            }
          }
          // Coincide con el «dia de la semana»
          if(goalWeekday !== "*") {
            if(weekdayString !== goalWeekday) {
              return false;
            }
          }
        }
        return true;
      });
      const goalsMissing = [];
      const accionesDia = await this.$lsw.database.select("Accion", acc => acc.tiene_inicio.startsWith(dayString));
      Iterating_objetivos:
      for(let indexGoal=0; indexGoal<goalsMatched.length; indexGoal++) {
        const goalMatched = goalsMatched[indexGoal];
        const {
          from: goalBegin,
          to: goalEnd,
          type: goalType,
          concept: goalConcept,
          duration: goalDuration,
          hour: goalHour,
          minute: goalMinute,
          weekday: goalWeekday,
        } = goalMatched;
        const presuntoInicio = dayString + " " + goalMatched.hour + ":" + goalMatched.minute;
        let missingAccion = {
          ast: goalMatched,
          acc: {
            en_concepto: goalConcept,
            tiene_estado: "pendiente",
            tiene_inicio: presuntoInicio,
            tiene_duracion: goalDuration || "1h",
            tiene_parametros: "[*semanal]",
            tiene_descripcion: "",
            tiene_comentarios: "",
          }
        };
        Iterating_acciones:
        for(let indexAcc=0; indexAcc<accionesDia.length; indexAcc++) {
          const accionDia = accionesDia[indexAcc];
          const matchesParameter = accionDia.tiene_parametros.indexOf("[*semanal]") !== -1;
          const matchesTime = accionDia.tiene_inicio.startsWith(presuntoInicio);
          const matchesConcept = accionDia.tiene_inicio.startsWith(presuntoInicio);
          if(matchesParameter && matchesTime && matchesConcept) {
            missingAccion = false;
            break Iterating_acciones;
          };
        }
        if(missingAccion) {
          goalsMissing.push(missingAccion);
        }
      }
      if(!goalsMissing.length) {
        return this.$lsw.dialogs.open({
          title: "No hay objetivos por importar",
          template: `
            <div class="pad_1">
              <div>No hay objetivos por importar actualmente.</div>
            </div>
          `
        });
      }
      const confirmation = await this.$lsw.dialogs.open({
        title: "Importar objetivos a día",
        template: `
          <div class="pad_1">
            <div>¿Seguro que quieres importar los objetivos al día seleccionado?</div>
            <div class="pad_vertical_2">Se añadirán las siguientes {{ goalsToImport.length }} acciones:</div>
            <ul class="margin_vertical_0">
              <li v-for="goal, goalIndex in goalsToImport" v-bind:key="'goal_' + goalIndex">
                <div>{{ currentWeekday }}, {{ currentDay }} ➞ {{ goal.ast.hour }}:{{ goal.ast.minute }}@{{ goal.acc.en_concepto }}</div>
              </li>
            </ul>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button class="supermini" v-on:click="() => accept(true)">Aceptar</button>
              </div>
              <div class="flex_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            currentWeekday: LswGoals.fromDateToWeekday(this.dayToAnalize),
            currentDay: dayString,
            goalsToImport: goalsMissing
          }
        }
      });
      if(confirmation !== true) {
        return;
      }
      await this.$lsw.database.insertMany("Accion", goalsMissing.map(goalMetadata => goalMetadata.acc));
      this.$lsw.toasts.send({
        title: `Se insertaron ${goalsMissing.length} acciones`,
        text: `Los objetivos generaron ${goalsMissing.length} acciones para el día seleccionado`
      });
      this.updateCalendario();
    },
    updateCalendario() {
      this.$trace("lsw-goals-viewer.methods.updateCalendario");
      try {
        LswDom.findVue(".lsw_agenda").reloadDateTasks();
      } catch (error) {
        // @BADLUCK
      }
    }
  },
  watch: {},
  mounted() {
    this.$trace("lsw-goals-viewer.mounted");
    this.loadGoals();
  },
  unmounted() {
    this.$trace("lsw-goals-viewer.unmounted");
  }
});
// @code.end: LswGoalsViewer API