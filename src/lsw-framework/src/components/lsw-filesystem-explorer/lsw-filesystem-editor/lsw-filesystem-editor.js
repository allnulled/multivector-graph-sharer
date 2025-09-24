// @code.start: LswFilesystemEditor API | @$section: Vue.js (v2) Components » Lsw Filesystem Explorer API » LswFilesystemEditor component
Vue.component("LswFilesystemEditor", {
  name: "LswFilesystemEditor",
  template: $template,
  props: {
    explorer: {
      type: Object,
      required: true
    },
    filecontents: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      contents: this.filecontents,
      cursorPosition: false,
      currentFontsize: 12,
      currentFontfamily: "Arial"
    };
  },
  watch: {

  },
  methods: {
    getContents() {
      return this.contents;
    },
    setContents(contents) {
      this.contents = contents;
    },
    gainFocus() {
      this.$refs.editorTextarea.focus();
    },
    increaseFontsize() {
      this.$trace("lsw-filesystem-editor.methods.increaseFontsize");
      this.currentFontsize++;
    },
    decreaseFontsize() {
      this.$trace("lsw-filesystem-editor.methods.decreaseFontsize");
      this.currentFontsize--;
    },
    toggleFontfamily() {
      this.$trace("lsw-filesystem-editor.methods.toggleFontfamily");
      if(this.currentFontfamily === "monospace") {
        this.currentFontfamily = "Arial";
      } else {
        this.currentFontfamily = "monospace";
      }
    },
    async saveDocument() {
      this.$trace("lsw-filesystem-editor.methods.saveDocument");
      await this.$lsw.fs.write_file(this.explorer.current_node, this.contents);
      this.$lsw.toasts.send({
        title: "Documento guardado",
        text: "El documento se guardó correctamente"
      });
    },
    async executeDocument() {
      this.$trace("lsw-filesystem-editor.methods.executeDocument");
      if(this.explorer.current_node.endsWith(".js")) {
        Ejecutar_javascript_asincronamente: {
          this.explorer.processToExecuteFile();
        }
      }
    },
    async executeMobileDocument() {
      this.$trace("lsw-filesystem-editor.methods.executeMobileDocument");
      if(this.explorer.current_node.endsWith(".js")) {
        Ejecutar_javascript_asincronamente: {
          this.explorer.processToExecuteFileOnAndroid();
        }
      }
    },
    beautifyDocument() {
      this.$trace("lsw-filesystem-editor.methods.beautifyDocument");
      const fsExplorer = LswDom.getClosestParent(this.$el, ".lsw_filesystem_explorer");
      if(!fsExplorer) return;
      LswDom.querySelectorFirst("button", "{js}", fsExplorer).click();
    },
    searchReplace() {
      this.$trace("lsw-filesystem-editor.methods.searchReplace");
      const fsExplorer = LswDom.getClosestParent(this.$el, ".lsw_filesystem_explorer");
      if(!fsExplorer) return;
      LswDom.querySelectorFirst("button", "🔎↔️", fsExplorer).click();
    },
    synchronizeCursor() {
      this.$trace("lsw-filesystem-editor.methods.synchronizeCursor");
      const editorHtml = this.$refs.editorTextarea;
      const offsetStart = editorHtml.selectionStart
      const offsetEnd = editorHtml.selectionEnd;
      let lineStart = undefined;
      let lineEnd = undefined;
      let columnStart = undefined;
      let columnEnd = undefined;
      Col_start: {
        const beforeCursor = editorHtml.value.slice(0, offsetStart);
        const lines = beforeCursor.split("\n");
        lineStart = lines.length - 1;
        columnStart = lines[lines.length - 1].length;
      }
      Col_end: {
        const beforeCursor = editorHtml.value.slice(0, offsetEnd);
        const lines = beforeCursor.split("\n");
        lineEnd = lines.length - 1;
        columnEnd = lines[lines.length - 1].length;
      }
      const cursor = {
        start: {
          offset: offsetStart,
          line: lineStart,
          column: columnStart,
        },
        end: {
          offset: offsetEnd,
          line: lineEnd,
          column: columnEnd,
        }
      };
      this.cursorPosition = cursor;
      return cursor;
    }
  },
  mounted() {

  }
});
// @code.end: LswFilesystemEditor API