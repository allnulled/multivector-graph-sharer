(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['DgnLoginManager'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['DgnLoginManager'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const DgnLoginManager = class {

    static create(...args) {
      return new this(...args);
    }

    constructor() {
      this.token = "admin"; 
    }

    async askForToken() {
      const token = await Vue.prototype.$lsw.dialogs.open({
        title: "🔑 Credenciales de administración",
        template: `
          <div class="pad_1">
            <div class="">
              <div class="pad_bottom_1">¿Qué token quieres utilizar para la identificación de las peticiones de administración?</div>
              <input class="supermini width_100" type="text" v-model="value" />
            </div>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            value: "",
          }
        }
      });
      if(typeof token === "number") return;
      if(token.trim() === "") return;
      this.setToken(token);
    }

    setToken(token) {
      Vue.prototype.$trace("DgnLoginManager.setToken");
      this.token = token;
    }

    getToken() {
      Vue.prototype.$trace("DgnLoginManager.getToken");
      return this.token;
    }

  };

  DgnLoginManager.global = DgnLoginManager.create();

  return DgnLoginManager;

});