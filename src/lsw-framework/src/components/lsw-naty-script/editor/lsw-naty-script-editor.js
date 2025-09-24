// @code.start: LswNatyScriptEditor API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswNatyScriptEditor component
Vue.component("LswNatyScriptEditor", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-naty-script-editor.data");
    return {
      currentPage: "buscador", // also: "editor", "buscador"
      // EDITOR:
      isOpenedFile: false,
      input: `Dios > dice { ok }`,
      output: false,
      error: false,
      errorSummary: false,
      // BUSCADOR:
      searcherMemory: {},
      searchText: "",
      searchOutput: [],
      // EXPLORADOR:
      hasSearched: false,
      natyFiles: false,
    };
  },
  methods: {
    async runTest() {
      this.$trace("lsw-naty-script-editor.methods.runTest");
      try {
        this.searcherMemory = {};
        this.output = NatyScriptParser.parse(this.input, {
          options: {
            memory: this.searcherMemory
          }
        });
        this.setError(false);
      } catch (error) {
        console.error(error);
        this.setError(error);
      }
    },
    setError(error = false) {
      this.$trace("lsw-naty-script-editor.methods.setError");
      this.error = error;
    },
    async load() {
      this.$trace("lsw-naty-script-editor.methods.load");
      const filesMap = await this.$lsw.fs.read_directory("/kernel/natyscript/data")
      const filesList = Object.keys(filesMap);
      this.natyFiles = filesList;
    },
    async exportAsFile() {
      this.$trace("lsw-naty-script-editor.methods.exportAsFile");
      const filesMap = await this.$lsw.fs.read_directory("/kernel/natyscript/data")
      const filesList = Object.keys(filesMap);
      const filename = await this.$lsw.dialogs.open({
        title: "Exportando fichero NatyScript",
        template: `
          <div class="pad_1">
            <div class="pad_vertical_1">Especifica el nombre del fichero (formato .naty):</div>
            <div class="pad_vertical_1 flex_row centered">
              <input class="flex_100 width_100" type="text" v-model="value" v-focus />
              <div class="flex_1">.naty</div>
            </div>
            <hr />
            <div class="pad_vertical_1 flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
            <div class="pad_vertical_1">Los siguientes valores están ocupados:</div>
            <ul class="pad_vertical_1">
              <li v-for="file, fileIndex in filesList"
                v-bind:key="'file_' + fileIndex">
                {{ file }}
              </li>
            </ul>
          </div>
        `,
        factory: {
          data: {
            filesList,
          }
        }
      });
      if(typeof filename !== "string") {
        return;
      }
      if(filename.trim() === "") {
        return;
      }
      if(filesList.indexOf(filename + ".naty") !== -1) {
        const overwriteConfirmation = await this.$lsw.dialogs.open({
          title: "El fichero natyscript indicado ya existe",
          template: `
            <div class="pad_1">
              <div class="pad_vertical_1">El fichero «${filename}.naty» ya existe. ¿Desea sobreescribirlo?</div>
              <hr />
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
        if(overwriteConfirmation === -1) {
          return;
        }
      }
      await this.$lsw.fs.write_file(`/kernel/natyscript/data/${filename}.naty`, this.input);
      this.$lsw.toasts.send({
        title: "Exportación de natyscript exitosa",
        text: `Fichero «${filename}.naty» exportado correctamente`
      });
    },
    openSearcher() {
      this.$trace("lsw-naty-script-editor.methods.openSearcher");
      this.currentPage = "buscador";
    },
    openEditor() {
      this.$trace("lsw-naty-script-editor.methods.openEditor");
      this.currentPage = "editor";
    },
    async openFile(fileId) {
      this.$trace("lsw-naty-script-editor.methods.openFile");
      this.currentPage = "editor";
      this.input = await this.$lsw.fs.read_file(`/kernel/natyscript/data/${fileId}`);
      this.isOpenedFile = fileId;
    },
    async saveFile() {
      this.$trace("lsw-naty-script-editor.methods.saveFile");
      const ruta = `/kernel/natyscript/data/${this.isOpenedFile}`;
      await this.$lsw.fs.write_file(ruta, this.input);
      this.$lsw.toasts.send({
        title: "Fichero natyscript guardado",
        text: `Fichero «${ruta}» correctamente`
      });
    },
    clearSearch() {
      this.$trace("lsw-naty-script-editor.methods.clearSearch");
      this.hasSearched = false;
    },
    digestSearch() {
      this.$trace("lsw-naty-script-editor.methods.digestSearch");
      // @TODO....
      // @TODO....
      // @TODO....
      // @TODO....
      // @TODO....
      // @TODO....
      // @TODO....
      this.searchOutput = [];
      this.hasSearched = true;
    }
  },
  watch: {
    error(error) {
      this.$trace("lsw-naty-script-editor.watch.error");
      if(error.expected) {
        error.expected = LswUtils.uniquizeArray(error.expected.map(sugg => sugg.description));
      }
    }
  },
  mounted() {
    this.$trace("lsw-naty-script-editor.mounted");
    this.load();
  },
  unmount() {
    this.$trace("lsw-naty-script-editor.unmount");
  }
});
// @code.end: LswNatyScriptEditor API