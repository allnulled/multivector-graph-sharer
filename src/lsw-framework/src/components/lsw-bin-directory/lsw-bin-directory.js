// @code.start: LswBinDirectory API | @$section: Vue.js (v2) Components » LswBinDirectory component
Vue.component("LswBinDirectory", {
  template: $template,
  props: {
    directory: {
      type: String,
      required: true,
    },
  },
  data() {
    this.$trace("lsw-bin-directory.data");
    return {
      hasError: false,
      isLoaded: false,
      isAboutSearching: false,
      searchText: "",
      binaries: [],
      binariesInSelection: [],
      delayedTimeout: 0.7 * 1000,
      delayedTimeoutId: undefined,
    };
  },
  methods: {
    async loadBinaries() {
      this.$trace("lsw-bin-directory.methods.loadBinaries");
      try {
        this.isLoaded = false;
        const allBinaries = await this.$lsw.fs.$selectMany(it => {
          return it.type === "file" && it.filepath.startsWith("/kernel/bin") && it.filepath.endsWith(".js");
        });
        this.binaries = allBinaries;
        await this.digestOutput();
      } catch (error) {
        this.$lsw.toasts.send({
          title: "No pudieron cargarse los binarios",
          text: 'Hubo un error al cargar los binarios'
        });
        console.error(`[!] Could not load bin-directory «${this.directory}» because:`, error);
        this.hasError = error;
      } finally {
        this.isLoaded = true;
      }
    },
    digestOutput() {
      this.$trace("lsw-bin-directory.methods.digestOutput");
      return new Promise((resolve, reject) => {
        let output = [];
        try {
          this.isAboutSearching = true;
          Apply_search: {
            if (this.searchText.trim() === "") {
              output = this.binaries;
              break Apply_search;
            }
            const loweredSearchText = this.searchText.toLowerCase();
            for (let index = 0; index < this.binaries.length; index++) {
              const binarie = this.binaries[index];
              const hasMatch = binarie.filepath.toLowerCase().indexOf(loweredSearchText) !== -1;
              if (hasMatch) {
                output.push(binarie);
              }
            }
          }
          return resolve(output);
        } catch (error) {
          return reject(error);
        } finally {
          Export_results: {
            this.isAboutSearching = false;
            this.binariesInSelection = output;
          }
        }
      });
    },
    digestDelayed() {
      this.$trace("lsw-bin-directory.methods.digestDelayed");
      clearTimeout(this.delayedTimeoutId);
      this.isAboutSearching = true;
      this.delayedTimeoutId = setTimeout(this.digestOutput, this.delayedTimeout);
    },
    async executeBin(binarie) {
      this.$trace("lsw-bin-directory.methods.executeBin");
      const asyncBin = LswUtils.createAsyncFunction(binarie.content);
      try {
        const output = await asyncBin.call(this);
        Aqui_se_hookearia_pero_creo_que_no: {
          console.log(output);
        }
        return output;
      } catch (error) {
        this.$lsw.toasts.sendError(error);
      }
    },
    editBin(binarie) {
      this.$trace("lsw-bin-directory.methods.editBin");
      this.$lsw.dialogs.open({
        title: "Editando binario",
        template: `<lsw-filesystem-explorer :opened-by="binarie.filepath" :absolute-layout="true" />`,
        factory: { data: { binarie } },
      });
    },
    openBinarios() {
      this.$trace("lsw-bin-directory.methods.openBinarios");
      this.$lsw.dialogs.open({
        title: "Explorando binarios",
        template: `<lsw-filesystem-explorer opened-by="/kernel/bin" :absolute-layout="true" />`
      });
    },
    formatFilepathForUser(txt) {
      return txt.replace(this.directory, "").replace(/^\//g, "").replace(/\.js$/g, "");
    }
  },
  mounted() {
    this.$trace("lsw-bin-directory.mounted");
    this.loadBinaries();
  },
  unmount() {
    this.$trace("lsw-bin-directory.unmounted");
    // @OK
  }
});
// @code.end: LswBinDirectory API