(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['DgnFetch'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['DgnFetch'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const DgnFetch = class {
    
    static async fetch(...args) {
      const response = await fetch(...args);
      try {
        const finalResponse = await response.json();
        if(finalResponse.ok === false) {
          Vue.prototype.$lsw.toasts.send({
            title: "La petición devolvió un error:",
            text: finalResponse.error,
          });
        }
        return finalResponse;
      } catch (error) {
        Vue.prototype.$lsw.toasts.send({
          title: "La petición produjo un error:",
          text: error.message,
        });
        return response;
      }
    }

  };

  return DgnFetch;

});