// @code.start: LswXForm API | @$section: Lsw Directives » v-xform directive
(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswXForm'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswXForm'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  let isTracing = true;
  let $COUNTADOR1 = 0;

  const trace = function (method, args = []) {
    if (isTracing) {
      console.log("[trace][lsw-xform][" + method + "]", args.length);
    }
  };

  const XformCommonInterface = class {
    formInterface = "Common";
    static create(...args) {
      return new this(...args);
    }
    constructor(inheritedArgument, subtype) {
      const { el, binding, scope } = inheritedArgument;
      trace("XformCommonInterface.constructor:" + this.formInterface);
      this.$el = el;
      this.$binding = binding;
      this.$component = scope;
      this.$type = subtype;
      this.$name = this.$binding.value?.name || false;
      this.$onValidateInterfaceArguments();
      this.$injectAttributesToElement();
    }
    $injectAttributesToElement() {
      trace("XformCommonInterface.$injectAttributesToElement:" + this.formInterface);
      this.$el.setAttribute("data-xform-node", this);
    }
    $onValidateInterfaceArguments() {
      trace("XformCommonInterface.$onValidateInterfaceArguments:" + this.formInterface);
      const ensureEl = $ensure(this.$el).type("object").to.be.instanceOf(HTMLElement);
      const ensureBinding = $ensure(this.$binding).type("object");
      const ensureValue = ensureBinding.its("value").type("object");
      const checkValue = $check(ensureValue.$subject);
      $ensure(this.$type).type("string").to.be.oneOf(["form", "control", "input", "error"]);
      ensureValue.to.have.keys(["name"]).its("name").type("string").back();
      if (checkValue.to.have.key("onSetError")) {
        ensureValue.its("onSetError").type("function");
      }
      if (checkValue.to.have.key("onClearError")) {
        ensureValue.its("onClearError").type("function");
      }
      if (checkValue.to.have.key("onGetValue")) {
        ensureValue.its("onGetValue").type("function");
      }
      if (checkValue.to.have.key("onGetChildren")) {
        ensureValue.its("onGetChildren").type("function");
      }
      if (checkValue.to.have.key("onValidate")) {
        ensureValue.its("onValidate").type("function");
      }
      if (checkValue.to.have.key("onSubmit")) {
        ensureValue.its("onSubmit").type("function");
      }
    }
    validate() {
      trace("XformCommonInterface.validate:" + this.formInterface);
      const value = this.getValue();
      const result = this.$hookWith("onValidate", [value, this]);
      this.$propagateSuccess();
      return true;
    }
    $getParent(onlyTypes = false) {
      trace("XformCommonInterface.$getParent:" + this.formInterface);
      if (typeof onlyTypes === "string") {
        onlyTypes = [onlyTypes];
      }
      const found = LswDom.getClosestParent(this.$el, "[data-xform-node]");
      if (!Array.isArray(onlyTypes)) {
        return found;
      } else if (!found?.length) {
        return found;
      }
      return found.filter(el => onlyTypes.indexOf(el.$xform.$type) !== -1);
    }
    $getChildren(onlyTypesInput = false) {
      trace("XformCommonInterface.$getChildren:" + this.formInterface);
      let onlyTypes = onlyTypesInput;
      if (typeof onlyTypesInput === "string") {
        onlyTypes = [onlyTypesInput];
      }
      const found = LswDom.getClosestChildren(this.$el, "[data-xform-node]");
      if (!Array.isArray(onlyTypes)) {
        return found;
      } else if (!found?.length) {
        return found;
      }
      const foundChildren = found.filter(el => onlyTypes.indexOf(el.$xform.$type) !== -1);
      return foundChildren;
    }
    getValue() {
      trace("XformCommonInterface.getValue:" + this.formInterface);
      const result = this.$hookWith("onGetValue");
      if (typeof result !== "undefined") {
        return result;
      }
      return this.$getChildren(["form", "control", "input"]).reduce((output, el) => {
        const hasName = el.$xform.$binding.value.name;
        if (hasName === "*") {
          output = el.$xform.getValue();
        } else if (!hasName) {
          // @OK...
        } else {
          output[hasName] = el.$xform.getValue();
        }
        return output;
      }, {});
    }
    $hookWith(hookId, parameters = []) {
      trace("XformCommonInterface.$hookWith:" + this.formInterface);
      if (!(hookId in this.$binding.value)) {
        console.log(`[-] No hooks found for ${hookId}`);
        return undefined;
      }
      const hookFunction = this.$binding.value[hookId];
      if (typeof hookFunction === "undefined") {
        console.log(`[-] Hook with bad type found for ${hookId}`);
        return undefined;
      } else if (typeof hookFunction !== "function") {
        throw new Error(`Expected parameter «${hookId}» to be a function on «$hookWith»`);
      }
      console.log(`[*] Executing hook for ${hookId}`);
      console.log(hookFunction.toString(), parameters);
      return hookFunction(...parameters);
    }
    $setError(error) {
      trace("XformCommonInterface.$setError:" + this.formInterface);
      this.$error = error;
      this.$hookWith("onSetError", [error, this]);
      return this;
    }
    $clearError() {
      trace("XformCommonInterface.$clearError:" + this.formInterface);
      this.$error = false;
      this.$hookWith("onClearError", [this]);
      return this;
    }
    $propagateError(error, rethrowIt = 1, propagateDown = 1, propagateUp = 1) {
      trace("XformCommonInterface.$propagateError:" + this.formInterface);
      try {
        if (this.$binding.value.debug) {
          console.error(`[DEBUG] Error propagated to «v-form.${this.$type}»:`, error);
        }
        const contador = ++$COUNTADOR1;
        Propagate_down: {
          if(!propagateDown) {
            break Propagate_down;
          }
          console.log("propagate down now " + contador + " " + this.formInterface);
          const propagableChildren = this.$getChildren(["error"]);
          console.log(propagableChildren);
          if (propagableChildren && propagableChildren.length) {
            for (let index = 0; index < propagableChildren.length; index++) {
              const child = propagableChildren[index];
              child.$xform.$setError(error);
            }
          }
          console.log("ok down now " + contador + " " + this.formInterface);
        }
        Propagate_up: {
          if(!propagateUp) {
            break Propagate_up;
          }
          console.log("propagate up now " + contador + " " + this.formInterface);
          const propagableParent = this.$getParent(["form", "control"]);
          console.log(propagableParent);
          if (propagableParent) {
            try {
              propagableParent.$xform.$propagateError(error, 1);
            } catch (error) {
              console.log(error);
            }
          }
          console.log("ok up now " + contador + " " + this.formInterface);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.$setError(error);
        if (rethrowIt === 1) {
          throw error;
        }
      }
    }
    $propagateSuccess() {
      trace("XformCommonInterface.$propagateSuccess:" + this.formInterface);
      // this.$getParent(["form", "control"]).$propagateSuccess(error);
      const contador = ++$COUNTADOR1;
      Propagate_down: {
        console.log("propagate SUCCESS down now (to errors)" + contador + " " + this.formInterface);
        const propagableChildren = this.$getChildren(["error"]);
        console.log(propagableChildren);
        for (let index = 0; index < propagableChildren.length; index++) {
          const child = propagableChildren[index];
          child.$xform.$clearError();
        }
        console.log("ok down now (to errors)" + contador + " " + this.formInterface);
      }
      this.$clearError();
    }
  };

  const XformForm = class extends XformCommonInterface {
    formInterface = "Form";
    $onValidateInterfaceArguments() {
      trace("XformForm.$onValidateInterfaceArguments");
      const ensureEl = $ensure(this.$el);
      const ensureBinding = $ensure(this.$binding);
      const ensureValue = ensureBinding.its("value").type("object");
      const checkValue = $check(ensureValue.$subject);
    }
    submit() {
      trace("XformForm.submit");
      const resultado = this.validate();
      if(resultado !== true) throw new Error("Could not validate form");
      const value = this.getValue();
      const result = this.$hookWith("onSubmit", [value], this);
      if (typeof result !== "undefined") {
        return result;
      }
    }
    validate() {
      trace("XformForm.validate");
      try {
        const allChildren = this.$getChildren(["form", "control"]);
        let allErrors = 0;
        for (let indexChild = 0; indexChild < allChildren.length; indexChild++) {
          const child = allChildren[indexChild];
          console.log("Validating [from form] now child to validate:", child);
          try {
            const result = child.$xform.validate();
            if(!result) {
              allErrors++;
            }
          } catch (error) {
            allErrors++;
          }
        }
        if(allErrors > 0) {
          throw new Error(`Form has «${allErrors}» validation errors. Fix them to continue.`);
        }
        const resultado = super.validate();
        if(resultado !== true) {
          throw new Error("Could not validate form natively (calling super.validate) on «XformForm.validate»");
        }
        this.$propagateSuccess();
        return true;
      } catch (error) {
        this.$propagateError(error, 0, 1, 0);
        throw error;
      }
    }
  };

  const XformControl = class extends XformCommonInterface {
    formInterface = "Control";
    $onValidateInterfaceArguments() {
      trace("XformControl.$onValidateInterfaceArguments");
      const ensureEl = $ensure(this.$el);
      const ensureBinding = $ensure(this.$binding);
      const ensureValue = ensureBinding.its("value").type("object");
      const checkValue = $check(ensureValue.$subject);
      ensureValue.to.have.keys(["name"]).its("name").type("string").back();
      if (checkValue.to.have.key("onSetError")) {
        ensureValue.its("onSetError").type("function");
      }
      if (checkValue.to.have.key("onClearError")) {
        ensureValue.its("onClearError").type("function");
      }
      if (checkValue.to.have.key("onGetValue")) {
        ensureValue.its("onGetValue").type("function");
      }
      if (checkValue.to.have.key("onGetChildren")) {
        ensureValue.its("onGetChildren").type("function");
      }
      if (checkValue.to.have.key("onValidate")) {
        ensureValue.its("onValidate").type("function");
      }
    }
    $validateChildren() {
      trace("XformControl.$validateChildren");
      const allChildren = this.$getChildren(["form", "control", "input"]);
      for (let indexChild = 0; indexChild < allChildren.length; indexChild++) {
        const child = allChildren[indexChild];
        console.log("Validating [from control] now child to validate:", child);
        child.$xform.validate();
      }
      this.$propagateSuccess();
    }
    validate(deeply = false) {
      trace("XformControl.validate");
      try {
        const value = this.getValue();
        this.$hookWith("onValidate", [value, this]);
        this.$propagateSuccess();
        return true;
      } catch (error) {
        this.$propagateError(error, 0, 1, 0);
      }
    }
  };

  const XformInput = class extends XformCommonInterface {
    formInterface = "Input";
    validate() {
      trace("XformInput.validate");
      const value = this.getValue();
      this.$hookWith("onValidate", [value, this]);
      return true;
    }
    $onValidateInterfaceArguments() {
      trace("XformInput.$onValidateInterfaceArguments");
      const ensureEl = $ensure(this.$el);
      const ensureBinding = $ensure(this.$binding);
      const ensureValue = ensureBinding.its("value").type("object");
      const checkValue = $check(ensureValue.$subject);
      ensureValue.to.have.keys(["name"]).its("name").type("string").back();
      if (checkValue.to.have.key("onSetError")) {
        ensureValue.its("onSetError").type("function");
      }
      if (checkValue.to.have.key("onClearError")) {
        ensureValue.its("onClearError").type("function");
      }
      if (checkValue.to.have.key("onGetValue")) {
        ensureValue.its("onGetValue").type("function");
      }
    }
    getValue() {
      trace("XformInput.getValue");
      if (["INPUT", "TEXTAREA", "SELECT"].indexOf(this.$el.tagName) !== -1) {
        const ownValue = this.$el.value;
        return ownValue;
      } else {
        return super.getValue();
      }
    }
    $propagateSuccess() {
      const control = this.$getParent(["control"]);
      control.$xform.$propagateSuccess();
    }
  };

  const XformError = class extends XformCommonInterface {
    formInterface = "Error";
    $onValidateInterfaceArguments() {
      trace("XformError.$onValidateInterfaceArguments");
      const ensureEl = $ensure(this.$el);
      const ensureBinding = $ensure(this.$binding);
      const ensureValue = ensureBinding.its("value").type("object");
      const checkValue = $check(ensureValue.$subject);
      if (checkValue.to.have.key("onSetError")) {
        ensureValue.its("onSetError").type("function");
      }
      if (checkValue.to.have.key("onClearError")) {
        ensureValue.its("onClearError").type("function");
      }
    }
    validate() {
      // @EMPTY.
    }
    $getChildren() {
      trace("XformError.$getChildren");
      throw new Error(`Error can not contain children on «XformError.$getChildren»`);
    }
    getValue() {
      trace("XformError.getValue");
      throw new Error(`Error can not contain a value on «XformError.getValue»`);
    }
    $setError(error) {
      trace("XformError.$setError");
      this.$error = error;
      this.$el.classList.add("error_is_affecting_field");
      try {
        const summarizedError = error.summarized();
        summarizedError.stack2 = summarizedError.stack.map(tr => {
          return tr.split("\n").map((msg, errorIndex) => {
            const [callbackName, rest1] = LswUtils.splitStringOnce(msg, "@");
            if (!rest1) {
              return [1, callbackName, rest1];
            }
            const rest2 = LswUtils.reverseString(rest1);
            const [columnReversed, rest3] = LswUtils.splitStringOnce(rest2, ":");
            if (!rest3) {
              return [3, rest3, columnReversed, callbackName];
              return msg;
            }
            const [lineReversed, errorSource] = LswUtils.splitStringOnce(rest3, ":");
            if (!errorSource) {
              return [5, errorSource, lineReversed, rest3, columnReversed, callbackName];
              return msg;
            }
            const line = LswUtils.reverseString(lineReversed);
            const column = LswUtils.reverseString(columnReversed);
            return `${errorIndex + 1}. ${LswUtils.reverseString(errorSource)}:${line}:${column}::${callbackName}`;
          }).join("\n")
        });
        this.$getErrorMessageElement().textContent = `${error.name}: ${error.message}.\n${summarizedError.stack2}`;
      } catch (error2) {
        this.$getErrorMessageElement().textContent = `${error.name}: ${error.message} [${error.stack}]`;
      }
      try {
        this.$hookWith("onSetError", [error, this]);
      } catch (error) {
        console.log(error);
      }
      return this;
    }
    $getErrorMessageElement() {
      return (this.$el.querySelector(".errorMessage") || this.$el);
    }
    $clearError() {
      trace("XformError.$clearError");
      this.$error = undefined;
      this.$el.classList.remove("error_is_affecting_field");
      this.$getErrorMessageElement().textContent = ``;
      this.$hookWith("onClearError", [this]);
      return this;
    }
  };

  const xformClasses = {
    form: XformForm,
    control: XformControl,
    input: XformInput,
    error: XformError,
  };

  Vue.directive("xform", {
    bind(el, binding) {
      trace("xform-directive.bind");
      // console.log(binding);
      const modifierType = Object.keys(binding.modifiers)[0];
      if (!(modifierType in xformClasses)) {
        throw new Error("Required directive «v-form» to be injected with a known modifier on «xform.bind»");
      }
      const xformClass = xformClasses[modifierType];
      const xformInstance = xformClass.create({ el, binding, scope: this }, modifierType);
      el.$xform = xformInstance;
    },
    unbind(el) {
      trace("xform-directive.unbind");
      delete el.$xform.$binding;
      delete el.$xform.$el;
      delete el.$xform;
    }
  });

  const XFormPublicAPI = {
    validateSettings(settings) {
      trace("XFormPublicAPI.validateSettings");
      const checkSettings = $check(settings);
      const ensureSettings = $ensure(settings).type("object").to.have.key("name");
      ensureSettings.its("name").type("string").back();
      if (checkSettings.to.have.key("input")) {
        const ensureInput = ensureSettings.its("input").type("object");
        ensureInput.to.have.uniquelyKeys(["props", "events"]);
        if(checkSettings.its("input").to.have.key("props")) {
          ensureInput.its("props").type("object");
        }
        if(checkSettings.its("input").to.have.key("events")) {
          ensureInput.its("events").type("object");
        }
      }
    }
  }

  return XFormPublicAPI;

});
// @code.end: LswXForm API