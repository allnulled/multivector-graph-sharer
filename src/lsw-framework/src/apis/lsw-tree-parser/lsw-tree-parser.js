(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTreeParser'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTreeParser'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  return TripilangParser;

});