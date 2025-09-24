# lsw-class-register

Class registrator tool for LSW.

## Installation

```sh
npm install -s @allnulled/lsw-class-register
```

## Importation

```html
<script src="node_modules/@allnulled/lsw-class-register/lsw-class-register.js"></script>
```

## API

The signatures of the classes are:

```js
class LswClassRegister {
    register(id, classDefinition, forceOverwrite = false) {
    unregister(id, silenceError = false) {
    instantiate(id, ...args) {
    async initialize(id, ...args) {
}
```

# Conclusion

This is a package used to pack some utilities. It is not used in the project right now.