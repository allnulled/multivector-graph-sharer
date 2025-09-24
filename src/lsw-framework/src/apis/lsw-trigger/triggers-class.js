(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['TriggersClass'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['TriggersClass'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswTriggers API | @$section: LswTriggers API » LswTriggers classes and functions
  // exported to TriggersClass

  class TriggerConcept {
    constructor(anyzin) {
      Object.assign(this, anyzin);
    }
  };

  class TriggerParameters extends TriggerConcept {};
  
  class TriggerEvent extends TriggerConcept {};

  class TriggersClass {

    static Concept = TriggerConcept;

    static Event = TriggerEvent;
    
    static Parameters = TriggerParameters;

    static globMatch(patterns, list, wantsPatterns = false) {
      const matches = new Set();

      const regexes = patterns.map(pattern => {
        let regexPattern = pattern
          .replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&") // Escapa caracteres especiales
          .replace(/\*/g, ".*")                 // '*' => cualquier cosa
        return {
          original: pattern,
          expr: new RegExp(`^${regexPattern}$`),
        };
      });
      for (const item of list) {
        for (const regex of regexes) {
          if (regex.expr.test(item)) {
            if(!wantsPatterns) {
              matches.add(item);
            } else {
              matches.add(regex.original);
            }
            break;
          }
        }
      }

      return Array.from(matches);
    }

    static create(...args) {
      return new this(...args);
    }

    all = {};

    findTriggerCollectionByEventAndId(event, id) {
      return LswLifecycle.hooks.all[event].filter(trigger => trigger.id === id);
    }

    register(triggerNamePattern, triggerIdentifier, triggerCallback, triggerConfigurations = {}) {
      const { priority = 0 } = triggerConfigurations; // Default priority is 0
      if (!this.all[triggerNamePattern]) {
        this.all[triggerNamePattern] = [];
      }
      
      this.all[triggerNamePattern].push({
        id: triggerIdentifier,
        callback: triggerCallback,
        priority,
      });
    }

    async emit(triggerName, parameters = {}) {
      let matchedTriggers = [];
      const allPatterns = Object.keys(this.all);

      // Encuentra patrones que coincidan con el nombre del evento
      const matchedPatterns = this.constructor.globMatch(allPatterns, [triggerName], true);

      // Agrega todos los eventos coincidentes a la lista de disparos
      for (const pattern of matchedPatterns) {
        matchedTriggers = matchedTriggers.concat(this.all[pattern] || []);
      }

      // Ordena por prioridad descendente
      matchedTriggers.sort((a, b) => b.priority - a.priority);

      // Ejecuta los callbacks en orden
      const output = [];
      for (const trigger of matchedTriggers) {
        const eventObject = new TriggerEvent({ event: triggerName })
        const parametersObject = new TriggerParameters(parameters);
        const result = await trigger.callback(eventObject, parametersObject);
        output.push(result);
      }

      return output;
    }

    unregister(triggerIdentifier) {
      for (const pattern in this.all) {
        this.all[pattern] = this.all[pattern].filter(
          (trigger) => trigger.id !== triggerIdentifier
        );
        if (this.all[pattern].length === 0) {
          delete this.all[pattern]; // Limpia patrones vacíos
        }
      }
    }

    reset() {
      this.all = {};
    }

  }

  TriggersClass.default = TriggersClass;

  return TriggersClass;
  // @code.end: LswTriggers API

});