# v-focus

Self-focus directive for vue@2.

## Snippet

```js
Vue.directive("focus", {
  inserted: function(el) {
    el.focus();
  }
});
```