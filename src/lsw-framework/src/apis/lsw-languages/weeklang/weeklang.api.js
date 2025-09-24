(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswWeekLang'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswWeekLang'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  return {
    parser: WeekLang,
  }

});