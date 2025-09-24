$proxifier.define("org.allnulled.lsw-conductometria.Automensaje", {
  Item: class extends $proxifier.AbstractItem {

  },
  List: class extends $proxifier.AbstractList {

  },
  SchemaEntity: class extends $proxifier.AbstractSchemaEntity {
    static getEntityId() {
      return "org.allnulled.lsw-conductometria.Automensaje@SchemaEntity";
    }
    static getName() {
      return "Automensaje";
    }
    static getVersion() {
      return "1.0.0";
    }
    static getMethods() {
      return {};
    }
    static getProperties() {
      return {
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
          hasDescription: "El contenido de este automensaje. Permite markdown.",
          hasPlaceholder: "El **contenido** de tu automensaje o artículo.",
          hasExtraAttributes: {},
        }
      }
    }
    static getVirtualizerId() {
      return "org.allnulled.lsw-conductometria.Automensaje@Virtualizer";
    }
    static getFormSettings() {
      return {};
    }
    static getExtraAttributes() {
      return {
        readableName: "automensaje"
      };
    }
  },
  Virtualizer: class extends $proxifier.AbstractVirtualizer {

  }
});