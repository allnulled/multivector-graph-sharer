(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswWikiUtils'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswWikiUtils'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  class LswWikiUtils {
    
    static async getCategorias() {
      Vue.prototype.$trace("LswWikiUtils.getCategorias");
      const categoriasTree = await Vue.prototype.$lsw.fs.evaluateAsTripiFileOrReturn("/kernel/wiki/categorias.tri", {});
      return categoriasTree;
    }

    static async getLibros() {
      Vue.prototype.$trace("LswWikiUtils.getLibros");
      const libros = await Vue.prototype.$lsw.fs.read_directory("/kernel/wiki/libros");
      return Object.keys(libros);
    }

    static async getLibro(libroId) {
      Vue.prototype.$trace("LswWikiUtils.getLibro");
      const libroAst = await Vue.prototype.$lsw.fs.evaluateAsTripiFileOrReturn(`/kernel/wiki/libros/${libroId}`, false);
      return libroAst;
    }

    static async getRevistas() {
      Vue.prototype.$trace("LswWikiUtils.getRevistas");
      const allCategorias = await this.getCategorias();
      const allArticulos = await Vue.prototype.$lsw.database.selectMany("Articulo");
      // @TODO:
      // ...
      // agrupar por semanas los articulos
      // según categorías principales
      // ...
      return [];
    }

  }

  return LswWikiUtils;

});