# Documentación de clase SchemaEntity

Hay varias APIs incurriendo en esta documentación:

 - **API de Proxies**:
    - contiene la definición abstracta de AbstractSchemaEntity
    - define las instancias abstractas de SchemaEntity mediante 2 condiciones:
       - `aspectId`=`SchemaEntity`
       - extends `$proxifier.AbstractSchemaEntity`
 - **API de Schema**
    - usa a la API de Proxies para recavar las entidades del esquema de la base de datos
 - **API de Lifecycle**
    - el esquema se carga en el ciclo de vida
 - **API de Database**
    - el esquema se inyecta a la base de datos también

Los `SchemaEntity` derivan de la clase `AbstractSchemaEntity` definida en `lsw-proxifier/proxifier.unbundled.js`.

Se traducen a schema para IndexedDB en `LswSchema.prototype.adaptSchemaEntityToDatabaseSchema`, que se usa en:
  - `LswSchema.prototype.getSchemaByProxies`: llamado en el siguiente método.
  - `LswSchema.prototype.loadSchemaByProxies`: llamado en `LswFilecycle.prototype.onLoadSchema`.

El `onLoadSchema` del lifecycle tiene esta posición:

```js
    steps: [
      "onStarted",
      "onInitialize",
      "onInitialized",
      "onBoot",
      "onBooted",
      "onLoadModules",
      "onModulesLoaded",
      "onInstallModules",
      "onModulesInstalled",
      "onLoadSchema",
      "onSchemaLoaded",
      "onLoadDatabase",
      "onDatabaseLoaded",
      "onLoadApplication",
      "onApplicationLoaded",
      "onAllLoaded",
      "onFinished",
    ]
```

Esto puede cambiar a lo largo del desarrollo.