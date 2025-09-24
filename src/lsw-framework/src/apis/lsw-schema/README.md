# lsw-schema

Schema builder and manager tool for LSW.

## Installation

```sh
npm i -s @allnulled/lsw-schema
```

## Importation

From node.js:

```js
require("@allnulled/lsw-schema");
```

From html:

```html
<script src="node_modules/@allnulled/lsw-schema/lsw-schema.js"></script>
```

## Usage

```js
class LswSchema {
    getDatabaseSchemaForLsw(refresh = false) {}
    adaptSchemaEntityToDatabaseSchema(SchemaEntityClass) {}
    registerSchema(partialSchema = {}}) {}
    $validateSchema(schema) {}
    $fusionateSchema(partialSchema) {}
    $validateSchemaNative(schema) {}
    $validateTableNative(definition, id, schema) {}
    $validateColumnNative(id, definition, tableId, schema) {}
    $fusionateSchemaNative(partialSchema) {}
    $fusionateTableNative(tableInfo, tableId, partialSchema) {}
    $fusionateColumnNative(columnInfo, columnId, tableId, partialSchema) {}
}
```

## Test

