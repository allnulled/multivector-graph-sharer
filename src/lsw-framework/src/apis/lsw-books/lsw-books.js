(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswBooks'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswBooks'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const PickableCommon = class {
    
    static for(...args) {
      return new this(...args);
    }

    constructor(table) {
      this.$table = table;
    }

    static normalizeStrangeSymbols(txt, onlyLowers = true) {
      if(onlyLowers) {
        return txt
          .toLowerCase()
          .trim()
          .replaceAll("á", "a")
          .replaceAll("é", "e")
          .replaceAll("i", "i")
          .replaceAll("ó", "o")
          .replaceAll("ú", "u");
      }
      return txt
        .toLowerCase()
        .trim()
        .replaceAll("Á", "A")
        .replaceAll("É", "E")
        .replaceAll("Í", "I")
        .replaceAll("Ó", "O")
        .replaceAll("Ú", "U")
        .replaceAll("á", "a")
        .replaceAll("é", "e")
        .replaceAll("i", "i")
        .replaceAll("ó", "o")
        .replaceAll("ú", "u");
    }

  };

  const PickableSingular = class extends PickableCommon {

    byName(name) {
      return Vue.prototype.$lsw.database.selectFirst(this.$table, it => it.tiene_titulo === name);
    }

    byId(id) {
      return Vue.prototype.$lsw.database.selectFirst(this.$table, it => it.id === id);
    }

  };

  const PickablePlural = class extends PickableCommon {

    all() {
      return Vue.prototype.$lsw.database.selectMany(this.$table);
    }

    where(callback) {
      return Vue.prototype.$lsw.database.selectMany(this.$table, callback);
    }

    byCategory(category) {
      const categoryNormalized = this.constructor.normalizeStrangeSymbols(category);
      return Vue.prototype.$lsw.database.selectMany(this.$table, it => it.tiene_categorias.split(";").reduce((out, itsCategory) => {
        const itsCategoryNormalized = this.constructor.normalizeStrangeSymbols(itsCategory);
        return out = out || (itsCategoryNormalized === categoryNormalized);
      }, false));
    }

  };

  const LswBooks = class {

    static pick = {
      note: PickableSingular.for("Nota"),
      notes: PickablePlural.for("Nota"),
      article: PickableSingular.for("Articulo"),
      articles: PickablePlural.for("Articulo"),
    };

    static toMarkdown(listOrItem, prop = "tiene_contenido") {
      if(Array.isArray(listOrItem)) {
        const output = [];
        for(let index=0; index<listOrItem.length; index++) {
          const item = listOrItem[index];
          const markableText = this.toMarkdown(item, prop);
          output.push(markableText);
        }
        return output.join("\n");
      } else if(typeof listOrItem === "object") {
        return LswMarkdown.global.parse(listOrItem[prop]);
      }
      throw new Error("Required parameter 1 «listOrItem» to be an array or an object on «LswBooks.toMarkdown»");
    }

  };

  return LswBooks;

});