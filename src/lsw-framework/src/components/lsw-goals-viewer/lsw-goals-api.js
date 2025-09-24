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

  const LocalUtilities = class {

  };

  const LswGoals = class {

    static COLOR_GAMA_1 = {
      SUSPENSO: "red",
      INSUFICIENTE: "#e87489",
      SUFICIENTE: "#5353bf",
      NOTABLE: "orange",
      EXCELENTE: "yellow",
      SOBRESALIENTE: "lime",
    };

    static COLOR_GAMA_2 = {
      SUSPENSO: "#D32F2F",
      INSUFICIENTE: "#F57C00",
      SUFICIENTE: "#FBC02D",
      NOTABLE: "#C0CA33",
      EXCELENTE: "#7CB342",
      SOBRESALIENTE: "#388E3C",
    };

    static COLOR_GAMA_3 = {
      SUSPENSO: "#c6282866",
      INSUFICIENTE: "#ef6c0066",
      SUFICIENTE: "#ffe30066",
      NOTABLE: "#29b6f666",
      EXCELENTE: "#00897b66",
      SOBRESALIENTE: "#66bb6a66",
    };

    static COLOR = this.COLOR_GAMA_3;

    static COLOR_MEANING = {
      [this.COLOR.SUSPENSO]: "SUSPENSO",
      [this.COLOR.INSUFICIENTE]: "INSUFICIENTE",
      [this.COLOR.SUFICIENTE]: "SUFICIENTE",
      [this.COLOR.NOTABLE]: "NOTABLE",
      [this.COLOR.EXCELENTE]: "EXCELENTE",
      [this.COLOR.SOBRESALIENTE]: "SOBRESALIENTE",
    };

    static async getGoalsReport(someDate = new Date()) {
      Vue.prototype.$trace("lsw-goals-viewer.methods.getGoalsReport");
      let originalGoals = undefined;
      // @HISTORICAL:
      Previous_goals_setter: {
        break Previous_goals_setter;
        const parsedLinesPromise = Vue.prototype.$lsw.fs.evaluateAsDotenvListFileOrReturn("/kernel/settings/goals.env", []);
        const parsedLines = await parsedLinesPromise;
        // 1. Get original goals:
        const previousOriginalGoals = parsedLines.map(line => {
          const [concept, condition = "> 0", urgency = "0"] = line.split(/\|/g).map(item => {
            return item.trim();
          });
          return { line, concept, condition, urgency };
        });
        originalGoals = previousOriginalGoals;
      }
      // @CURRENT:
      Current_goals_setter: {
        originalGoals = await Vue.prototype.$lsw.fs.evaluateAsWeekFileOrReturn("/kernel/goals/goals.week", []);
      }
      // 2. Get today's completed actions:
      const todayCompletedActions = await this.getSomeDayActions(someDate, false, "completada");
      const formattedGoals = [];
      const insertedGoals = [];
      // 3. Expand goals:
      Iterating_goals:
      for (let indexGoal = 0; indexGoal < originalGoals.length; indexGoal++) {
        try {
          const originalGoal = originalGoals[indexGoal];
          const {
            type: goalType,
            concept,
            condition,
            urgency,
            from: goalBegin,
            to: goalEnd
          } = originalGoal;
          const isRequire = goalType === "REQ";
          const isSet = goalType === "SET";
          const datestring = LswTimer.utils.fromDateToDatestring(someDate);
          // Filtros de fecha:
          if (goalBegin !== "*") {
            if (datestring < goalBegin) {
              continue Iterating_goals;
            }
          }
          if (goalEnd !== "*") {
            if (datestring > goalEnd) {
              continue Iterating_goals;
            }
          }
          // Aplica cambios en cada caso:
          if (isSet) {
            // Solo si es en un rango de 20 días antes o después:
            const today = new Date();
            const maxBefore = new Date(today);
            maxBefore.setDate(maxBefore.getDate() - 1);
            const maxLater = new Date(today);
            maxLater.setDate(maxLater.getDate() + 1);
            const isInRange = (someDate > maxBefore) && (someDate < maxLater);
            if(!isInRange) {
              continue Iterating_goals;
            }
            const duration = originalGoal.duration || "1h";
            const hour = originalGoal.hour || "00";
            const minute = originalGoal.minute || "00";
            const weekday = originalGoal.weekday;
            const isAnyWeekday = weekday === "*";
            const currentWeekday = this.fromDateToWeekday(someDate);
            if(!isAnyWeekday && (currentWeekday !== weekday)) {
              continue Iterating_goals;
            }
            const currDatestring = LswTimer.utils.fromDateToDatestring(someDate, true);
            const fullDatestring = `${currDatestring} ${hour}:${minute}`;
            const matchedAcciones = await Vue.prototype.$lsw.database.select("Accion", acc => {
              const sameConcept = acc.en_concepto === concept;
              const sameMinute = acc.tiene_inicio.startsWith(fullDatestring);
              return sameConcept && sameMinute;
            });
            if(matchedAcciones.length === 1) {
              continue Iterating_goals;
            }
            No_haremos_el_insert_aqui: {
              const isToday = LswTimer.utils.areSameDayDates(today, someDate);
              if(!isToday) {
                break No_haremos_el_insert_aqui;
              }
              await Vue.prototype.$lsw.database.insert("Accion", {
                en_concepto: concept,
                tiene_estado: "pendiente",
                tiene_inicio: fullDatestring,
                tiene_duracion: duration,
                tiene_parametros: "[*goal]",
                tiene_resultados: "",
                tiene_comentarios: "",
              });
              insertedGoals.push(`${concept}@${fullDatestring}`);
            }
            continue Iterating_goals;
          } else if (isRequire) {
            const formattedGoal = {};
            const formattedConcept = this.formatConcept(concept);
            const formattedCondition = this.formatCondition(condition, formattedConcept);
            const formattedUrgency = this.formatUrgency(urgency);
            formattedGoal.concept = formattedConcept;
            Object.assign(formattedGoal, formattedCondition(todayCompletedActions));
            formattedGoal.urgency = formattedUrgency;
            formattedGoals.push(formattedGoal);
          }
        } catch (error) {
          console.log(error);
        }
      }
      const sortedGoals = [].concat(formattedGoals).sort((g1, g2) => {
        try {
          const u1 = g1.urgency || 0;
          const u2 = g2.urgency || 0;
          const c1 = g1.filledAsint || 0;
          const c2 = g2.filledAsint || 0;
          const g1over = c1 > 100;
          const g2over = c2 > 100;
          if (g2over) return -1;
          if (g1over) return 1;
          if (u1 > u2) return -1;
          if (u1 < u2) return 1;
          if (c1 < c2) return -1;
          if (c1 > c2) return 1;
          return 0;
        } catch (error) {
          console.log(error);
        }
      });
      if(insertedGoals.length) {
        Vue.prototype.$lsw.toasts.debug(insertedGoals);
      }
      return {
        goals: sortedGoals,
        actions: todayCompletedActions
      };
    }

    static fromDateToWeekday(date) {
      const weekdayNum = date.getDay();
      if(weekdayNum === 0) {
        return "dom";
      } else if(weekdayNum === 1) {
        return "lun";
      } else if(weekdayNum === 2) {
        return "mar";
      } else if(weekdayNum === 3) {
        return "mie";
      } else if(weekdayNum === 4) {
        return "jue";
      } else if(weekdayNum === 5) {
        return "vie";
      } else if(weekdayNum === 6) {
        return "sab";
      }
    }

    static $appliesRange(rangeStart, rangeEnd, date) {
      Vue.prototype.$trace("lsw-goals-viewer.methods.$appliesRange");
      if (rangeStart === "*") {
        if (rangeEnd === "*") {
          return true;
        } else {
          return rangeEnd >= date;
        }
      } else if (rangeStart <= date) {
        if (rangeEnd === "*") {
          return true;
        } else {
          return rangeEnd >= date;
        }
      }
      return true;
    }

    static formatConcept(txt) {
      return txt;
    }

    static formatCondition(originalTxt, concept) {
      const isMin = originalTxt.startsWith(">");
      const op = originalTxt.trim().match(/(\<|\>)(=)?/g);
      const opCorrected = op.length === 1 ? op + "=" : op;
      const txt = originalTxt.replace(/(\<|\>)(=)?/g, "")
      const isTimes = this.isConditionByTimes(txt);
      const isDuration = this.isConditionByDuration(txt);
      if ((!isTimes) && (!isDuration)) {
        throw new Error(`Condition «${txt}» must be a number or a durationstring on «LswGoals.formatCondition»`);
      }
      const referenceValue = isTimes ? parseInt(txt) : LswTimer.utils.fromDurationstringToMilliseconds(txt);
      return completedActions => {
        const conclusion = {};
        conclusion.type = isTimes ? "by times" : isDuration ? "by duration" : undefined;
        conclusion.expectedAs = isMin ? "minimum" : "maximum";
        conclusion.expectedAsAbbr = isMin ? "min" : "max";
        const matchedActions = [];
        Collect_matched_actions:
        for (let index = 0; index < completedActions.length; index++) {
          const acc = completedActions[index];
          const sameConcept = acc.en_concepto === concept;
          const isCompleted = acc.tiene_estado === "completada"; // Redundante, pero bueno.
          if (sameConcept && isCompleted) {
            matchedActions.push(acc);
          }
        }
        Expand_data: {
          conclusion.currentTimes = matchedActions.length;
          conclusion.currentDurationInms = matchedActions.reduce((total, acc) => {
            try {
              total += LswTimer.utils.fromDurationstringToMilliseconds(acc.tiene_duracion || "0min");
            } catch (error) {
              console.log(error);
            }
            return total;
          }, 0);
          conclusion.currentDuration = LswTimer.utils.fromMillisecondsToDurationstring(conclusion.currentDurationInms) || "0min";
        }
        Apply_proper_filters: {
          if (isTimes) {
            const expectedTimes = referenceValue;
            conclusion.expectedTimes = expectedTimes;
            const evaluableSource = `${conclusion.currentTimes} ${opCorrected} ${expectedTimes}`;
            console.log("[*] Evaluating JavaScript for condition: ", evaluableSource);
            conclusion.filledAsint = Math.round(100 * (conclusion.currentTimes / conclusion.expectedTimes));
            conclusion.filled = conclusion.filledAsint + "%";
            Specific_for_time_cases: {
              conclusion.missingTimes = conclusion.expectedTimes - conclusion.currentTimes;
            }
            conclusion.missingAsint = 100 - conclusion.filledAsint;
            conclusion.missing = conclusion.missingAsint + "%";
            conclusion.solved = window.eval(evaluableSource);
            conclusion.solvable = evaluableSource;
          } else if (isDuration) {
            const expectedDuration = referenceValue;
            conclusion.expectedDurationInms = expectedDuration;
            conclusion.expectedDuration = LswTimer.utils.fromMillisecondsToDurationstring(expectedDuration);
            const evaluableSource = `${conclusion.currentDurationInms} ${opCorrected} ${expectedDuration}`;
            console.log("[*] Evaluating JavaScript for condition: ", evaluableSource);
            conclusion.filledAsint = Math.round(100 * (conclusion.currentDurationInms / conclusion.expectedDurationInms));
            conclusion.filled = conclusion.filledAsint + "%";
            const missingDurationInms = LswUtils.zeroIfNegative(conclusion.expectedDurationInms - conclusion.currentDurationInms);
            Specific_for_duration_cases: {
              conclusion.missingDuration = LswTimer.utils.fromMillisecondsToDurationstring(missingDurationInms);
              conclusion.missingDurationInms = missingDurationInms;
            }
            conclusion.missingAsint = 100 - conclusion.filledAsint;
            conclusion.missing = conclusion.missingAsint + "%";
            conclusion.solved = window.eval(evaluableSource);
            conclusion.solvable = evaluableSource;
          }
        }
        this.expandColor(conclusion);
        return conclusion;
      };
    }

    /*
    static COLOR_MEANING = {
      "red": "SUSPENSO",
      "#e87489": "INSUFICIENTE",
      "#5353bf": "SUFICIENTE",
      "orange": "NOTABLE",
      "yellow": "EXCELENTE",
      "lime": "SOBRESALIENTE",
    };
    //*/

    static expandColor(_) {
      const percentage = _.filledAsint;
      const asMin = _.expectedAs === "minimum" ? true : false;
      const assignedColor = (() => {
        if (percentage <= 0) {
          return asMin ? this.COLOR.SUSPENSO : this.COLOR.SOBRESALIENTE;
        } else if (percentage < 20) {
          return asMin ? this.COLOR.INSUFICIENTE : this.COLOR.EXCELENTE;
        } else if (percentage < 40) {
          return asMin ? this.COLOR.SUFICIENTE : this.COLOR.NOTABLE;
        } else if (percentage < 60) {
          return asMin ? this.COLOR.NOTABLE : this.COLOR.SUFICIENTE;
        } else if (percentage < 80) {
          return asMin ? this.COLOR.EXCELENTE : this.COLOR.INSUFICIENTE;
        } else if (percentage > 80) {
          return asMin ? this.COLOR.SOBRESALIENTE : this.COLOR.SUSPENSO;
        } else {
        }
      })();
      Object.assign(_, {
        color: assignedColor,
        colorMeaning: this.COLOR_MEANING[assignedColor],
      });
    }

    static formatUrgency(txt) {
      return parseFloat(txt.replace(/\!/g, "").trim());
    }

    static isConditionByTimes(txtVal) {
      return txtVal.trim().match(/^[0-9]+(\.[0-9]+)?$/g);
    }

    static isConditionByDuration(txtVal) {
      try {
        return LswTimer.utils.fromDurationstringToMilliseconds(txtVal);
        return true;
      } catch (error) {
        return false;
      }
    }

    static getSomeDayActions(dateToday = new Date(), concept = false, state = false) {
      Vue.prototype.$trace("lsw-goals-viewer.methods.getSomeDayActions");
      return Vue.prototype.$lsw.database.selectMany("Accion", acc => {
        const dateInicio = LswTimer.utils.fromDatestringToDate(acc.tiene_inicio);
        const isSameDay = LswTimer.utils.areSameDayDates(dateInicio, dateToday);
        if (!isSameDay) {
          return false;
        }
        if (concept) {
          const isSameConcept = acc.en_concepto === concept;
          if (!isSameConcept) {
            return false;
          }
        }
        if (state) {
          const isSameState = acc.tiene_estado === state;
          if (!isSameState) {
            return false;
          }
        }
        return true;
      });
    }

  };

  return LswGoals;

  // @code.end: LswGoals class

});