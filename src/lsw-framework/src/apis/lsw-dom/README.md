# lsw-dom

DOM utilities for LSW.

## Installation

```sh
npm install -s @allnulled/lsw-dom
```

## Importation

```html
<script src="node_modules/@allnulled/lsw-dom/lsw-dom.js"></script>
<script src="node_modules/@allnulled/lsw-dom/lsw-vue2.js"></script>
```

## API

The signatures of the two classes are:

```js
class LswDom {
    static collectLeaves(originalCollection, selectorSequence = []) {}
    static getClosestParent(originalElement, selector) {}
    static getClosestChildren(originalElement, selector) {}
}
class LswVue2 {
    static getClosestParent(component, filterCallback) {}
    static extendComponent(baseComponent = {}) {}
}
```

# Conclusion

This is a package used to pack some utilities. It is not used in the project right now.