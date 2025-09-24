// @code.start: DgnFilesystemHomepage API | @$section: Vue.js (v2) Components » Lsw Filesystem UI API » DgnFilesystemHomepage component
Vue.component("DgnFilesystemHomepage", {
  template: $template,
  props: {},
  data() {
    this.$trace("dgn-filesystem-homepage.data");
    return {
      selectedNode: "/",
      content: [
        ["/static", "folder", "/static"],
        ["/template", "folder", "/template"],
      ]
    };
  },
  methods: {
    goUp() {
      this.$trace("dgn-filesystem-homepage.methods.goUp");
      const parts = this.selectedNode.substr(1).split("/");
      parts.pop();
      const supernode = "/" + parts.join("/");
      return this.goTo(supernode);
    },
    async goTo(node) {
      this.$trace("dgn-filesystem-homepage.methods.goTo");
      if(node === "/") {
        this.content = [
          ["/static", "folder", "/static"],
          ["/template", "folder", "/template"],
        ];
        this.selectedNode = "/";
      } else {
        const response = await DgnFetch.fetch("/api/v1/filesystem/isFile", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            token: DgnLoginManager.global.getToken(),
            path: node
          })
        });
        const { path: newNode, isFile } = response.data.output;
        if(isFile === true) {
          const response = await DgnFetch.fetch("/api/v1/filesystem/readFile", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              token: DgnLoginManager.global.getToken(),
              path: node,
            })
          });
          console.log(response);
          this.content = response.data.output.content;
        } else {
          const response = await DgnFetch.fetch("/api/v1/filesystem/readDirectory", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              token: DgnLoginManager.global.getToken(),
              path: node,
            })
          });
          const content = [];
          const contentPromises = [];
          for(let index=0; index<response.data.output.length; index++) {
            const subnodePart = response.data.output[index];
            const subnode = LswUtils.joinPaths(node, subnodePart);
            const subnodePromise = DgnFetch.fetch("/api/v1/filesystem/isFile", {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify({
                token: DgnLoginManager.global.getToken(),
                path: subnode
              })
            });
            contentPromises.push(subnodePromise);
          }
          const subnodeResponses = await Promise.all(contentPromises);
          for(let index=0; index<subnodeResponses.length; index++) {
            const subnodeResponse = subnodeResponses[index];
            const { path: subnodePath, isFile } = subnodeResponse.data.output;
            content.push([subnodePath.replace(node, ""), isFile ? 'file' : 'folder', subnodePath]);
          }
          this.content = content;
        }
        this.selectedNode = newNode;
      }
    },
    async createFile() {
      this.$trace("dgn-filesystem-homepage.methods.createFile");
      const filename = await this.$lsw.dialogs.open({
        title: "📄 Crear fichero",
        template: `
          <div class="pad_1">
            <div class="pad_bottom_1">¿Qué nombre de fichero quieres crear?</div>
            <input class="supermini width_100" type="text" v-model="value" />
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
        `,
      });
      if(typeof filename !== "string") return;
      if(filename.trim() === "") return;
      await DgnFetch.fetch("/api/v1/filesystem/writeFile", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          path: this.selectedNode + "/" + filename,
          content: " ",
        })
      });
      this.goTo(this.selectedNode);
    },
    async createDirectory() {
      this.$trace("dgn-filesystem-homepage.methods.createDirectory");
      const filename = await this.$lsw.dialogs.open({
        title: "📁 Crear directorio",
        template: `
          <div class="pad_1">
            <div class="pad_bottom_1">¿Qué nombre de directorio quieres crear?</div>
            <input class="supermini width_100" type="text" v-model="value" />
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
        `,
      });
      if(typeof filename !== "string") return;
      if(filename.trim() === "") return;
      await DgnFetch.fetch("/api/v1/filesystem/makeDirectory", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          path: this.selectedNode + "/" + filename,
        })
      });
      this.goTo(this.selectedNode);
    },
    async saveFile() {
      this.$trace("dgn-filesystem-homepage.methods.saveFile");
      await DgnFetch.fetch("/api/v1/filesystem/writeFile", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: DgnLoginManager.global.getToken(),
          path: this.selectedNode,
          content: this.content || " ",
        })
      });
    }
  },
  watch: {},
  mounted() {
    this.$trace("dgn-filesystem-homepage.mounted");
  },
});
// @code.end: DgnFilesystemHomepage API