(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswMarkdown'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswMarkdown'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const LswMarkdown = class {

    constructor(callback = () => {}) {
      this.localMarked = new marked.Marked();
      this.localMarked.use(markedKatex({}));
    }

    parse(markdownText) {
      return this.localMarked.parse(markdownText);
    }

  }

  LswMarkdown.global = new LswMarkdown(function(localMarked) {
    
  });

  return LswMarkdown;

});