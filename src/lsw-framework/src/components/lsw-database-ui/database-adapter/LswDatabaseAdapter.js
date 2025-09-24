(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswDatabaseAdapter'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswDatabaseAdapter'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  class LswDatabaseAdapter extends Browsie {

  }

  return LswDatabaseAdapter;
});