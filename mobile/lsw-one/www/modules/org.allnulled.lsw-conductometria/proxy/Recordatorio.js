$proxifier.define("org.allnulled.lsw-conductometria.Recordatorio", {
  Item: class extends $proxifier.AbstractItem {

  },
  List: class extends $proxifier.AbstractList {

  },
  SchemaEntity: class extends $proxifier.AbstractSchemaEntity {
    static getEntityId() {
      return "org.allnulled.lsw-conductometria.Recordatorio@SchemaEntity";
    }
    static getName() {
      return "Recordatorio";
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
            // Ok.
          },
          hasFormatter: false,
          hasLabel: "Tiene título:",
          hasDescription: "El título que se asociará a el recordatorio",
          hasPlaceholder: "Título del recordatorio",
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
          hasLabel: "Tiene fecha:",
          hasDescription: "Momento en que se creó el recordatorio",
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
          hasDescription: "El categorías de este recordatorio, separadas por «;» entre sí.",
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
          hasDescription: "El contenido de este recordatorio. Permite markdown.",
          hasPlaceholder: "El **contenido** de tu recordatorio.",
          hasExtraAttributes: {},
        }
      }
    }
    static getVirtualizerId() {
      return "org.allnulled.lsw-conductometria.Recordatorio@Virtualizer";
    }
    static getFormSettings() {
      return {};
    }
    static getExtraAttributes() {
      return {
        readableName: "recordatorio"
      };
    }
  },
  Virtualizer: class extends $proxifier.AbstractVirtualizer {

  }
});