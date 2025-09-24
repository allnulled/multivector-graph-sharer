(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window["LswEnsurer"] = mod;
  }
  if (typeof global !== 'undefined') {
    global["LswEnsurer"] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  /**
   * 
   * 
   * @$section: Lsw Ensurer API » LswEnsurer class
   * @type: class
   * @extends: Object
   * @vendor: lsw
   * @namespace: LswEnsurer
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: LswEnsurer class | @section: Lsw Ensurer API » LswEnsurer class
  class AssertionError extends Error {

    constructor(...args) {
      super(...args);
      this.name = "AssertionError";
    }

  }

  class Ensurement {

    static create(...args) {
      return new this(...args);
    }

    constructor(source, asLabeledObject = 0) {
      Resolve_subject: {
        if ((asLabeledObject === 1) && (typeof source === "object")) {
          const sourceKeys = Object.keys(source);
          if (sourceKeys.length !== 1) {
            throw new Error(`The first parameter of $ensure or $check {when $2 is literally 1} must have 1 property (not ${sourceKeys.length}) on «Ensurement.constructor»`);
          }
          this.$subjectId = sourceKeys[0];
          this.$subject = source[this.$subjectId];
        } else if(typeof asLabeledObject === "string") {
          this.$subjectId = asLabeledObject;
          this.$subject = source;
        } else {
          this.$subjectId = "@";
          this.$subject = source;
        }
      }
      this.$operation = undefined;
      this.$objectation = undefined;
      this.asBoolean = false;
    }
    type(value) {
      this.$operation = "is of type";
      this.$objectation = value;
      if(typeof value === "string") {
        if (typeof this.$subject !== value) {
          return this.$asFailed();
        }
      } else if(Array.isArray(value)) {
        if(value.indexOf(typeof this.$subject) === -1) {
          return this.$asFailed();
        }
      } else {
        throw new Error(`Bad parameter on «$ensure(...).type(?)» (${typeof value} not admitted)`);
      }
      return this.$asResolved();
    }
    notType(value) {
      this.$operation = "is not of type";
      this.$objectation = value;
      if (typeof this.$subject === value) {
        return this.$asFailed();
      }
      return this.$asResolved();
    }
    is(value) {
      this.$operation = "is";
      this.$objectation = value;
      if (this.$subject !== value) {
        return this.$asFailed();
      }
      return this.$asResolved();
    }
    isnt(value) {
      this.$operation = "is not";
      this.$objectation = value;
      if (this.$subject === value) {
        return this.$asFailed();
      }
      return this.$asResolved();
    }
    can(value) {
      this.$operation = "can";
      this.$objectation = value;
      if (!value(this.$subject)) {
        return this.$asFailed();
      }
      return this.$asResolved();
    }
    cant(value) {
      this.$operation = "cant";
      this.$objectation = value;
      if (value(this.$subject)) {
        return this.$asFailed();
      }
      return this.$asResolved();
    }
    throws(value) {
      this.$operation = "throws";
      this.$objectation = value;
      try {
        objectation(this.$subject);
        return this.$asFailed();
      } catch (error) {
        return this.$asResolved();
      }
    }
    doesntThrow(value) {
      this.$operation = "doesntThrow";
      this.$objectation = value;
      try {
        value(this.$subject);
        return this.$asFailed();
      } catch (error) {
        return this.$asResolved();
      }
    }
    $asFailed(operation = this.$operation) {
      if (this.asBoolean) {
        return false;
      }
      throw new AssertionError("could not ensure «" + this.$subjectId + "» " + operation + (this.$objectation ? " «" + this.$getObjectationAsString() + "»": "") + "");
    }
    $getObjectationAsString() {
      return JSON.stringify(this.$objectation);
    }
    $asResolved() {
      if (this.asBoolean) {
        return true;
      } else {
        return this;
      }
    }
  };

  const BasicToBeInterface = class {
    $isNegated = false;
    set $operation(value) {
      this.$ensurement.$operation = value;
    }
    get $operation() {
      return this.$ensurement.$operation;
    }
    set $objectation(value) {
      this.$ensurement.$objectation = value;
    }
    get $objectation() {
      return this.$ensurement.$objectation;
    }
    constructor(ensurement) {
      this.$ensurement = ensurement;
      this.$subject = this.$ensurement.$subject;
    }
    $makeNegable(condition) {
      return this.$isNegated === true ? !condition : condition;
    }
    $asFailed() {
      return this.$ensurement.$asFailed();
    }
    $resolveNegableString(text) {
      return text.replace(/\{not\?\} */g, this.$isNegated ? "not " : "");
    }
  };

  const ToBeInterface = class extends BasicToBeInterface {
    string() {
      this.$operation = this.$resolveNegableString("to {not?} be string");
      this.$objectation = undefined;
      if (this.$makeNegable(typeof this.$subject !== "string")) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    number() {
      this.$operation = this.$resolveNegableString("to {not?} be number");
      this.$objectation = undefined;
      if (this.$makeNegable(typeof this.$subject !== "number") || Number.isNaN(this.$subject)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    object() {
      this.$operation = this.$resolveNegableString("to {not?} be object");
      this.$objectation = undefined;
      if (this.$makeNegable(typeof this.$subject !== "object")) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    null() {
      this.$operation = this.$resolveNegableString("to {not?} be null");
      this.$objectation = undefined;
      if (this.$makeNegable(typeof this.$subject !== null)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    undefined() {
      this.$operation = this.$resolveNegableString("to {not?} be undefined");
      this.$objectation = undefined;
      if (this.$makeNegable(typeof this.$subject !== "undefined")) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    boolean() {
      this.$operation = this.$resolveNegableString("to {not?} be boolean");
      this.$objectation = undefined;
      if (this.$makeNegable(typeof this.$subject !== "boolean")) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    instanceOf(clazz) {
      this.$operation = this.$resolveNegableString("to {not?} be instanceOf");
      this.$objectation = undefined;
      if (this.$makeNegable(!(this.$subject instanceof clazz))) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    array() {
      this.$operation = this.$resolveNegableString("to {not?} be array");
      this.$objectation = undefined;
      if (this.$makeNegable(!Array.isArray(this.$subject))) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    function() {
      this.$operation = this.$resolveNegableString("to {not?} be function");
      this.$objectation = undefined;
      if (this.$makeNegable(typeof (this.$subject) !== "function")) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    empty() {
      this.$operation = this.$resolveNegableString("to {not?} be empty");
      this.$objectation = undefined;
      const isEmpty = (() => {
        const s = this.$subject;
        if (Array.isArray(s)) {
          return s.length === 0;
        } else if (typeof s === "object") {
          return s === null || Object.keys(s).length === 0;
        } else if (typeof s === "string") {
          return s === "";
        } else if (typeof s === "number") {
          return s === 0;
        } else if (typeof s === "boolean") {
          return s === false;
        } else {
          return true;
        }
      })();
      if (this.$makeNegable(!isEmpty)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    equalTo(value) {
      this.$operation = this.$resolveNegableString("to {not?} be equal to");
      this.$objectation = value;
      let isEqual = this.$subject === value;
      if (this.$makeNegable(!isEqual)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    equalOrGreaterThan(value) {
      this.$operation = this.$resolveNegableString("to {not?} be equal or greater than");
      this.$objectation = value;
      let isGreaterOrEqual = this.$subject >= value;
      if (this.$makeNegable(!isGreaterOrEqual)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    greaterThan(value) {
      this.$operation = this.$resolveNegableString("to {not?} be greater than");
      this.$objectation = value;
      let isGreater = this.$subject > value;
      if (this.$makeNegable(!isGreater)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    greaterOrEqualTo(...args) {
      return this.equalOrGreaterThan(...args);
    }
    equalOrLowerThan(value) {
      this.$operation = this.$resolveNegableString("to {not?} equal or lower than");
      this.$objectation = value;
      let isGreaterOrEqual = this.$subject <= value;
      if (this.$makeNegable(!isGreaterOrEqual)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    lowerThan(value) {
      this.$operation = this.$resolveNegableString("to {not?} be lower than");
      this.$objectation = value;
      let isGreater = this.$subject < value;
      if (this.$makeNegable(!isGreater)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    lowerOrEqualTo(value) {
      return this.equalOrLowerThan(...args);
    }
    oneOf(value) {
      this.$operation = this.$resolveNegableString("to {not?} be one of");
      this.$objectation = value;
      if(!Array.isArray(value)) {
        throw new Error(`Required on «$ensure(...).to.be.oneOf(!)» to provide an array on «ToBeInterface.oneOf»`);
      }
      let isOne = this.$objectation.indexOf(this.$subject) !== -1;
      if (this.$makeNegable(!isOne)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
  };

  const ToNotBeInterface = class extends ToBeInterface {
    $isNegated = true;
  };

  const ToHaveInterface = class extends BasicToBeInterface {

    text(prop) {
      this.$operation = this.$resolveNegableString("to {not?} have text");
      this.$objectation = prop;
      const hasSubstring = this.$subject.indexOf(prop) !== -1;
      if (this.$makeNegable(!hasSubstring)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }
    
    key(prop) {
      this.$operation = this.$resolveNegableString("to {not?} have key");
      this.$objectation = prop;
      const keys = Object.keys(this.$subject);
      const hasKey = keys.indexOf(prop) !== -1;
      if (this.$makeNegable(!hasKey)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }

    value(prop) {
      this.$operation = this.$resolveNegableString("to {not?} have value");
      this.$objectation = prop;
      const values = Object.values(this.$subject);
      const hasValue = values.indexOf(prop) !== -1;
      if (this.$makeNegable(!hasValue)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }

    onlyPotentialKeys(props) {
      this.$operation = this.$resolveNegableString("to {not?} have only potential keys");
      this.$objectation = props;
      const keys = Object.keys(this.$subject);
      let hasOnly = true;
      Iterating_props:
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (props.indexOf(key) === -1) {
          hasOnly = false;
          break Iterating_props;
        }
      }
      if (this.$makeNegable(!hasOnly)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }

    keys(props) {
      this.$operation = this.$resolveNegableString("to {not?} have keys");
      this.$objectation = props;
      const keys = Object.keys(this.$subject);
      let hasKeys = true;
      Iterating_props:
      for (let index = 0; index < props.length; index++) {
        const prop = props[index];
        if (keys.indexOf(prop) === -1) {
          hasKeys = false;
          break Iterating_props;
        }
      }
      if (this.$makeNegable(!hasKeys)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }

    values(props) {
      this.$operation = this.$resolveNegableString("to {not?} have values");
      this.$objectation = props;
      const values = Object.values(this.$subject);
      let hasValues = true;
      Iterating_props:
      for (let index = 0; index < props.length; index++) {
        const prop = props[index];
        if (values.indexOf(prop) === -1) {
          hasValues = false;
          break Iterating_props;
        }
      }
      if (this.$makeNegable(!hasValues)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }

    uniquelyKeys(props) {
      this.$operation = this.$resolveNegableString("to {not?} have uniquelyKeys");
      this.$objectation = props;
      const keys = Object.keys(this.$subject);
      let hasKeys = true;
      Iterating_props:
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (props.indexOf(key) === -1) {
          hasKeys = false;
          break Iterating_props;
        }
      }
      if (this.$makeNegable(!hasKeys)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }

    uniquelyValues(props) {
      this.$operation = this.$resolveNegableString("to {not?} have uniquelyValues");
      this.$objectation = props;
      const values = Object.values(this.$subject);
      let hasValues = true;
      Iterating_props:
      for (let index = 0; index < values.length; index++) {
        const value = values[index];
        if (props.indexOf(value) === -1) {
          hasValues = false;
          break Iterating_props;
        }
      }
      if (this.$makeNegable(!hasValues)) return this.$asFailed();
      return this.$ensurement.$asResolved();
    }

  };

  const ToNotHaveInterface = class extends ToHaveInterface {
    $isNegated = true;
  };

  const EnsurementV1 = class extends Ensurement {

    selfExtend(obj) {
      return Object.assign(this, obj);
    }

    get $toNotBe() {
      return new ToNotBeInterface(this);
    }

    get $toNotHave() {
      return new ToNotHaveInterface(this);
    }

    get $toNot() {
      return {
        be: this.$toNotBe,
        have: this.$toNotHave,
      }
    }

    get $toBe() {
      return new ToBeInterface(this);
    }

    get $toHave() {
      return new ToHaveInterface(this);
    }

    get to() {
      return {
        be: this.$toBe,
        have: this.$toHave,
        not: this.$toNot,
      };
    }

    its(id) {
      return this.constructor.create({
        [id]: this.$subject[id]
      }, 1).selfExtend({
        $parent: this,
        asBoolean: this.asBoolean,
      });
    }

    getSubject() {
      return this.$subject;
    }

    safelyBack(levels = 1) {
      for (let index = 0; index < levels; index++) {
        try {
          parent = this.$parent;
        } catch (error) {
          // @OK.
        }
      }
    }

    back(levels = 1) {
      let parent = this;
      for (let index = 0; index < levels; index++) {
        try {
          parent = this.$parent;
        } catch (error) {
          throw new Error(`Ensurement could not go «back» reaching parent on level «${index}» on «ensure(...).back»`);
        }
      }
      return parent;
    }

    static $or(options) {
      let correctOption = undefined;
      const allIds = Object.keys(options);
      const orError = new Error(`could not ensure «or» group with options: «${allIds.join("», «")}»`);
      for(let index=0; index<allIds.length; index++) {
        const currentId = allIds[index];
        const currentOptionCallback = options[currentId];
        try {
          currentOptionCallback();
          return currentId;
        } catch (error) {
          orError.appendError(error);
        }
      }
      throw orError.unified();
    }
    
    static id(obj) {
      return this.create(obj,1);
    }
    
    static ensure(...args) {
      return this.create(...args);
    }

    static check(...args) {
      return this.create(...args).selfExtend({
        asBoolean: true
      });
    }

    static assert(condition, errorMessage = "Assertion error happened") {
      if (!condition) {
        throw new AssertionError(errorMessage);
      }
      return true;
    }

    static fails(callback, errorMessage = "Assertion error happened") {
      let passes = true;
      try {
        callback();
        passes = false;
      } catch (error) {
        return true;
      }
      if (!passes) {
        throw new AssertionError(errorMessage);
      }
    }

    static AssertionError = AssertionError;

  };

  Export_to_globals: {
    globalThis.$fails = EnsurementV1.fails.bind(EnsurementV1);
    globalThis.$ensure = EnsurementV1.ensure.bind(EnsurementV1);
    globalThis.$ensure.id = EnsurementV1.id.bind(EnsurementV1);
    globalThis.$ensure.check = EnsurementV1.check.bind(EnsurementV1);
    globalThis.$ensure.assert = EnsurementV1.assert.bind(EnsurementV1);
    globalThis.$ensure.fails = EnsurementV1.fails.bind(EnsurementV1);
    globalThis.$check = EnsurementV1.check.bind(EnsurementV1);
    globalThis.$assert = EnsurementV1.assert.bind(EnsurementV1);
    // globalThis.AssertionError = AssertionError;
    globalThis.$ensure.$or = EnsurementV1.$or;
  }
  
  return EnsurementV1;
  // @code.end: LswEnsurer class

});