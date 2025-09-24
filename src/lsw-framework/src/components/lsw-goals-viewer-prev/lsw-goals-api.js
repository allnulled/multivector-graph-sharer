(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswGoals'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswGoals'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswGoals class | @section: Lsw Goals API » LswGoals class

  const GoalFactory = class {

    static validate(input) {
      Vue.prototype.$trace("Lsw.GoalFactory.getTodayActions");
    }

  }

  const LswGoals = class {

    static GoalFactory = GoalFactory;

    static validateConcepto(val) {
      Vue.prototype.$trace("LswGoals.validateConcepto");
      return val;
    }

    static validateMedida(val) {
      Vue.prototype.$trace("LswGoals.validateMedida");
      try {

        const isMax = val.startsWith("<");
        const isMin = val.startsWith(">");
        const isLimit = isMax || isMin;
        const innerVal = val.replace(/>|</g, "").trim();
        const isNumber = (() => {
          const numberCast = parseFloat(innerVal);
          return !isNaN(numberCast);
        })();
        const comparator = isMax ? "max" : "min";
        if (isNumber) {
          return [`${comparator}TimesToday`, parseFloat(innerVal)];
        } else {
          Validate_string_or_fail: {
            LswTimer.utils.fromDurationstringToMilliseconds(innerVal);
          }
          return [`${comparator}DurationToday`, innerVal];
        }
        return val;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    static validateUrgencia(val) {
      Vue.prototype.$trace("LswGoals.validateUrgencia");
      $ensure({ val }, 1).type("string").can(it => it.trim().startsWith("!"));
      return parseInt(val.replace(/\!/g, "").trim());
    }


    static async loadGoals() {
      Vue.prototype.$trace("LswGoals.loadGoals");
      const output = [];
      const errors = [];
      console.log("[*] Carga de objetivos por factories:");
      Carga_por_factories: {
        try {
          const factoryIds = await Vue.prototype.$lsw.fs.scan_directory("/kernel/settings/goals/factory");
          for (let indexFactory = 0; indexFactory < factoryIds.length; indexFactory++) {
            const factoryFilename = factoryIds[indexFactory];
            try {
              console.log("[*] Carga de objetivos por factory file:", factoryFilename);
              const factoryDefinition = await Vue.prototype.$lsw.fs.evaluateAsJavascriptFile(`/kernel/settings/goals/factory/${factoryFilename}`);
              GoalFactory.validate(factoryDefinition);
              output.push(factoryDefinition);
            } catch (error) {
              console.log("[!] Error cargando objetivo por fichero único en:", factoryFilename);
              errors.push(error);
            }
          }
        } catch (error) {
          console.log("[!] Error leyendo factories de objetivos:", error);
        }
      }
      Carga_por_el_fichero_unico: {
        console.log("[*] Carga de objetivos por fichero único:");
        const goalsByFileCrude = await Vue.prototype.$lsw.fs.evaluateAsDotenvFileOrReturn("/kernel/settings/goals.env", {});
        const goalFiles = Object.keys(goalsByFileCrude);
        Iterando_reglas_de_fichero:
        for (let indexGoal = 0; indexGoal < goalFiles.length; indexGoal++) {
          const key = goalFiles[indexGoal];
          const val = goalsByFileCrude[key];
          try {
            console.log("[*] Carga de objetivos por clave de fichero único:", key, val);
            const tokens = val.split(/ *\| */g);
            const [concepto, medida, urgencia] = tokens;
            let conceptoSan = concepto;
            let medidaSan = undefined;
            let urgenciaSan = 0;
            conceptoSan = this.validateConcepto(concepto);
            medidaSan = this.validateMedida(medida);
            urgenciaSan = this.validateUrgencia(urgencia);
            const [metodoParaMedir, medidaValor] = medidaSan;
            console.log(conceptoSan, metodoParaMedir, medidaValor, urgenciaSan);
            const accionesCoincidentesCompletadas = await this.getTodayActions(conceptoSan, "completada");
            let porcentaje = undefined;
            Calcular_porcentaje_actual: {
              if(metodoParaMedir.endsWith("TimesToday")) {
                const totalTimes = accionesCoincidentesCompletadas.length;
                porcentaje = Math.round((totalTimes / medidaValor) * 100);
                console.log("CALC:", totalTimes, medidaValor, porcentaje);
              } else if(metodoParaMedir.endsWith("DurationToday")) {
                const totalDurationMs = LswGoals.extractDurationFromActions(accionesCoincidentesCompletadas, true);
                porcentaje = Math.round((totalDurationMs / medidaValor) * 100);
                console.log("CALC:", totalDurationMs, medidaValor, porcentaje);
              }
            }
            output.push({
              id: conceptoSan,
              urgencia: urgenciaSan,
              porcentaje,
              nombre: key,
            });
          } catch (error) {
            console.log("[!] Error cargando objetivo por fichero único en:", key);
            errors.push(error);
          }
        }
        console.log("output:", output);
      }
      if (errors.length) {
        console.error("[!] Errores al cargar objetivos", errors);
        Vue.prototype.$lsw.toasts.send({
          title: "Hubo errores en la carga de objetivos",
          text: `Los siguientes ${errors.length} se dieron al cargar los objetivos`,
        });
      }
      return output;
    }

    static async getTodayActions(onlyConcept = false, onlyState = false) {
      Vue.prototype.$trace("LswGoals.getTodayActions");
      const errores = LswErrorHandler.createGroup();
      const allAcciones = await Vue.prototype.$lsw.database.selectMany("Accion");
      const todayDate = new Date();
      let todayAcciones = [];
      Iterando_acciones:
      for (let indexAccion = 0; indexAccion < allAcciones.length; indexAccion++) {
        const accion = allAcciones[indexAccion];
        if (!accion.tiene_inicio) {
          continue Iterando_acciones;
        }
        try {
          const accionDate = LswTimer.utils.fromDatestringToDate(accion.tiene_inicio);
          const sameDate = LswTimer.utils.areSameDayDates(todayDate, accionDate);
          if (sameDate) {
            todayAcciones.push(accion);
          }
        } catch (error) {
          errores.push(error);
        }
      }
      errores.selfThrowIfNeeded();
      if (onlyConcept) {
        todayAcciones = todayAcciones.filter(acc => acc.en_concepto === onlyConcept);
      }
      if(onlyState) {
        todayAcciones = todayAcciones.filter(acc => acc.tiene_estado === onlyState);
      }
      return todayAcciones;
    }

    static async filterActionsByConcept(actions, conceptId) {
      Vue.prototype.$trace("LswGoals.filterActionsByConcept");
      const matchedActions = [];
      for (let indexAction = 0; indexAction < actions.length; indexAction++) {
        const action = actions[indexAction];
        const isMatch = action.en_concepto === conceptId;
        if (isMatch) {
          matchedActions.push(action);
        }
      }
      return matchedActions;
    }

    static async filterActionsByState(actions, stateId) {
      Vue.prototype.$trace("LswGoals.filterActionsByState");
      const matchedActions = [];
      for (let indexAction = 0; indexAction < actions.length; indexAction++) {
        const action = actions[indexAction];
        const isMatch = action.tiene_estado === stateId;
        if (isMatch) {
          matchedActions.push(action);
        }
      }
      return matchedActions;
    }

    static async ensureActionHasLimitedTimesToday(actionId, times, minOrMax = "min", options) {
      Vue.prototype.$trace("LswGoals.ensureActionHasLimitedTimesToday");
      try {
        const mensajeExplicativo = `${actionId} ${minOrMax === 'min' ? 'mínimo' : 'máximo'} ${times} veces hoy`;
        const {
          completado: completedMessage = `Sí está: ${mensajeExplicativo}`,
          fallido: notYetMessage = `Aún no está: ${mensajeExplicativo}`,
        } = options;
        const salida = input => Object.assign({
          id: mensajeExplicativo,
          urgencia: options.urgencia || 0,
        }, input);
        const todayActions = await LswGoals.getTodayActions();
        const matchedActions = await LswGoals.filterActionsByConcept(todayActions, actionId);
        const completedActions = await LswGoals.filterActionsByState(matchedActions, "completada");
        const isValid = (minOrMax === "min") ? completedActions.length < times : completedActions.length > times;
        if (isValid) {
          return salida({
            completadas: completedActions.length,
            mensaje: notYetMessage,
            porcentaje: Math.round((completedActions.length / times) * 100),
          });
        } else {
          return salida({
            mensaje: completedMessage,
            porcentaje: Math.round((completedActions.length / times) * 100),
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    static ensureActionHasMinimumTimesToday(actionId, minimumTimes, options) {
      return this.ensureActionHasLimitedTimesToday(actionId, minimumTimes, "min", options);
    }

    static ensureActionHasMaximumTimesToday(actionId, maximumTimes, options) {
      return this.ensureActionHasLimitedTimesToday(actionId, maximumTimes, "max", options);
    }

    static async ensureActionHasLimitedDurationToday(actionId, durationDatestring, minOrMax = "min", options = {}) {
      Vue.prototype.$trace("LswGoals.ensureActionHasLimitedDurationToday");
      try {
        const mensajeExplicativo = `${actionId} ${minOrMax === 'min' ? 'mínimo' : 'máximo'} ${durationDatestring} hoy`;
        const minimumDurationMs = LswTimer.utils.fromDurationstringToMilliseconds(durationDatestring);
        const {
          completado: completedMessage = `Sí está: ${mensajeExplicativo}`,
          fallido: notYetMessage = `Aún no está: ${mensajeExplicativo}`,
        } = options;
        const salida = input => Object.assign({
          id: mensajeExplicativo,
          urgencia: options.urgencia || 0,
        }, input);
        const todayActions = await LswGoals.getTodayActions();
        const matchedActions = await LswGoals.filterActionsByConcept(todayActions, actionId);
        const completedActions = await LswGoals.filterActionsByState(matchedActions, "completada");
        let currentDurationMs = 0;
        for (let indexActions = 0; indexActions < completedActions.length; indexActions++) {
          const action = completedActions[indexActions];
          try {
            const actionDurationMs = LswTimer.utils.fromDurationstringToMilliseconds(action.tiene_duracion);
            currentDurationMs += actionDurationMs;
          } catch (error) {
            // @BADLUCK.
          }
        }
        const currentTotal = LswTimer.utils.fromMillisecondsToDurationstring(currentDurationMs);
        const isValid = (minOrMax === "min") ? (currentDurationMs < minimumDurationMs) : (currentDurationMs > minimumDurationMs);
        if (isValid) {
          return salida({
            completadas: currentTotal,
            mensaje: notYetMessage,
            porcentaje: Math.round((currentDurationMs / minimumDurationMs) * 100),
          });
        } else {
          return salida({
            completadas: currentTotal,
            mensaje: completedMessage,
            porcentaje: Math.round((currentDurationMs / minimumDurationMs) * 100),
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    static ensureActionHasMinimumDurationToday(actionId, durationDatestring, options = {}) {
      return this.ensureActionHasLimitedDurationToday(actionId, durationDatestring, "min", options);
    }

    static ensureActionHasMaximumDurationToday(actionId, durationDatestring, options = {}) {
      return this.ensureActionHasLimitedDurationToday(actionId, durationDatestring, "max", options);
    }

    static minTimesToday(action, times, urgencia = 0) {
      return this.ensureActionHasLimitedTimesToday(action, times, "min", {
        id: action,
        urgencia: urgencia,
      });
    }

    static maxTimesToday(action, times, urgencia = 0) {
      return this.ensureActionHasLimitedTimesToday(action, times, "max", {
        id: action,
        urgencia: urgencia,
      });
    }

    static minDurationToday(action, duration, urgencia = 0) {
      return this.ensureActionHasLimitedDurationToday(action, duration, "min", {
        id: action,
        urgencia: urgencia,
      });
    }

    static maxDurationToday(action, duration, urgencia = 0) {
      return this.ensureActionHasLimitedDurationToday(action, duration, "max", {
        id: action,
        urgencia: urgencia,
      });
    }

    static extractDurationFromActions(actions, inMilliseconds = false) {
      let totalMs = 0;
      for (let index = 0; index < actions.length; index++) {
        const action = actions[index];
        try {
          const ms = LswTimer.utils.fromDurationstringToMilliseconds(action.tiene_duracion);
          totalMs += ms;
        } catch (error) {
          // @BADLUCK
        }
      }
      if (inMilliseconds) {
        return totalMs;
      }
      return LswTimer.utils.fromMillisecondsToDurationstring(totalMs);
    }

  };

  return LswGoals;

  // @code.end: LswGoals class

});