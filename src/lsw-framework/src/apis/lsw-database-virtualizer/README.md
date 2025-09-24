# lsw-database-virtualizer

Database virtualizer tool for LSW.

## Installation

```sh
npm install -s @allnulled/lsw-database-virtualizer
```

## Importation

```html
<script src="node_modules/@allnulled/lsw-database-virtualizer/lsw-database-virtualizer.js"></script>
<script src="node_modules/@allnulled/lsw-database-virtualizer/lsw-vue2.js"></script>
```

## API

The signatures of the classes are:

```js
class LswDatabaseVirtualizer {
    static create(...args) {}
    static start(...args) {}
    $lifecycle = [...];
    $defaultConfigurations = {...}
    $trace(method, args) {}
    configure(options = {}) {}
    setPhysicalConnection(physicalConnection) {}
    setVirtualConnection(virtualConnection) {}
    setSchema(schema) {}
    start() {}
    async onStart() {}
    async onStartValidation() {}
    async onValidateConnection() {}
    async onValidateSchema() {}
    async onFinishValidation() {}
    async onDeleteVirtualDatabase() {}
    async onStartClonation() {}
    async onCloneDatabase() {}
    async onFinishClonation() {}
    async onStartVirtualization() {}
    async onVirtualizeSchema() {}
    async onVirtualizeTables() {}
    async onVirtualizeColumns() {}
    async onFinishVirtualization() {}
    async onStartFormalization() {}
    async onFormalizeColumns() {}
    async onFormalizeTables() {}
    async onFormalizeSchema() {}
    async onFinishFormalization() {}
    async onReport() {}
    async onFinish() {}
}
```

# Conclusion

This is a package used to pack some utilities. It is not used in the project right now.