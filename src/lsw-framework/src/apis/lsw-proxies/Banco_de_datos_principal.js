$proxifier.define("org.allnulled.lsw-conductometria.Banco_de_datos_principal", {
  Item: class extends $proxifier.AbstractItem {

  },
  List: class extends $proxifier.AbstractList {

  },
  SchemaEntity: class extends $proxifier.AbstractSchemaEntity {
    static getEntityId() {
      return "org.allnulled.lsw-conductometria.Banco_de_datos_principal@SchemaEntity";
    }
    static getName() {
      return "Banco_de_datos_principal";
    }
    static getVersion() {
      return "1.0.0";
    }
    static getMethods() {
      return {};
    }
    static getProperties() {
      return {
        tiene_nombre: {
          isType: "text",
          isFormType: "text",
          isIndexed: true,
          hasValidator(v) {
            // Ok.
          },
          hasFormatter: false,
          hasLabel: "Nombre del centro de datos:",
          hasDescription: "El nombre del centro de datos en cuestión que se está guardando en este registro de la base de datos.",
          hasPlaceholder: "Mi_base_de_datos_1",
          hasExtraAttributes: {},
        },
        tiene_datos: {
          isType: "text",
          isFormType: "text",
          isIndexed: true,
          hasValidator(v) {
            // Ok.
          },
          hasFormatter: false,
          hasLabel: "Datos del centro de datos:",
          hasDescription: "Los datos en sí de esta base de datos concreta.",
          hasPlaceholder: "Mi_base_de_datos_1",
          hasExtraAttributes: {},
        }
      }
    }
    static getVirtualizerId() {
      return "org.allnulled.lsw-conductometria.Banco_de_datos_principal@Virtualizer";
    }
    static getFormSettings() {
      return {};
    }
    static getExtraAttributes() {
      return {
        readableName: "concepto"
      };
    }
  },
  Virtualizer: class extends $proxifier.AbstractVirtualizer {

  }
});