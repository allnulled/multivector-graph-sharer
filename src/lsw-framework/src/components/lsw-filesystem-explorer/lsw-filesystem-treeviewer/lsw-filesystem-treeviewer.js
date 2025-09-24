// @code.start: LswFilesystemTreeviewer API | @$section: Vue.js (v2) Components » Lsw Filesystem Explorer API » LswFilesystemTreeviewer component
Vue.component("LswFilesystemTreeviewer", {
  name: "LswFilesystemTreeviewer",
  template: $template,
  props: {
    explorer: {
      type: Object,
      required: true
    }
  },
  data() {
    this.$trace("lsw-filesystem-treeviewer.data");
    return {};
  },
  watch: {},
  methods: {
    goUp() {
      this.$trace("lsw-filesystem-treeviewer.methods.goUp");
      return this.explorer.goUp();
    },
    openSubnode(subnodeIndex) {
      this.$trace("lsw-filesystem-treeviewer.methods.openSubnode");
      return this.explorer.open(subnodeIndex);
    },
    async deleteNode(subnodeIndex) {
      this.$trace("lsw-filesystem-treeviewer.methods.deleteNode");
      const fullpath = this.$lsw.fs.resolve_path(subnodeIndex);
      const isDirectory = await this.$lsw.fs.is_directory(fullpath);
      const elementType = isDirectory ? 'directorio' : 'fichero';
      const confirmation = await this.$lsw.dialogs.open({
        title: `Proceder a eliminar ${elementType}`,
        template: `
          <div class="pad_1">
            <div>Seguro que quieres eliminar el {{ elementType }} «{{ fullpath }}»?</div>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_right_1">
                <button class="supermini danger_button nowrap" v-on:click="() => accept(true)">Sí, eliminar</button>
              </div>
              <div class="flex_1">
                <button class="supermini" v-on:click="() => accept(false)">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            elementType,
            fullpath,
          }
        }
      });
      if (!confirmation) return;
      try {
        if (isDirectory) {
          await this.$lsw.fs.delete_directory(fullpath);
        } else {
          await this.$lsw.fs.delete_file(fullpath);
        }
        await this.explorer.refresh();
      } catch (error) {
        await this.$lsw.dialogs.open({
          title: `El fichero no se pudo eliminar`,
          template: `
            <div class="pad_1">
              <div>El fichero «{{ fullpath }}» no se pudo eliminar debido al siguiente error:</div>
              <hr />
              <div v-if="error">{{ error.name }}: {{ error.message }}</div>
            </div>
          `,
          factory: {
            data: {
              error,
              fullpath,
            }
          }
        });
      }
    },
    async renameNode(subnodeIndex) {
      this.$trace("lsw-filesystem-treeviewer.methods.renameNode");
      const fullpath = this.$lsw.fs.resolve_path(subnodeIndex);
      const isDirectory = await this.$lsw.fs.is_directory(fullpath);
      const elementType = isDirectory ? 'directorio' : 'fichero';
      const newName = await this.$lsw.dialogs.open({
        title: "Renombrar " + elementType,
        template: `<div>
          <div class="pad_1">
            <div>Refiriéndose al {{ elementType }}:</div>
            <div class="pad_2">{{ filename }}</div>
            <div>Di el nuevo nombre del {{ elementType }}:</div>
            <input v-focus class="width_100" type="text" v-model="newFilename" v-on:keyup.enter="() => accept(newFilename)" />
          </div>
          <hr />
          <div class="flex_row centered pad_1">
            <div class="flex_100"></div>
            <div class="flex_1 pad_right_1">
              <button class="supermini" v-on:click="() => accept(newFilename)">Renombrar</button>
            </div>
            <div class="flex_1">
              <button class="supermini" v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        </div>`,
        factory: {
          data: {
            elementType,
            fullpath,
            filename: subnodeIndex,
            newFilename: subnodeIndex,
          }
        }
      });
      if (typeof newName !== "string") return;
      if (newName.trim() === "") return;
      await this.$lsw.fs.rename(subnodeIndex, newName.replace(/^\/+/g, ""));
      this.explorer.refresh();
    }
  },
  mounted() {
    this.$trace("lsw-filesystem-treeviewer.mounted");
    this.explorer.setPanelButtons({
      top: [],
      left: [],
      right: [],
      bottom: [],
    })
  },
  unmounted() {
    this.$trace("lsw-filesystem-treeviewer.unmounted");
  }
});
// @code.end: LswFilesystemTreeviewer API