(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswCycler'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswCycler'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const noop = () => { };

  // @code.start: LswCycler class | @section: Lsw Cycler API » LswCycler class
  class LswCyclerSet {
    constructor(value) {
      this.value = value;
    }
  }

  class LswCyclerReturn {
    constructor(value) {
      this.value = value;
    }
  }

  class LswCyclerReturner {
    constructor(value) {
      if(typeof value !== "function") {
        throw new Error("Required argument «value» to be a function on «LswCyclerReturner.constructor»");
      }
      this.value = value;
    }
  }

  class LswCycler {

    static Return = LswCyclerReturn;
    static Returner = LswCyclerReturner;
    static Set = LswCyclerSet;

    static returner(value) {
      return new this.Returner(value);
    }

    static return(value) {
      return new this.Return(value);
    }

    static set(value) {
      return new this.Set(value);
    }

    constructor($object, exposedProps = []) {
      this.$object = $object;
      if(exposedProps === "*") {
        Object.assign(this, $object);
      } else {
        for(let index=0; index<exposedProps.length; index++) {
          const exposedProp = exposedProps[index];
          this[exposedProp] = $object[exposedProp];
        }
      }
    }

    static from(...args) {
      return new this(...args);
    }

    async run(steps, parameters) {
      let original = [];
      let output = original;
      Iterate_cycle:
      for (let j = 0; j < steps.length; j++) {
        let step = steps[j];
        let fn = this.$object[step];
        if (typeof fn !== "function") {
          throw new Error("Required step «" + step + "» to be a function on round " + j + " on «LswCycler.run»");
        }
        const result = await fn.call(this.$object, parameters);
        Apply_intercycle_signals: {
          if (result instanceof this.constructor.Set) {
            output = await result.value;
          } else if (result instanceof this.constructor.Return) {
            return result.value;
          } else if (result instanceof this.constructor.Returner) {
            return result.value(output, original);
          }
        }
        Append_result_if_not_changed_output: {
          original.push(result);
        }
      }
      return output;
    }

  }
  // @code.end: LswCycler class

  return LswCycler;

});