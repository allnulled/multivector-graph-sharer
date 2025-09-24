// @code.start: v-focus API | @$section: Lsw Directives » v-focus directive
Vue.directive("focus", {
  inserted: function(el) {
    el.focus();
  }
});
// @code.end: v-focus API