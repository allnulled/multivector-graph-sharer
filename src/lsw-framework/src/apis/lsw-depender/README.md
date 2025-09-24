# lsw-depender

Dependency manager abstraction for LSW.

## Installation

```sh
npm install -s @allnulled/lsw-depender
```

## Importation

```html
<script src="node_modules/@allnulled/lsw-depender/lsw-depender.js"></script>
```

## API

The signatures of the two classes are:

```js
class LswDepender {
    hasDefined(name)
    define(...args)
    resolve(idsInput = this, defs = this.$definitions)
    addDefinition(name, definition, shouldFailOnRedundancy = 1, shouldOverrideOnRedundancy = 1)
    addUniqueDefinitions(moreDefinitions = {})
    addMissingDefinitions(moreDefinitions = {})
    resetDefinitions(moreDefinitions = {})
    deleteDefinitions(definitionsInput = [])
}
```

# Conclusion

This is a package used to pack some utilities. It is not used in the project right now.