// @code.start: LswDataPrinterReport API | @$section: Vue.js (v2) Components » LswDataPrinterReport component
Vue.component("LswDataPrinterReport", {
  template: $template,
  props: {
    input: {
      type: [Object, String, Boolean, Number],
      default: () => false,
    },
  },
  data() {
    this.$trace("lsw-data-printer-report.data");
    const inputType = typeof(this.input);
    const availableOptions = (() => {
      switch(inputType) {
        case "string":
          return ["Crudo", "Markdown", "Solo texto plano"];
        default:
          return ["Crudo", "Natural"];
      }
    })();
    return {
      availableOptions,
      selectedSection: "Crudo",
      inputType,
    };
  },
  methods: {
    copyCrude() {
      this.$trace("lsw-data-printer-report.methods.copyCrude");
      const json = JSON.stringify(this.input, null, 2);
      this.$window.navigator.clipboard.writeText(json);
      this.$lsw.toasts.send({
        title: "Texto copiado correctamente!"
      });
    },
    askForFilename() {
      return this.$lsw.dialogs.open({
        title: "Descargar en fichero",
        template: `
          <div class="pad_1">
            <div>¿Qué nombre de fichero quieres para la descarga?</div>
            <input class="width_100 margin_top_1" type="text" v-model="value" />
            <hr />
            <div class="flex_row centered pad_1">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="accept">Descargar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: { data: { value: "" } },
      });
    },
    async downloadCrude() {
      this.$trace("lsw-data-printer-report.methods.downloadCrude");
      const filename = await this.askForFilename();
      if(filename === -1) return;
      LswUtils.downloadFile(filename, JSON.stringify(this.input, null, 2));
    },
    copyNatural() {
      this.$trace("lsw-data-printer-report.methods.copyNatural");
      const text = this.inputNatural;
      this.$window.navigator.clipboard.writeText(text);
      this.$lsw.toasts.send({
        title: "Texto copiado correctamente!"
      });
    },
    async downloadNatural() {
      this.$trace("lsw-data-printer-report.methods.downloadNatural");
      const filename = await this.askForFilename();
      if(filename === -1) return;
      LswUtils.downloadFile(filename, this.inputNatural);
    },
    copyMarkdown() {
      this.$trace("lsw-data-printer-report.methods.copyMarkdown");
      const text = this.inputMarkdown;
      this.$window.navigator.clipboard.writeText(text);
      this.$lsw.toasts.send({
        title: "Texto copiado correctamente!"
      });
    },
    async downloadMarkdown() {
      this.$trace("lsw-data-printer-report.methods.downloadMarkdown");
      const filename = await this.askForFilename();
      if(filename === -1) return;
      LswUtils.downloadFile(filename, this.inputMarkdown);
    },
    copyHtml() {
      this.$trace("lsw-data-printer-report.methods.copyHtml");
      const text = this.inputHtml;
      this.$window.navigator.clipboard.writeText(text);
      this.$lsw.toasts.send({
        title: "Texto copiado correctamente!"
      });
    },
    async downloadHtml() {
      this.$trace("lsw-data-printer-report.methods.downloadHtml");
      return this.$window.alert("Exportación a HTML no disponible. xD");
      const filename = await this.askForFilename();
    },
    copyPlain() {
      this.$trace("lsw-data-printer-report.methods.copyPlain");
      const text = this.inputPlain;
      this.$window.navigator.clipboard.writeText(text);
      this.$lsw.toasts.send({
        title: "Texto copiado correctamente!"
      });
    },
    async downloadPlain() {
      this.$trace("lsw-data-printer-report.methods.downloadPlain");
      const filename = await this.askForFilename();
      if(filename === -1) return;
      LswUtils.downloadFile(filename, this.inputPlain);
    }
  },
  computed: {
    inputNatural() {
      this.$trace("lsw-data-printer-report.computed.inputNatural");
      return LswUtils.fromJsonToNatural(this.input);
    },
    inputMarkdown() {
      this.$trace("lsw-data-printer-report.computed.inputMarkdown");
      return LswMarkdown.global.parse(this.input);
    },
    inputPlain() {
      this.$trace("lsw-data-printer-report.computed.inputPlain");
      return LswDom.extractPlaintextFromHtmltext(this.inputMarkdown);
    }
  },
  watch: {},
  mounted() {
    this.$trace("lsw-data-printer-report.mounted");
    
  },
  unmounted() {
    this.$trace("lsw-data-printer-report.unmounted");
    
  }
});
// @code.end: LswDataPrinterReport API