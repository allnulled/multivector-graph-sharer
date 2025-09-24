$proxifier.define("org.allnulled.lsw-conductometria.Entrada_de_diario", {
  Item: class extends $proxifier.AbstractItem {

  },
  List: class extends $proxifier.AbstractList {

  },
  SchemaEntity: class extends $proxifier.AbstractSchemaEntity {
    static getEntityId() {
      return "org.allnulled.lsw-conductometria.Entrada_de_diario@SchemaEntity";
    }
    static getName() {
      return "Entrada_de_diario";
    }
    static getVersion() {
      return "1.0.0";
    }
    static getMethods() {
      return {};
    }
    static getProperties() {
      return {
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
          hasDescription: "Día de la entrada",
          hasPlaceholder: false,
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
          hasDescription: "El contenido de esta entrada. Permite markdown.",
          hasPlaceholder: "El **contenido** de la entrada del diario.",
          hasExtraAttributes: {},
        }
      }
    }
    static getVirtualizerId() {
      return "org.allnulled.lsw-conductometria.Entrada_de_diario@Virtualizer";
    }
    static getFormSettings() {
      return {};
    }
    static getExtraAttributes() {
      return {
        readableName: "entrada de diario"
      };
    }
  },
  Virtualizer: class extends $proxifier.AbstractVirtualizer {

  }
});