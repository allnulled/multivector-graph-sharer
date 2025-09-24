$proxifier.define("org.allnulled.lsw-conductometria.Preferencia_de_usuario", {
  Item: class extends $proxifier.AbstractItem {

  },
  List: class extends $proxifier.AbstractList {

  },
  SchemaEntity: class extends $proxifier.AbstractSchemaEntity {
    static getEntityId() {
      return "org.allnulled.lsw-conductometria.Preferencia_de_usuario@SchemaEntity";
    }
    static getName() {
      return "Preferencia_de_usuario";
    }
    static getVersion() {
      return "1.0.0";
    }
    static getMethods() {
      return {};
    }
    static getProperties() {
      return {
        tiene_clave: {
          isType: "text",
          isFormType: "text",
          isIndexed: true,
          isUnique: true,
          hasValidator(v) {},
          hasFormatter: false,
          hasLabel: "Tiene clave:",
          hasDescription: "La clave o identidad textual que se asociará a la preferencia de usuario",
          hasPlaceholder: "Clave o ID de la preferencia de usuario",
          hasExtraAttributes: {},
        },
        tiene_valor: {
          isType: "text",
          isFormType: "source-code",
          isIndexed: false,
          hasFormtypeParameters: {},
          hasValidator: function (v) {},
          hasFormatter: function (v) {},
          hasLabel: "Tiene valor:",
          hasDescription: "El valor de la preferencia de usuario, que el usuario puede cambiar si quiere, claro.",
          hasPlaceholder: "Valor de la preferencia de usuario",
          hasExtraAttributes: {},
        },
      }
    }
    static getVirtualizerId() {
      return "org.allnulled.lsw-conductometria.Preferencia_de_usuario@Virtualizer";
    }
    static getFormSettings() {
      return {};
    }
    static getExtraAttributes() {
      return {
        readableName: "preferencia de usuario"
      };
    }
  },
  Virtualizer: class extends $proxifier.AbstractVirtualizer {

  }
});