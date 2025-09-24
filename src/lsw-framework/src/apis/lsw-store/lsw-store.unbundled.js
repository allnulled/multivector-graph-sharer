(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswStore'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswStore'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const LswStore = class extends UniversalStore {

    async hydrate() {
      const storePath = this.$storePath;
      const storeContents = await Vue.prototype.$lsw.fs.read_file(storePath);
      const storeData = JSON.parse(storeContents);
      this.$store = storeData;
    }

    async dehydrate() {
      const storePath = this.$storePath;
      const storeData = this.$store;
      const storeContents = JSON.stringify(storeData, null, 2);
      await Vue.prototype.$lsw.fs.write_file(storePath, storeContents);
    }

  };

  return LswStore;

});