// @code.start: DgnFilesystemExplorer API | @$section: Vue.js (v2) Components » Lsw Filesystem UI API » DgnFilesystemExplorer component
Vue.component("DgnFilesystemExplorer", {
  template: $template,
  props: {
    homepage: {
      type: Object,
      required: true,
    }
  },
  data() {
    this.$trace("dgn-filesystem-explorer.data");
    return {
      
    };
  },
  methods: {
    async deleteFile(subnode) {
      this.$trace("dgn-filesystem-explorer.methods.deleteFile");
      const confirmation = await this.$lsw.dialogs.open({
        title: "🔥 ❌ Eliminar fichero",
        template: `
          <div class="pad_1">
            <div class="">¿Seguro que quieres eliminar el fichero?</div>
            <hr/>
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `
      });
      if(confirmation === -1) return;
      await DgnFetch.fetch("/api/v1/filesystem/deleteFile", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          path: subnode,
        })
      });
      await this.homepage.goTo(this.homepage.selectedNode);
    },
    async deleteDirectory(subnode) {
      this.$trace("dgn-filesystem-explorer.methods.deleteDirectory");
      const confirmation = await this.$lsw.dialogs.open({
        title: "🔥 ❌ Eliminar directorio",
        template: `
          <div class="pad_1">
            <div class="">¿Seguro que quieres eliminar el directorio?</div>
            <hr/>
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `
      });
      if(confirmation === -1) return;
      await DgnFetch.fetch("/api/v1/filesystem/deleteDirectory", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          path: subnode,
        })
      });
      await this.homepage.goTo(this.homepage.selectedNode);
    },
  },
  watch: {},
  mounted() {
    this.$trace("dgn-filesystem-explorer.mounted");
  },
});
// @code.end: DgnFilesystemExplorer API