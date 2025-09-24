(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTests'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTests'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswTests API | @$section: LswTests API » LswTests classes and functions
  
  // Example of usage:
  //* 
  LswTestRegistry.collect("Lsw Fifth Test", async function (test) {
    test("can wait 1 second", async function () {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    });
  });
  //*/

  return LswTestRegistry;
  // @code.end: LswTests API

});