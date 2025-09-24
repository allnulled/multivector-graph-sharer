$proxifier.define("org.allnulled.lsw-conductometria.Articulo", {
  Item: class extends $proxifier.AbstractItem {

  },
  List: class extends $proxifier.AbstractList {

  },
  SchemaEntity: class extends $proxifier.AbstractSchemaEntity {
    static getEntityId() {
      return "org.allnulled.lsw-conductometria.Articulo@SchemaEntity";
    }
    static getName() {
      return "Articulo";
    }
    static getVersion() {
      return "1.0.0";
    }
    static getMethods() {
      return {};
    }
    static getProperties() {
      return {
        tiene_titulo: {
          isType: "text",
          isFormType: "text",
          isIndexed: true,
          hasValidator(v) {
            if(v.trim() === "") {
              throw new Error("Título no puede estar vacío");
            }
          },
          hasFormatter: false,
          hasLabel: "Tiene título:",
          hasDescription: "El título que se asociará a el artículo",
          hasPlaceholder: "Título de el artículo",
          hasExtraAttributes: {},
        },
        tiene_fecha: {
          isType: "text",
          isFormType: "date",
          isFormSubtype: "datetime",
          isIndexed: true,
          hasFormtypeParameters: {},
          hasValidator: function (v) {
            LswTimer.utils.isDatetimeOrThrow(v);
          },
          hasFormatter: function (v) {
            return LswTimer.utlis.getDateFromMomentoText(v);
          },
          hasInitialValue: function() {
            return LswTimer.utils.fromDateToDatestring(new Date(), false, false, true);
          },
          hasLabel: "Tiene fecha:",
          hasDescription: "Momento en que se creó el artículo",
          hasPlaceholder: false,
          hasExtraAttributes: {},
        },
        tiene_categorias: {
          isType: "text",
          isFormType: "text",
          isIndexed: true,
          hasFormtypeParameters: {},
          hasValidator(v) {
            // Ok.
          },
          hasFormatter: false,
          hasLabel: "Tiene categorias:",
          hasDescription: "El categorías de este artículo, separadas por «;» entre sí.",
          hasPlaceholder: "Categoría 1; categoría 2; categoría 3",
          hasExtraAttributes: {},
        },
        tiene_contenido: {
          isType: "text",
          isFormType: "long-text",
          isIndexed: false,
          hasFormtypeParameters: {},
          hasValidator(v) {
            // Ok.
          },
          hasFormatter: false,
          hasLabel: "Tiene contenido:",
          hasDescription: "El contenido de este artículo. Permite markdown.",
          hasPlaceholder: "El **contenido** de tu artículo o artículo.",
          hasExtraAttributes: {},
        },
        tiene_garantia: {
          isType: "text",
          isFormType: "options",
          isIndexed: true,
          hasFormtypeParameters: {
            type: "selector",
            available: ["muy inestable", "inestable", "ns/nc", "estable", "muy estable", "popular"],
            selectable: 1, // could be: number or "*" to all options
            defaultValue: "ns/nc",
          },
          hasInitialValue: function() {
            return "ns/nc";
          },
          hasValidator(v) {
            
          },
          hasFormatter: false,
          hasLabel: "Tiene garantía:",
          hasDescription: "Garantía de verdad del artículo. Puede ser «muy inestable», «inestable», «ns/nc», «estable», «muy estable», «popular»",
          hasPlaceholder: false,
          hasExtraAttributes: {},
        },
        tiene_tags: {
          isType: "text",
          isFormType: "long-text",
          isIndexed: false,
          hasFormtypeParameters: {},
          hasValidator(v) {
            // Ok.
          },
          hasFormatter: false,
          hasLabel: "Tiene tags:",
          hasDescription: "Una línea por cada tag",
          hasPlaceholder: "tag 1\ntag 2\ntag 3",
          hasExtraAttributes: {},
        },
      }
    }
    static getVirtualizerId() {
      return "org.allnulled.lsw-conductometria.Articulo@Virtualizer";
    }
    static getFormSettings() {
      return {};
    }
    static getExtraAttributes() {
      return {
        readableName: "artículo"
      };
    }
  },
  Virtualizer: class extends $proxifier.AbstractVirtualizer {

  }
});