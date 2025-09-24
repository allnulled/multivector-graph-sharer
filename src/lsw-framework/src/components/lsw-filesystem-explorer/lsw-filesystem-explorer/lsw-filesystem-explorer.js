// @code.start: LswFilesystemExplorer API | @$section: Vue.js (v2) Components » Lsw Filesystem Explorer API » LswFilesystemExplorer component
Vue.component("LswFilesystemExplorer", {
  name: "LswFilesystemExplorer",
  template: $template,
  props: {
    absoluteLayout: {
      type: Boolean,
      default: () => false,
    },
    openedBy: {
      type: String,
      default: () => "/",
    }
  },
  data() {
    this.$trace("lsw-filesystem-explorer.data");
    return {
      is_ready: false,
      current_node: "/",
      current_node_parts: undefined,
      current_node_basename: undefined,
      current_node_basedir: undefined,
      current_node_contents: undefined,
      current_node_subnodes: [],
      current_node_is_file: false,
      current_node_is_directory: false,
      syntaxValidators: {},
      STANDARIZED_REFRESH_DELAY: 100
    };
  },
  methods: {
    open(...args) {
      this.$trace("lsw-filesystem-explorer.methods.open");
      return this.open_node(...args);
    },
    goUp() {
      this.$trace("lsw-filesystem-explorer.methods.goUp");
      const parts = this.current_node.split("/");
      parts.pop();
      const dest = this.normalize_path("/" + parts.join("/"));
      return this.open(dest);
    },
    async refresh() {
      this.$trace("lsw-filesystem-explorer.methods.refresh");
      this.is_ready = false;
      try {
        await this.open(this.current_node);
      } catch (error) {
        throw error;
      } finally {
        this.$nextTick(() => {
          this.is_ready = true;
          this.$forceUpdate(true);
        });
      }
    },
    normalize_path(subpath) {
      this.$trace("lsw-filesystem-explorer.methods.normalize_path");
      return this.$lsw.fs.resolve_path(this.current_node, subpath);
    },
    async open_node(subpath = this.current_node) {
      this.$trace("lsw-filesystem-explorer.methods.open_node");
      try {
        if (["", "/"].indexOf(subpath) !== -1) {
          return await this._openDirectory("/");
        }
        const temporaryPath = this.normalize_path(subpath);
        const is_directory = await this.$lsw.fs.is_directory(temporaryPath);
        if (is_directory) {
          return await this._openDirectory(temporaryPath);
        }
        const is_file = await this.$lsw.fs.is_file(temporaryPath);
        if (is_file) {
          return await this._openFile(temporaryPath);
        }
        throw new Error(`Cannot open path because it does not exist: ${temporaryPath} on «LswFilesystemExplorer.methods.open_node»`);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async processToCreateFile() {
      this.$trace("lsw-filesystem-explorer.methods.processToCreateFile");
      const filename = await this.$lsw.dialogs.open({
        title: "Crear fichero",
        template: `<div>
          <div class="pad_1">
            <div>Estás en la carpeta:</div>
            <div class="pad_2">{{ current_directory }}</div>
            <div>Di el nombre del nuevo fichero:</div>
            <div class="pad_top_1">
              <input class="width_100" type="text" placeholder="myfile.txt" v-model="filename" v-focus v-on:keyup.enter="() => accept(filename)" />
            </div>
          </div>
          <hr />
          <div class="flex_row centered pad_1">
            <div class="flex_100"></div>
            <div class="flex_1 pad_right_1">
              <button class="supermini nowrap danger_button" v-on:click="() => accept(filename)">Crear fichero</button>
            </div>
            <div class="flex_1">
              <button class="supermini nowrap " v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        </div>`,
        factory: {
          data() {
            return {
              current_directory: this.$lsw.fs.get_current_directory(),
              filename: "",
            };
          },
        },
      });
      if (!filename) return;
      const filepath = this.$lsw.fs.resolve_path(this.$lsw.fs.get_current_directory(), filename);
      await this.$lsw.fs.write_file(filepath, "");
      this.refresh();
    },
    async processToCreateDirectory() {
      this.$trace("lsw-filesystem-explorer.methods.processToCreateDirectory");
      const filename = await this.$lsw.dialogs.open({
        title: "Crear directorio",
        template: `<div>
          <div class="pad_1">
            <div>Estás en la carpeta:</div>
            <div class="pad_2">{{ current_directory }}</div>
            <div>Di el nombre del nuevo directorio:</div>
            <div class="pad_top_1">
              <input class="width_100" type="text" placeholder="myfolder" v-model="filename" v-focus v-on:keyup.enter="() => accept(filename)" />
            </div>
          </div>
          <hr />
          <div class="flex_row centered pad_1">
            <div class="flex_100"></div>
            <div class="flex_1 pad_right_1">
              <button class="supermini nowrap danger_button" v-on:click="() => accept(filename)">Sí, seguro</button>
            </div>
            <div class="flex_1">
              <button class="supermini nowrap " v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        </div>`,
        factory: {
          data() {
            return {
              current_directory: this.$lsw.fs.get_current_directory(),
              filename: "",
            };
          },
        },
      });
      if (!filename) return;
      const filepath = this.$lsw.fs.resolve_path(this.$lsw.fs.get_current_directory(), filename);
      await this.$lsw.fs.make_directory(filepath);
      this.refresh();
    },
    async processToDeleteDirectory() {
      this.$trace("lsw-filesystem-explorer.methods.processToDeleteDirectory");
      const confirmation = await this.$lsw.dialogs.open({
        title: "Eliminar directorio",
        template: `<div>
          <div class="pad_1">
            <div>¿Seguro que quieres eliminar el directorio?</div>
            <div class="pad_2">{{ current_directory }}</div>
          </div>
          <hr />
          <div class="flex_row centered pad_1">
            <div class="flex_100"></div>
            <div class="flex_1 pad_right_1">
              <button class="supermini nowrap danger_button" v-on:click="() => accept(true)">Sí, seguro</button>
            </div>
            <div class="flex_1">
              <button class="supermini nowrap " v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        </div>`,
        factory: {
          data: {
            current_directory: this.$lsw.fs.get_current_directory(),
          }
        }
      });
      if (!confirmation) return;
      await this.$lsw.fs.delete_directory(this.$lsw.fs.get_current_directory());
      this.refresh();
    },
    async processToDeleteFile() {
      this.$trace("lsw-filesystem-explorer.methods.processToDeleteFile");
      const confirmation = await this.$lsw.dialogs.open({
        title: "Eliminar fichero",
        template: `<div>
          <div class="pad_1">
            <div>¿Seguro que quieres eliminar el fichero?</div>
            <div class="pad_2">{{ current_file }}</div>
          </div>
          <hr />
          <div class="flex_row centered pad_1">
            <div class="flex_100"></div>
            <div class="flex_1 pad_right_1">
              <button class="supermini nowrap danger_button" v-on:click="() => accept(true)">Sí, seguro</button>
            </div>
            <div class="flex_1">
              <button class="supermini nowrap " v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        </div>`,
        factory: {
          data: {
            current_file: this.current_node,
          }
        }
      });
      if (!confirmation) return;
      await this.$lsw.fs.delete_file(this.current_node);
      const upperDir = (() => {
        const parts = this.current_node.split("/");
        parts.pop();
        return parts.join("/");
      })();
      this.refresh();
    },
    async processToRenameFile() {
      this.$trace("lsw-filesystem-explorer.methods.processToRenameFile");
      const elementType = this.current_node_is_file ? "fichero" : "directorio";
      const newName = await this.$lsw.dialogs.open({
        title: "Renombrar " + elementType,
        template: `<div>
          <div class="pad_1">
            <div>Refiriéndose al {{ elementType }}:</div>
            <div class="pad_2">{{ filename }}</div>
          </div>
          <div class="pad_1">
            <div>Di el nuevo nombre del {{ elementType }}:</div>
            <div class="pad_top_1">
              <input v-focus class="width_100" type="text" placeholder="Nuevo nombre aquí" v-model="new_filename" v-on:keyup.enter="() => accept(new_filename)" />
            </div>
          </div>
          <hr />
          <div class="flex_row centered">
            <div class="flex_100"></div>
            <div class="flex_1 pad_right_1">
              <button class="supermini nowrap danger_button" v-on:click="() => accept(new_filename)">Sí, seguro</button>
            </div>
            <div class="flex_1">
              <button class="supermini nowrap " v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        </div>`,
        factory: {
          data: {
            elementType,
            filename: this.current_node,
            new_filename: this.current_node.split("/").pop(),
          }
        }
      });
      if (newName === false) return;
      if (newName.trim() === "") return;
      const allParts = this.current_node.split("/");
      allParts.pop();
      const dirPath = "/" + allParts.join("/");
      const newFullpath = this.$lsw.fs.resolve_path(dirPath, newName);
      await this.$lsw.fs.rename(this.current_node, newName.replace(/^\/+/g, ""));
      await this.open(newFullpath);
    },
    async processToExecuteFile() {
      this.$trace("lsw-filesystem-explorer.methods.processToExecuteFile");
      const editorContents = this.$refs.editor.getContents();
      const AsyncFunction = (async function () { }).constructor;
      const asyncFunction = new AsyncFunction(editorContents);
      try {
        const result = await asyncFunction.call(this);
        this.$lsw.toasts.debug(result);
      } catch (error) {
        this.$lsw.toasts.showError(error);
      }
    },
    async processToLoadFile() {
      this.$trace("lsw-filesystem-explorer.methods.processToLoadFile");
      this.is_ready = false;
      const contents = await this.$lsw.fs.read_file(this.current_node);
      this.current_node_contents = contents;
      this.$nextTick(() => {
        this.is_ready = true;
      });
    },
    async processToSaveFile() {
      this.$trace("lsw-filesystem-explorer.methods.processToSaveFile");
      try {
        if (!this.$refs.editor) {
          throw new Error("No hay editor ahora mismo");
        }
        const editorContents = this.$refs.editor.getContents();
        await this.$lsw.fs.write_file(this.current_node, editorContents);
        this.$lsw.toasts.send({
          title: "Fichero guardado",
          text: "Hablamos de: " + this.current_node
        });
      } catch (error) {
        this.$lsw.toasts.showError(error);
      }
    },
    _setButtonsForFile() {
      this.$trace("lsw-filesystem-explorer.methods._setButtonsForFile");
      this.is_ready = false;
      this.current_node_is_file = true;
      this.current_node_is_directory = false;
      Setup_panel_top_on_file: {
        this.$refs.panelTop.setButtons({
          text: "➜",
          classes: "reversed",
          click: () => this.goUp(),
        });
      }
      Setup_panel_right_on_file: {
        const rightButtonsOnFile = [
          {
            text: "💾",
            click: () => this.processToSaveFile(),
          }, {
            text: "↔️",
            click: () => this.processToRenameFile(),
          }, {
            text: "🔄",
            click: () => this.processToLoadFile(),
          }, {
            text: "📄 🔥",
            classes: "danger_button",
            click: () => this.processToDeleteFile(),
          }
        ];
        BUTTON_INJECTION_HERE__RIGHT_PANEL: {
          // @INJECTABLE: add custom buttons for extensions:
          Button_to_execute_javascript: {
            if (this.current_node.endsWith(".js")) {
              rightButtonsOnFile.push({
                text: "⚡️ js",
                classes: "danger_button",
                click: () => this.processToExecuteFile(),
              });
            }
          }
          Button_to_compile_markdown_to_html: {
            if (this.current_node.endsWith(".md")) {
              rightButtonsOnFile.push({
                text: "🔩 md",
                classes: "",
                click: () => this.processToCompileMarkdown(),
              });
            }
          }
          Button_to_compile_pegjs_to_js: {
            if (this.current_node.endsWith(".pegjs")) {
              rightButtonsOnFile.push({
                text: "🔩 pegjs",
                classes: "",
                click: () => this.processToCompilePegjs(),
              });
            }
          }
          Button_to_compile_natyscript_to_json: {
            if (this.current_node.endsWith(".nsc")) {
              rightButtonsOnFile.push({
                text: "🔩 nsc",
                classes: "",
                click: () => this.processToCompileNatyscript(),
              });
            }
          }
          Button_to_format_code: {
            if (this.current_node.endsWith(".html")) {
              rightButtonsOnFile.push({
                text: "{html}",
                classes: "",
                click: () => this.processToFormatHtml(),
              });
            } else if (this.current_node.endsWith(".css")) {
              rightButtonsOnFile.push({
                text: "{css}",
                classes: "",
                click: () => this.processToFormatCss(),
              });
            } else if (this.current_node.endsWith(".js")) {
              rightButtonsOnFile.push({
                text: "{js}",
                classes: "",
                click: () => this.processToFormatJs(),
              });
              if(typeof cordova !== "undefined") {
                rightButtonsOnFile.push({
                  text: "📱⚡️",
                  classes: "",
                  click: () => this.processToExecuteFileOnAndroid(),
                });
              }
            }
          }
          Button_to_download_file: {
            rightButtonsOnFile.push({
              text: "📥",
              classes: "",
              click: () => this.processToDownloadFile(),
            });
          }
          Button_to_search_replace: {
            rightButtonsOnFile.push({
              text: "🔎↔️",
              classes: "",
              click: () => this.processToSearchReplace(),
            });
          }
          Button_to_validate_code: {
            if(this.hasSyntaxValidator(this.current_node)) {
              rightButtonsOnFile.push({
                text: "✅",
                classes: "",
                click: () => this.processToValidateCode(),
              });
            }
          }
        }
        this.$refs.panelRight.setButtons(...rightButtonsOnFile);
      }
      Setup_panel_bottom_on_file: {
        const bottomButtonsOnFile = [
          {
            text: "➕",
            click: () => this.increaseFontsize(),
          }, {
            text: "➖",
            click: () => this.decreaseFontsize(),
          }, {
            text: "✍🏻|🐒",
            click: () => this.toggleFontfamily(),
          }
        ];
        BUTTON_INJECTION_HERE__BOTTOM_PANEL: {
          // @INJECTABLE: add custom buttons for extensions:
          Button_to_view_code: {
            if (this.current_node.endsWith(".js")) {
              bottomButtonsOnFile.push({
                text: "🌈",
                click: () => this.openCodeViewerForJs()
              });
            } else if (this.current_node.endsWith(".css")) {
              bottomButtonsOnFile.push({
                text: "🌈",
                click: () => this.openCodeViewerForCss()
              });
            } else if (this.current_node.endsWith(".html")) {
              bottomButtonsOnFile.push({
                text: "🌈",
                click: () => this.openCodeViewerForHtml()
              });
            } else if (this.current_node.endsWith(".mmd")) {
              bottomButtonsOnFile.push({
                text: "🌈",
                click: () => this.openCodeViewerForMermaid()
              });
            }
          }
          Button_to_view_html: {
            if (this.current_node.endsWith(".html")) {
              bottomButtonsOnFile.push({
                text: "📻",
                classes: "",
                click: () => this.processToViewHtml(),
              });
            } else if (this.current_node.endsWith(".md")) {
              bottomButtonsOnFile.push({
                text: "📻",
                classes: "",
                click: () => this.processToViewMarkdown(),
              });
            }
          }
        }
        this.$refs.panelBottom.setButtons(...bottomButtonsOnFile);
      }
      this.$nextTick(() => {
        this.is_ready = true;
      });
    },
    _setButtonsForDirectory() {
      this.$trace("lsw-filesystem-explorer.methods._setButtonsForDirectory");
      this.is_ready = false;
      this.current_node_is_directory = true;
      this.current_node_is_file = false;
      Setup_panel_top_on_directory: {
        if (this.current_node === "/") {
          this.$refs.panelTop.setButtons();
        } else {
          this.$refs.panelTop.setButtons({
            text: "➜",
            classes: "reversed",
            click: () => this.goUp(),
          });
        }
      }
      Setup_panel_right_on_directory: {
        this.$refs.panelRight.setButtons({
          text: "📄+",
          click: () => this.processToCreateFile(),
        }, {
          text: "📁+",
          click: () => this.processToCreateDirectory(),
        }, {
          text: "📁 🔥",
          classes: "danger_button",
          click: () => this.processToDeleteDirectory()
        });
      }
      Setup_panel_bottom_on_directory: {
        this.$refs.panelBottom.setButtons();
      }
      this.$nextTick(() => {
        this.is_ready = true;
      });
    },
    increaseFontsize() {
      this.$trace("lsw-filesystem-explorer.methods.increaseFontsize");
      this.$refs.editor.increaseFontsize();
    },
    decreaseFontsize() {
      this.$trace("lsw-filesystem-explorer.methods.decreaseFontsize");
      this.$refs.editor.decreaseFontsize();
    },
    toggleFontfamily() {
      this.$trace("lsw-filesystem-explorer.methods.toggleFontfamily");
      this.$refs.editor.toggleFontfamily();
    },
    async _openFile(subpath) {
      this.$trace("lsw-filesystem-explorer.methods._openFile");
      this.current_node = subpath;
      const contents = await this.$lsw.fs.read_file(this.current_node);
      this.current_node_contents = contents;
      this._setButtonsForFile();
    },
    async _openDirectory(subpath) {
      this.$trace("lsw-filesystem-explorer.methods._openDirectory");
      this.current_node = subpath;
      const subnodes = await this.$lsw.fs.read_directory(this.current_node);
      const sortedSubnodes = {
        files: [],
        folders: []
      };
      Object.keys(subnodes).forEach(id => {
        const subnode = subnodes[id];
        const subnodeType = typeof subnode === "string" ? "files" : "folders";
        sortedSubnodes[subnodeType].push(id);
      });
      const formattedSubnodes = {};
      sortedSubnodes.folders.sort().forEach(folder => {
        formattedSubnodes[folder] = {};
      });
      sortedSubnodes.files.sort().forEach(file => {
        formattedSubnodes[file] = "...";
      });
      console.log(subnodes, formattedSubnodes);
      this.$lsw.fs.change_directory(subpath);
      this.current_node_subnodes = formattedSubnodes;
      this._setButtonsForDirectory();
    },
    __update_node_parts(newValue = this.current_node) {
      this.$trace("lsw-filesystem-explorer.methods.__update_node_parts");
      this.current_node_parts = newValue.split("/").filter(p => p !== "");
    },
    __update_current_node_basename(current_node_parts = this.current_node_parts) {
      this.$trace("lsw-filesystem-explorer.methods.__update_current_node_basename");
      if (current_node_parts.length) {
        this.current_node_basename = current_node_parts[current_node_parts.length - 1];
      } else {
        this.current_node_basename = "/";
      }
    },
    __update_current_node_basedir(current_node_parts = this.current_node_parts) {
      this.$trace("lsw-filesystem-explorer.methods.__update_current_node_basedir");
      if (current_node_parts.length > 1) {
        this.current_node_basedir = "/" + [].concat(current_node_parts).splice(0, current_node_parts.length - 1).join("/") + "/";
      } else {
        this.current_node_basedir = "/";
      }
    },
    _updateNodeSubdata(newValue = this.current_node) {
      this.$trace("lsw-filesystem-explorer.methods._updateNodeSubdata");
      this.__update_node_parts(newValue);
      this.__update_current_node_basename();
      this.__update_current_node_basedir();
    },
    setPanelButtons(panelOptions = {}) {
      this.$trace("lsw-filesystem-explorer.methods.setPanelButtons");
      Validation: {
        if (typeof panelOptions !== "object") {
          throw new Error("Required argument «panelOptions» to be an object on «LswFilesystemExplorer.methods.setPanelButtons»");
        }
        const keys = Object.keys(panelOptions);
        if (keys.length === 0) {
          throw new Error("Required argument «panelOptions» to be have 1 or more keys on «LswFilesystemExplorer.methods.setPanelButtons»");
        }
        const valid_keys = ["top", "bottom", "left", "right"];
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index];
          if (valid_keys.indexOf(key) === -1) {
            throw new Error(`Required argument «panelOptions[${key}]» to be a valid key out of «${valid_keys.join(",")}», not «${key}» on «LswFilesystemExplorer.methods.setPanelButtons»`);
          }
          const value = panelOptions[key];
          if (typeof value !== "object") {
            throw new Error(`Required argument «panelOptions[${key}]» to be an object or array, not ${typeof value}» on «LswFilesystemExplorer.methods.setPanelButtons»`);
          }
        }
      }
    },
    async openCodeViewerForJs() {
      this.$trace("lsw-filesystem-explorer.methods.openCodeViewerForJs");
      console.log(this.current_node_contents);
      this.$lsw.dialogs.open({
        title: "Visualizando código JS",
        template: `
          <div class="pad_1">
            <div class="">{{ file }}:</div>
            <hr />
            <lsw-code-viewer :code="code" language="js" />
          </div>`,
        factory: {
          data: {
            file: this.current_node,
            code: this.$refs.editor.getContents(),
          }
        },
      })
    },
    async openCodeViewerForCss() {
      this.$trace("lsw-filesystem-explorer.methods.openCodeViewerForCss");
      this.$lsw.dialogs.open({
        title: "Visualizando código CSS",
        template: `
          <div class="pad_1">
            <div class="">{{ file }}:</div>
            <hr />
            <lsw-code-viewer :code="code" language="css" />
          </div>`,
        factory: {
          data: {
            file: this.current_node,
            code: this.$refs.editor.getContents(),
          }
        },
      })
    },
    async openCodeViewerForHtml() {
      this.$trace("lsw-filesystem-explorer.methods.openCodeViewerForHtml");
      this.$lsw.dialogs.open({
        title: "Visualizando código HTML",
        template: `
          <div class="pad_1">
            <div class="">{{ file }}:</div>
            <hr />
            <lsw-code-viewer :code="code" language="html" />
          </div>`,
        factory: {
          data: {
            file: this.current_node,
            code: this.$refs.editor.getContents(),
          }
        },
      });
    },
    async openCodeViewerForMermaid() {
      this.$trace("lsw-filesystem.explorer.methods.openCodeViewerForMermaid");
      this.$lsw.dialogs.open({
        title: "Visualizando código HTML",
        template: `
          <div class="pad_1">
            <div class="">{{ file }}:</div>
            <hr />
            <lsw-mermaid-viewer :initial-source="code" initial-page="visualizador" />
          </div>`,
        factory: {
          data: {
            file: this.current_node,
            code: this.$refs.editor.getContents(),
          }
        },
      });
    },
    async processToCompileMarkdown() {
      this.$trace("lsw-filesystem.explorer.methods.processToCompileMarkdown");
      const mdContent = this.$refs.editor.getContents();
      const htmlContent = LswMarkdown.global.parse(mdContent);
      const fileoutput = await this.$lsw.dialogs.open({
        title: "Compilar markdown a html",
        template: `
          <div class="pad_1">
            <div>¿A qué fichero quieres exportar el html? Especifica solo el nombre:</div>
            <!--lsw-sourceable :code="htmlContent"-->
            <input class="width_100" type="text" v-model="value" />
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            value: this.current_node.replace(this.current_node_basedir, "").replace(/\.md$/, ".html"),
          }
        }
      });
      if (typeof fileoutput !== "string") {
        return;
      }
      const filepath = this.$lsw.fs.resolve_path(this.current_node_basedir, fileoutput);
      try {
        this.$lsw.fs.write_file(filepath, htmlContent);
        this.$lsw.toasts.send({
          title: "Markdown compilado a HTML",
          text: "La salida está en: " + filepath,
        });
      } catch (error) {
        this.$lsw.toasts.showError(error, false, true);
      }
    },
    async processToCompileNatyscript() {
      this.$trace("lsw-filesystem.explorer.methods.processToCompileNatyscript");
      const currentFile = this.current_node;
      const natyscriptContent = this.$refs.editor.getContents();
      const jsonData = NatyScriptParser.parse(natyscriptContent);
      const jsonContent = JSON.stringify(jsonData, null, 2);
      const jsonFile = currentFile.replace(/\.nsc$/g, ".json")
      this.$lsw.fs.write_file(jsonFile, jsonContent);
    },
    async processToCompilePegjs() {
      this.$trace("lsw-filesystem.explorer.methods.processToCompilePegjs");
      const currentFile = this.current_node;
      const pegjsContent = this.$refs.editor.getContents();
      const parserOptions = await this.$lsw.dialogs.open({
        title: "Compilar pegjs a js",
        template: `
          <div class="pad_1">
            <div>Global a la que exportar:</div>
            <input class="width_100" type="text" v-model="value.exportVar" />
            <hr />
            <div>Fichero final:</div>
            <input class="width_100" type="text" v-model="value.output" />
            <hr />
            <div>Formato de exportación:</div>
            <input class="width_100" type="text" v-model="value.format" />
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1">
                <button class="supermini" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            value: {
              format: 'globals',
              output: this.current_node.replace(this.current_node_basedir, "").replace(/\.pegjs/g, ".js"),
              exportVar: 'DemoParser',
            }
          }
        }
      });
      if (typeof parserOptions !== "object") return;
      const fileoutput = parserOptions.output;
      const parserFormat = parserOptions.format;
      const parserExporter = parserOptions.exportVar;
      await this.$lsw.lazyLoads.loadPegjs();
      const filepath = this.$lsw.fs.resolve_path(this.current_node_basedir, fileoutput);
      try {
        const jsContent = PEG.buildParser(pegjsContent, {
          output: "source",
          format: parserFormat,
          exportVar: parserExporter,
        });
        this.$lsw.fs.write_file(filepath, jsContent);
        this.$lsw.toasts.send({
          title: "Pegjs compilado a JavaScript",
          text: "La salida está en: " + filepath,
        });
      } catch (error) {
        this.$lsw.toasts.showError(error, false, true);
      }
    },
    async processToFormatHtml() {
      this.$trace("lsw-filesystem.exporer.methods.processToFormatHtml");
      try {
        const input = this.$refs.editor.getContents();
        await this.$lsw.lazyLoads.loadBeautifier();
        const output = beautifier.html(input);
        this.$refs.editor.setContents(output);
      } catch (error) {
        this.$lsw.toasts.showError(error, false, true);
      }
    },
    async processToFormatCss() {
      this.$trace("lsw-filesystem.exporer.methods.processToFormatCss");
      try {
        const input = this.$refs.editor.getContents();
        await this.$lsw.lazyLoads.loadBeautifier();
        const output = beautifier.css(input);
        this.$refs.editor.setContents(output);
      } catch (error) {
        this.$lsw.toasts.showError(error, false, true);
      }
    },
    async processToFormatJs() {
      this.$trace("lsw-filesystem.exporer.methods.processToFormatJs");
      try {
        const input = this.$refs.editor.getContents();
        await this.$lsw.lazyLoads.loadBeautifier();
        const output = beautifier.js(input);
        this.$refs.editor.setContents(output);
        this.$lsw.toasts.send({
          title: "Documento formateado",
          text: "El documento fue formateado en js correctamente"
        });
      } catch (error) {
        this.$lsw.toasts.showError(error, false, true);
      }
    },
    processToExecuteFileOnAndroid() {
      this.$trace("lsw-filesystem.exporer.methods.processToExecuteFileOnAndroid");
      return LswAndroid.evalFile(this.current_node);
    },
    async processToDownloadFile() {
      this.$trace("lsw-filesystem.explorer.methods.processToDownloadFile");
      const filename = this.current_node.replace(this.current_node_basedir, "");
      LswUtils.debug(filename);
      const confirmation = await this.$lsw.dialogs.open({
        title: "Descargar fichero",
        template: `
          <div class="pad_1">
            <div class="pad_top_1">¿Qué nombre quieres para el fichero a descargar?</div>
            <input type="text" class="width_100 margin_top_1" v-model="value" /> 
            <hr />
            <div class="flex_row centered pad_top_1">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="supermini danger_button" v-on:click="() => accept(value)">
                  Aceptar
                </button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="supermini " v-on:click="cancel">
                  Cancelar
                </button>
              </div>
            </div>
          </div>`,
        factory: {
          data: {
            value: filename
          }
        },
      });
      LswUtils.debug(confirmation);
      if (typeof confirmation !== "string") return;
      const filecontents = this.current_node_contents;
      LswUtils.downloadFile(filename, filecontents);
    },
    processToViewHtml() {
      this.$trace("lsw-filesystem.explorer.methods.processToCompilePegjs");
      const htmlContent = this.$refs.editor.getContents();
      return this.$lsw.dialogs.open({
        title: "Ver html en vivo",
        template: `
          <div class="pad_1">
            ${htmlContent}
          </div>
        `,
      });
    },
    processToViewMarkdown() {
      this.$trace("lsw-filesystem.explorer.methods.processToCompilePegjs");
      const mdContent = this.$refs.editor.getContents();
      const htmlContent = LswMarkdown.global.parse(mdContent);
      return this.$lsw.dialogs.open({
        title: "Ver markdown en vivo",
        template: `
          <div class="pad_1">
            ${htmlContent}
          </div>
        `,
      });
    },
    async processToSearchReplace() {
      this.$trace("lsw-filesystem.explorer.methods.processToSearchReplace");
      let selectedText = "";
      Extract_selected_text: {
        try {
          const textareaHtml = this.$refs.editor.$refs.editorTextarea;
          selectedText = textareaHtml.value.substring(textareaHtml.selectionStart, textareaHtml.selectionEnd);
        } catch (error) {
          // @BADLUCK
          console.log(error);
        }
      }
      const fse = this;
      const value = await this.$lsw.dialogs.open({
        title: "Buscar y reemplazar",
        template: `
          <lsw-search-replacer
            :input="input"
            :initial-search="search"
            :initial-replace="replace"
            :on-accept="out => accept(out)"
            :on-cancel="comeBack"
          />
        `,
        factory: {
          data: {
            input: this.$refs.editor.getContents(),
            search: selectedText,
            replace: selectedText,
          },
          methods: {
            comeBack() {
              this.cancel();
              fse.$refs.editor.gainFocus();
            }
          }
        }
      });
      if (typeof value !== "string") return;
      this.$refs.editor.setContents(value);
    },
    processToValidateCode() {
      this.$trace("lsw-filesystem.explorer.methods.processToValidateCode");
      const currentContents = this.$refs.editor.getContents();
      const syntaxExtensions = Object.keys(this.syntaxValidators).map(id => "." + id);
      let associatedSyntax = undefined;
      Iterating_syntaxes:
      for (let index = 0; index < syntaxExtensions.length; index++) {
        const syntaxExtension = syntaxExtensions[index];
        const isSyntaxCompliant = this.current_node.endsWith(syntaxExtension);
        if (isSyntaxCompliant) {
          associatedSyntax = syntaxExtension;
          break Iterating_syntaxes;
        }
      }
      if (!associatedSyntax) {
        return -1;
      }
      const associatedValidator = this.syntaxValidators[associatedSyntax];
      if (!associatedValidator) {
        return -2;
      }
      try {
        const isValid = associatedValidator(currentContents);
        this.$lsw.toasts.debug(isValid);
      } catch (error) {
        this.$lsw.toasts.showError(error);
      }
    },
    async loadSyntaxValidators() {
      this.$trace("lsw-filesystem-explorer.methods.loadSyntaxValidators");
      const validatorsAsMap = await this.$lsw.fs.read_directory("/kernel/editor/validators");
      const ids = Object.keys(validatorsAsMap).map(f => f.replace(/\.js/g, ""));
      const allValidators = {};
      for(let index=0; index<ids.length; index++) {
        const id = ids[index];
        const validator = await this.$lsw.fs.evaluateAsJavascriptFileOrReturn(`/kernel/editor/validators/${id}.js`, () => true);
        allValidators[id] = validator;
      }
      this.syntaxValidators = allValidators;
      
    },
    hasSyntaxValidator(file) {
      const currentExtension = file.replace(/^([^.]*\.)+/g, "");
      return Object.keys(this.syntaxValidators || {}).indexOf(currentExtension) !== -1;
    },
  },
  watch: {
    current_node(newValue) {
      this.$trace("lsw-filesystem-explorer.watch.current_node");
      this._updateNodeSubdata(newValue);
    }
  },
  computed: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-filesystem-explorer.mounted");
      await this.loadSyntaxValidators();
      this.$lsw.fsExplorer = this;
      // await this.initializeFilesystemForLsw();
      await this.open(this.openedBy ?? "/");
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswFilesystemExplorer API